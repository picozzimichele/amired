import React from 'react'

export default function BoardHeader() {
    return (
        <>
        <div className="h-28 w-full bg-cover" style={{backgroundImage: 'url("https://assets-global.website-files.com/5eddccffdb3c6a27f79757c1/5efa92473e2404207a607998_amity-blog-rebrand-thumbnail.jpg")'}}>
        </div>
        <div className="bg-gray-800">
          <div className="mx-6 relative flex">
            <div className="h-20 w-20 rounded-full overflow-hidden relative -top-3 border-4 border-white bg-white">
              <img src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/juga4eqseer3uhrcqs9q" alt="logo"></img>
            </div>
            <div className="pt-2 pl-4">
              <h1 className="text-gray-300 text-3xl">Amity - We power communities, everywhere</h1>
              <h5 className="text-gray-500">r/amity</h5>
            </div>
          </div>
        </div>
        </>
    )
}
