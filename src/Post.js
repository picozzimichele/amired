import React, { useState } from 'react'
import { AnnotationIcon, XIcon, PencilAltIcon } from "@heroicons/react/outline"
import VoteButton from './VoteButton'
import CommentSection from './CommentSection'
import UpdatePost from './UpdatePost'

function ReturnDate(postedDate) {
    const hours = Math.abs((Date.now() - postedDate) / 36e5)
    return hours.toString().split(".")[0]
}

export default function Post(props) {
    const [isOpenComment, setIsOpenComment] = useState(false)
    const [isOpenUpdate, setIsOpenUpdate] = useState(false)

    return (
        <div key={props.postId} className="px-6 bg-black text-gray-300 py-4">   
          <div className="border border-gray-700 bg-gray-800 rounded-md flex">
            <VoteButton 
                reactionsCount={props.reactionsCount} 
                postId={props.postId} 
                removeReaction={props.removeReaction}
                addReaction={props.addReaction}
            />
            <div className="flex justify-between w-full">
                <div className="p-2">
                    <h5 className="text-gray-500 text-sm">{`Posted by u/${props.postedUserId} ${ReturnDate(props.createdAt)} hours ago`}</h5>
                    <h2 className="text-xl mb-3 mt-3">{props.postDataText}</h2>
                    <div className="flex">
                        <button 
                            onClick={() => setIsOpenComment(!isOpenComment) && setIsOpenUpdate(false)}
                            className="flex text-sm text-gray-500 cursor-pointer hover:bg-gray-900 rounded-sm h-10 items-center w-32 px-1"
                        >
                            <AnnotationIcon className="h-5 w-5" />
                            <p className="ml-2">{props.commentsCount} Comments</p>
                        </button>
                        <button 
                            onClick={() => setIsOpenUpdate(!isOpenUpdate) && setIsOpenComment(false)}
                            className="flex text-sm text-gray-500 cursor-pointer hover:bg-gray-900 rounded-sm h-10 items-center w-32 px-1"
                        >
                            <PencilAltIcon className="h-5 w-5" />
                            <p className="ml-2">Edit</p>
                        </button>
                    </div>
                    <UpdatePost 
                        open={isOpenUpdate}
                        postId={props.postId}
                        setUpdatedText={props.setUpdatedText}
                        updatedText={props.updatedText}
                        updatePost={props.updatePost}
                    />
                    <CommentSection 
                        open={isOpenComment} 
                        postId={props.postId} 
                        postComments={props.postComments} 
                        postComment={props.postComment} 
                        setNewComment={props.setNewComment} 
                        newComment={props.newComment}
                    />
                </div>
                <div className="p-1 pr-2">
                    <button onClick={() => props.deletePost(props.postId)}>
                        <XIcon className="w-4 h-4"/>
                    </button>
                </div>
            </div>
          </div>
        </div>
    )
}
