import React from 'react'

export default function CommentSection({ open, postId, postComments, postComment, newComment, setNewComment }) {
    if(!open) return null

    return (
        <div className="mt-2">
            <div className="border-gray-800 py-2">
                <form onSubmit={() => postComment(postId, newComment)}>
                    <input
                    key={postId} 
                    className="bg-gray-700 border border-gray-600 rounded-sm focus:outline-none text-sm py-1"
                    type="text" 
                    required
                    onChange={(event) => setNewComment(event.target.value)}
                    />
                    <button className="ml-3 bg-gray-200 rounded-2xl px-4 py-1 text-sm text-black hover:bg-gray-400">Comment</button>
                </form>
            </div>
            {postComments.map((singleComment =>
                <div>
                    {singleComment.postCommentId === postId &&
                    <p className="text-sm my-1">
                        {singleComment.postComment}
                    </p>
                    }
                </div>
            ))}
        </div>
    )
}
