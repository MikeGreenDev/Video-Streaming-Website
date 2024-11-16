import VideoCard from "@/components/VideoCard";
import { getCurURL } from "@/lib/utility";
import { Video } from "@prisma/client";
import axios from "axios";

export default async function Home() {
    const videoRes = await axios.get(`${getCurURL()}/api/getHomeVideos`)
    const videos = videoRes.data.videos
    return (
        <div className="flex flex-wrap gap-6 justify-start my-8 mx-16">
            {videos.map((v: Video, i: number) => (
                <VideoCard key={`VideoCard-${i}`} video={v} />
            ))}
        </div>
    );
}
