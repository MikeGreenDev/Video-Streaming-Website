"use client"
import React, { useState } from 'react'
import UploadPopup from './UploadPopup'
import { useSession } from 'next-auth/react'

export const VideoUploadList = () => {
    const [uploadPopup, setUploadPopup] = useState<boolean>(false)
    const [videoUploading, setVideoUploading] = useState({})

    return (
        <div className='m-8'>
            {uploadPopup &&
                <UploadPopup closeBtn={setUploadPopup}/>
            }
            <button className='btn' onClick={() => setUploadPopup(true)}>Upload Video</button>
            <hr />
        </div>
    )
}
