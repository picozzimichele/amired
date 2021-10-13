import React, { useState } from 'react'
import Avatar from "./amiredavatar.png"
import { PhotographIcon } from "@heroicons/react/outline"

export default function BoardPost({handleSubmit, setComment, comment}) {

    return (
        <div className="bg-black px-6 py-4 text-gray-400">
          <div className="border border-gray-700 p-2 rounded-md flex bg-gray-800">
            <div className="rounded-full bg-gray-500 overflow-hidden w-10 h-10">
              <img src={Avatar} alt=""></img>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-grow bg-gray-700 border border-gray-600 ml-4 rounded-md mr-2" action="">
              <input 
                type="text" 
                className="bg-gray-700 p-2 px-3 block w-full text-sm focus:outline-none" 
                placeholder="Create post"
                value={comment}
                onChange={(event) => setComment(event.target.value)} 
              />
              <button className="ml-3 rounded px-2 text-sm">Post</button>
            </form>
            <button className="px-2 py-1 hover:bg-gray-700 rounded-md">
                <PhotographIcon className="text-gray-400 w-6 h-6 m-1 mx-1" />
            </button>
          </div>
        </div>
    )
}
