import React from 'react'

export default function VideoGrid() {
    const videoRes = await axios.get(`${getCurURL()}/api/getHomeVideos`)
    const videos = videoRes.data.videos
    return (
        <div className="flex flex-wrap gap-6 justify-center my-8">
            {videos.map((v: Video, i: number) => (
                <VideoCard key={`VideoCard-${i}`} video={v} />
            ))}
        </div>
    );
}

