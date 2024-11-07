import VideoCard from "@/components/VideoCard";
import { getCurURL } from "@/lib/utility";
import { Video } from "@prisma/client";
import axios from "axios";

export default async function Home() {
    const videoRes = await axios.get(`${getCurURL()}/api/getHomeVideos`)
    const videos = videoRes.data.videos
    console.log(videos)
    return (
        <div className="flex flex-wrap gap-6 justify-center">
            {videos.map((v: Video) => (
                <VideoCard link={JSON.parse(v.media as string).src} title={v.title} />
            ))}
        </div>
    );
}
