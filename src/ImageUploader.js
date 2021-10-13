import React from 'react'
import { XIcon } from "@heroicons/react/outline"

export default function ImageUploader({open, onClose, handleUpload, setImage}) {
    if(!open) return null

    const handleChange = (e) => {
        if(e.target.files[0]) {
          setImage(e.target.files[0]);
        }
    }

    async function buttonUpload () {
        await handleUpload();
        onClose()
    }

    return (
        <>
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-70" />
            <div style={{transform: "translate(-50%, -50%)"}} className="text-gray-600 fixed top-1/2 left-1/2 transform bg-gray-800 border border-gray-600 px-10 py-10 z-10 rounded-md flex">
                <div className="">  
                    <input 
                        type="file" 
                        onChange={handleChange}
                    />
                    <button onClick={buttonUpload} className="ml-3 border border-gray-700 rounded px-3 py-1">Upload</button>
                </div>
                <div className="p-1 pl-2">
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </div>
            </div> 
        </>
    )
}
