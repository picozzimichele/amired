import './App.css';
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
  const [postComments ,setPostComments] = useState([])

  //CALLBACK STATES
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isNotLiking, setIsNotLiking] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [image, setImage] = useState(null)

  //FILE
  const [file, setFile] = useState();

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

      //clear comment fieldf
      setComment("")

    }, [comment])

  const handleChange = (e) => {
    if(e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }  

  /*
    to understand how to split components, lists and objects
    https://github.com/AmityCo/Amity-Social-Cloud-Web-Sample-Apps/tree/main/create-react-app-simple-chat


    App
      Login ->
      Main -> 
        Chatroom -> Feed
          MessageList -> PostQuery
            MessageItem -> Post
              MessageContent
                Text
                Image
                File
                ...
  */


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

    // then create the image post
    // create a additional post
    // create avatar
 

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
      first: 5 // or last: 5
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

      })))
    });

  }, [deletePost, handleSubmit, addReaction, removeReaction, updatePost, postComment, handleUpload])


    return (
      
      <div className="flex flex-col w-full items-center mt-12 mx-20">

        <div className="flex text-center w-1/3 mb-4">
          <p>Logged in as: <strong>{userInfo.displayName}</strong></p>
        </div>

        <div className="flex text-center w-1/3 mb-4">
          <form onSubmit={handleSubmit}>
            <p className="mr-4 text-left">Add Post</p>
            <input 
              className="border-black border rounded" 
              type="text" 
              required
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button className="ml-3 border-2 rounded px-3">Send</button>
          </form>
        </div>

        <div className="flex text-center w-1/3">  
          <input 
            type="file" 
            onChange={handleChange}
          />
          <button onClick={handleUpload} className="ml-3 border-2 rounded px-3">Upload</button>
        </div>

        <div className="flex text-left w-1/3 mt-12">
          <div>
            {posts.map((post) => 
              <div className="my-3 border-2 border-gray-300 rounded py-5 px-5" key={post.postId}>
                <div className="flex mb-5 space-x-2 items-center">
                <img 
                  alt="profile pic" 
                  src={"https://media.istockphoto.com/photos/colored-powder-explosion-on-black-background-picture-id1057506940?k=20&m=1057506940&s=612x612&w=0&h=3j5EA6YFVg3q-laNqTGtLxfCKVR3_o6gcVZZseNaWGk="} 
                  className="rounded-full h-10 w-10"
                />
                <p className="text-sm">Username: {post.postedUserId}</p>
                </div>
                <p className="text-xs mb-10">ID: {post.postId}</p>
                <p className="text-md font-bold">Post: {post.postDataText}</p>
                <form onSubmit={() => updatePost(post.postId, updatedText)}>
                  <input
                    key={post.postId} 
                    className="border-black border rounded" 
                    type="text" 
                    required
                    onChange={(event) => setUpdatedText(event.target.value)}
                  />
                  <button className="ml-3 border-2 rounded px-3">update post</button>
                </form>
                <form onSubmit={() => postComment(post.postId, newComment)} className="mt-12">
                  <input
                    key={post.postId} 
                    className="border-black border rounded" 
                    type="text" 
                    required
                    onChange={(event) => setNewComment(event.target.value)}
                  />
                  <button className="ml-3 border-2 rounded px-3">add Comment</button>
                </form>
                {postComments.map((singleComment =>
                    <div>
                      {singleComment.postCommentId === post.postId &&
                        <p className="text-xs border-2 w-2/3 my-1">
                          {singleComment.postComment}
                        </p>
                      }
                    </div>
                ))}
                <p>{post.commentsCount} Comments</p>  
                <div className="flex my-4">
                  <p>{post.reactionsCount}</p>              
                  <button className="mx-2" onClick={() => addReaction(post.postId)}>Up</button>
                  <button className="mx-2" onClick={() => removeReaction(post.postId)}>Down</button>
                </div>
                <button type="button" onClick={() => deletePost(post.postId)} className="text-sm px-2 border-solid rounded border-gray-100 border-2">Delete</button>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

export default App;
