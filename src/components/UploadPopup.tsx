"use client"
import React from 'react'
import { FaX } from 'react-icons/fa6'

type UploadPopupProps = {
    fadeBg?: boolean
}

export default function UploadPopup(props: UploadPopupProps) {
    return (
        <div className='w-full h-full [&_h3]:text-lg [&_h3]:underline [&_h3]:font-semibold [&_h3]:m-0'>
            {props.fadeBg &&
                <div className='w-[100vw] h-[100vh] bg-black/50'></div>
            }
            <div className='w-[50%] h[50%] rounded bg-gray-700 m-auto p-8 pt-4 [&_*]:my-2 [&_input]:p-2 [&_input]:rounded-md [&_input]:text-white [&_input]:bg-gray-900 [&_input]:w-full'>
                <div className='!m-0'>
                    <button className='w-full'>
                        <FaX className='ml-auto h-full !my-0' />
                    </button>
                </div>
                <h3>Video Details</h3>
                <input type='text' placeholder='Title' name='Title' id='title' />

                <textarea className='w-full bg-gray-900 p-2 rounded-md' placeholder='Description' name='Description' id='description' autoComplete='off' />
                <div className='flex flex-row gap-2 items-center'>
                    <h3>Tags</h3><span className='text-sm text-gray-300 h-fit !m-0'> Seperated by comma</span>
                </div>
                <input type='text' placeholder='Tags' name='Tags' id='tags' />
            </div>
        </div>
    )
}

