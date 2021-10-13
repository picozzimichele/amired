import Header from './Header';
import BoardPost from './BoardPost';
import BoardHeader from './BoardHeader';
import Post from './Post';
import Avatar from "./amiredavatar.png"
import { PhotographIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"

import { asynchronize } from './Asyncronize';
import { useState, useEffect, useCallback } from 'react';
import ASCClient, { ConnectionStatus, ApiEndpoint, UserRepository, PostRepository, PostTargetType, FileRepository, CommentRepository } from '@amityco/js-sdk';
const util = require('util')

//Amity Keys go here 
const apiKey = "b0edec533288f53648318f1c060d42dbd0588eb3b3613a2a";
const apiEndpoint = ApiEndpoint.EU;

//Initialize client only once 
//Initialization of Amity SDK
const client = new ASCClient({ apiKey, apiEndpoint });

const DummyUser = {
  userId: "123456789",
  username: "User1"
}

//url image --> display in posts

//CLIENT
client.registerSession ({
  userId: DummyUser.userId,
  displayName: DummyUser.username,
})


function App() {
  //const [isLoading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsImageUrl, setPostsImageUrl] = useState({});
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState("");
  const [updatedText, setUpdatedText] = useState("");
  const [newValue, setNewValue] = useState("")

  //USERINFO
  const [userInfo, setUserInfo] = useState({})

  //COMMENTS
  const [postComments, setPostComments] = useState([])

  //CALLBACK STATES
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isNotLiking, setIsNotLiking] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [image, setImage] = useState(null)

  //FILE
  const [file, setFile] = useState();
  const { register } = useForm()

  console.log(posts, " FROM STATE")

  useEffect(() => {
    // typical/standard way
    client.currentUser.on('dataUpdated', setUserInfo)
    client.currentUser.model && setUserInfo(client.currentUser.model)

    return () => client.currentUser.dispose()
  }, [])

  useEffect(() => {
    client.on('connectionStatusChanged', ({ oldValue, newValue }) => {
      console.log("OLD VALUE IS " + oldValue)
      console.log("NEW VALUE IS " + newValue)
      setNewValue(newValue)
    });
  }, [])
  // listen to connectionStatus event

  //CREATE THE POST

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    const commentPost = { comment }
    //FetchRequest to store the post with amity SDK
    await PostRepository.createTextPost({
      targetId: client.currentUserId,
      targetType: PostTargetType.UserFeed,
      text: commentPost.comment,
    })

      //clear comment field
      setComment("")

    }, [comment])

  const handleChange = (e) => {
    if(e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }  
  const handleUpload = useCallback(async () => {
    //Uploading the IMAGE
    const liveFile = FileRepository.createFile({ file: image })
    console.log(liveFile.loadingStatus, JSON.stringify(liveFile.model) + "LIVE FILE")

    //Destructuring fileId and fileUrl
    const { fileId, fileUrl } = await asynchronize(liveFile)
    console.log(liveFile.loadingStatus, liveFile.model)
    console.log(fileId, fileUrl + " FILE URL, FILE ID") //able to display correctly

    setImage(null)

    //Create the image post
    const parentPostModel = await asynchronize(
      PostRepository.createImagePost({
        targetId: client.currentUserId,
        targetType: PostTargetType.UserFeed,
        imageIds: [fileId], // max: 10
      })
    )

    console.log(JSON.stringify(parentPostModel + " PARENT POST MODEL"))

    const childPostId = parentPostModel.children[0]

    const childPost = await asynchronize(
      PostRepository.postForId(childPostId)
    )

    const [childFileId] = childPost.data.imageIds

    const childLiveFile = await asynchronize(
      FileRepository.getFile(childFileId)
    )

    console.log(liveFile.loadingStatus, JSON.stringify(liveFile.model) + "LIVE FILE MODEL")
    console.log(childLiveFile.loadingStatus, JSON.stringify(childLiveFile.model) + "CHILD FILE MODEL")


    //returns two post and one child

    setPostsImageUrl({ fileUrl })

  }, [image])

  //CREATE A COMMENT TO A POST
  const postComment = useCallback(async (postId, newComment) => {

    if (isCommenting) return

    setIsCommenting(true)

    await CommentRepository.createTextComment({
      referenceType: 'post',
      referenceId: postId,
      text: newComment,
    });

    setIsCommenting(false)

  }, [isCommenting])

  const addReaction = useCallback(async (postid) => {
    if (isLiking) return

    setIsLiking(true)

    await PostRepository.addReaction({
      postId: postid,
      reactionName: 'like',
     })

    setIsLiking(false) 
    
  }, [isLiking])

  const removeReaction = useCallback(async (postid) => {
    if (isNotLiking) return

    setIsNotLiking(true)

    await PostRepository.removeReaction({
      postId: postid,
      reactionName: 'like',
    })

    setIsNotLiking(false) 
  }, [isNotLiking])
    
  const deletePost = useCallback(async (postId) => {
    if (isDeleting) return

    setIsDeleting(true)

    await PostRepository.deletePost(postId)

    setIsDeleting(false)

  }, [isDeleting])

  const updatePost = useCallback(async (postId, updatedText) => {

    if (isUpdating) return

    setIsUpdating(true)

    await PostRepository.updatePost({
      postId: postId,
      data: { text: updatedText},
    });
  }, [isUpdating])

  useEffect((postId) => {
    const comments = CommentRepository.queryComments({ 
      referenceType: 'post',
      referenceId: postId,
      first: 20 // or last: 5
    });
    
    comments.on('dataUpdated', data => {
      // reload comment table
      console.log((JSON.stringify(data)) + "DATA FROM COMMENTS")
      setPostComments(data.map(allComment => ({
        postComment: allComment.data.text,
        postCommentId: allComment.referenceId
      })))
    });
    
    comments.on('dataError', error => {
      console.log('Comment LiveCollections can not query/get/sync data from server');
    });
  }, [postComment])

  useEffect(() => {
    const liveFeed = PostRepository.queryUserPosts({
      userId: client.currentUserId
    });
    
    liveFeed.once('dataUpdated', posts => {
      console.log(posts.map(post => post))
      console.log(posts)

      setPosts(posts.map(post => ({
        postId: post.postId,
        postDataText: post.data.text,
        reactionsCount: post.reactionsCount,
        postedUserId: post.postedUserId,
        sharedUserId: post.sharedUserId,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,

      })))
    });

  }, [deletePost, handleSubmit, addReaction, removeReaction, updatePost, postComment, handleUpload])


  console.log(Date.now() + " DATE")

    return (
      <>
        <Header displayName={userInfo.displayName} />
        <BoardHeader />
        <div className="px-20 bg-black">
        <BoardPost 
          handleSubmit={handleSubmit} 
          setComment={setComment} 
          comment={comment}
        />
        {posts.map((post) => 
          <Post 
            postId={post.postId} 
            postedUserId={post.postedUserId} 
            postDataText={post.postDataText}
            commentsCount={post.commentsCount}
            reactionsCount={post.reactionsCount}
            createdAt={post.createdAt}
            //Reactions
            deletePost={deletePost}
            addReaction={addReaction}
            removeReaction={removeReaction}
            //Update & Display Comment
            postComment={postComment}
            postComments={postComments}
            newComment={newComment}
            setNewComment={setNewComment}
            //Update Post
            updatePost={updatePost}
            updatedText={updatedText}
            setUpdatedText={setUpdatedText}
          />
        )}
      </div>

      {/* <div className="flex flex-col w-full items-center mt-12 mx-20">
        <div className="flex text-center w-1/3">  
          <input 
            type="file" 
            onChange={handleChange}
          />
          <button onClick={handleUpload} className="ml-3 border-2 rounded px-3">Upload</button>
        </div>
      </div> */}
      </>
    );
  }

export default App;
