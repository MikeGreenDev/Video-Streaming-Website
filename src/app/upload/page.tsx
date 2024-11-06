import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { VideoUploadList } from '@/components/VideoUploadList'

export default async function page() {
    const session = await getServerSession(authOptions)

    return (
        <div className='w-full h-full'>
            <VideoUploadList />
        </div>
    )
}

