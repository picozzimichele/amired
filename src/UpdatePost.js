import React from 'react'

export default function UpdatePost({ open, postId, setUpdatedText, updatedText, updatePost}) {
    if(!open) return null

    return (
        <div className="mt-4">
            <form onSubmit={() => updatePost(postId, updatedText)}>
                <input
                key={postId} 
                className="bg-gray-700 border border-gray-600 rounded-sm focus:outline-none text-sm py-1"
                type="text" 
                required
                onChange={(event) => setUpdatedText(event.target.value)}
                />
                <button className="ml-3 bg-gray-200 rounded-2xl px-4 py-1 text-sm text-black hover:bg-gray-400">Update post</button>
            </form>
        </div>
    )
}
