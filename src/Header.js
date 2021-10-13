import React from 'react'

import Logo from "./amitylogo.png"
import Avatar from "./amiredavatar.png"
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/solid"
import { BellIcon, ChatIcon, PlusIcon } from "@heroicons/react/outline"

export default function Header(props) {
    return (
        <header className="w-full bg-gray-900 p-2">
            <div className="flex mx-4">
            <img src={Logo} alt="logo amity" className="w-8 h-8 rounded-full mr-4 mt-1"/>
            <form action="" className="bg-gray-800 px-3 flex rounded-md border border-gray-700 mx-4 flex-grow">
                <SearchIcon className="text-gray-300 h-6 w-6 mt-2" />
                <input type="text" className="bg-gray-800 p-1 pl-2 pr-0 text-sm block focus:outline-none text-white" placeholder="Search"></input>
            </form>
            <div className="hidden md:flex">
                <button className="px-2 py-1">
                    <ChatIcon className="text-gray-400 w-6 h-6 m-1 mx-2" />
                </button>
                <button className="px-2 py-1">
                    <BellIcon className="text-gray-400 w-6 h-6 m-1 mx-2" />
                </button>
                <button className="px-2 py-1">
                    <PlusIcon className="text-gray-400 w-6 h-6 m-1 mx-2" />
                </button>
            </div>    
            <button className="rounded-md flex ml-4 border px-2 border-gray-700">
                <div className="block w-8 h-8 bg-gray-600 mt-auto mb-auto rounded-sm">
                <img className="rounded-sm" src={Avatar} alt="avatar"/>
                </div>
                <div className="flex mt-auto mb-auto mr-2">
                    <p className="text-xs text-gray-300 ml-2 text-center">{props.displayName}</p>
                </div>
                <ChevronDownIcon className="text-gray-500 w-5 h-5 m-1 mt-2"/>
            </button>
            </div>  
      </header>
    )
}
