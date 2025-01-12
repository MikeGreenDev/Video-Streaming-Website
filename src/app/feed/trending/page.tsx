import VideoCard from '@/components/VideoCard'
import { getCurURL } from '@/lib/utility'
import { Video } from '@prisma/client'
import axios from 'axios'
import React from 'react'

export default async function page() {
    const videoRes = await axios.get(`${getCurURL()}/api/GetVideos/getTrendingVideos`)
    const videos = videoRes.data.videos
    return (
        <div>
            <h1>Trending</h1>
            <hr />
            <div className="flex flex-wrap gap-6 justify-start my-8">
                {videos.map((v: Video, i: number) => (
                    <VideoCard key={`Trending-VideoCard-${i}`} video={v} />
                ))}
            </div>
        </div>
    )
}

