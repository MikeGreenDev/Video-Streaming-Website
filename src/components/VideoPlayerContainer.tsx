"use client"
import VideoPlayer from '@/containers/VideoPlayer/VideoPlayer'
import { getImageSrcFromPath } from '@/lib/utility';
import { Media, Prisma, User } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import { IoMdPerson } from 'react-icons/io';

type VideoResponse = {
    video: Prisma.VideoGetPayload<{ include: { likes: true, dislikes: true } }>
}

export default function VideoPlayerContainer() {
    const { data: session, update } = useSession();
    const [video, setVideo] = useState<Prisma.VideoGetPayload<{ include: { likes: true, dislikes: true } }> | null>(null)
    const [videoUploader, setVideoUploader] = useState<User | null>(null)
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isDisliked, setIsDisliked] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const videoID = searchParams.get("v") || "";
    const timeSkip = searchParams.get("t") || "";

    useEffect(() => {
        const getVideoEntry = async () => {
            await axios.get<VideoResponse>(`/api/getVideoEntry?videoID=${videoID}`).then((res) => {
                setVideo(res.data.video)
                getUploaderInfo(res.data.video.uploaderID);
                seeIfSubscribed();
            })
        }
        getVideoEntry()
    }, [])

    const getUploaderInfo = async (uploaderID: string) => {
        console.log("VidUpID: ", uploaderID)
        axios.get(`/api/getPublicUser?userID=${uploaderID}`).then((res) => {
            setVideoUploader(res.data.publicUser);
        })
    }

    const seeIfSubscribed = async () => {
        const res = await axios.get("/api/getUserSubscribedTo");
        const subTo: User[] = res.data.subscribedTo
        let found = false;
        if (subTo) {
            subTo.map((v) => {
                if (v.id == session?.user.id) {
                    console.log("Subscribed")
                    setIsSubscribed(true);
                    found = true;
                }
            })
        }
        if (!found) {
            setIsSubscribed(false);
        }
    }

    const handleClickSubscribe = () => {
        const d = {
            subscribe: !isSubscribed,
            uploaderID: videoUploader?.id
        }
        console.log(d)
        let opts: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" },
        }
        axios.post("/api/handleSubscribing", d, opts).then(() => {
            update()
            getUploaderInfo(video?.uploaderID || "");
            seeIfSubscribed();
        })
    }

    const handleLikeDisLike = ({ like, dislike }: { like: boolean, dislike: boolean }) => {
        const d = {
            like: like,
            dislike: dislike,
            videoID: video?.id
        }
        let opts: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" },
        }
        axios.post("/api/handleLiking", d, opts).then((res) => {
            // TODO: Do I need to re-fetch this?
            axios.get<VideoResponse>(`/api/getVideoEntry?videoID=${videoID}`).then((res) => {
                setVideo(res.data.video)
            })
            setIsLiked(like);
            setIsDisliked(dislike)
        })
    }

    return (
        <div>
            <div className='w-auto h-[50rem]'>
                <VideoPlayer src={`/api/getVideo?videoID=${videoID}`} timeSkipInSecs={Number(timeSkip)} playbackOptions />
                <div className='mx-16'>
                    <h2 className='mb-2'>{video?.title}</h2>
                    <div className='flex flex-row h-fit gap-2'>
                        <div className={`my-auto h-full w-[3em] aspect-square rounded-lg overflow-hidden ${!videoUploader?.profilePicture && "bg-slate-500"}`}>
                            {videoUploader && videoUploader.profilePicture ?
                                <Image
                                    src={getImageSrcFromPath((videoUploader.profilePicture as Media).src)}
                                    alt="Profile Picture"
                                    width={1000}
                                    height={1000}
                                    className="relative w-full h-auto"
                                />
                                :
                                <IoMdPerson className='h-full m-auto' />
                            }
                        </div>
                        <div className='h-auto my-auto'>
                            <h3 className='my-0'>{videoUploader?.username}</h3>
                            <p>{videoUploader?.subCnt} Subscribers</p>
                        </div>
                        <div className='h-auto my-auto'>
                            <button onClick={handleClickSubscribe} className={`${isSubscribed ? "bg-slate-500" : "bg-primary"} p-2 rounded-lg`}>{isSubscribed ? "Subscribed" : "Subscribe"}</button>
                        </div>
                        <div className='grow' />
                        <div className='p-4 bg-backgroundHL rounded-lg flex flex-row gap-2'>
                            <button onClick={() => handleLikeDisLike({ like: !isLiked, dislike: false })} className='flex flex-row gap-2'><FaThumbsUp />{video?.likes.length}</button>
                            <div className='w-[2px] h-full bg-white rounded-lg' />
                            <button onClick={() => handleLikeDisLike({ like: false, dislike: !isDisliked })} className='flex flex-row gap-2'><FaThumbsDown />{video?.dislikes.length}</button>
                        </div>
                    </div>
                    <div className='my-2 bg-backgroundHL p-4 rounded-lg'>
                        <h4 className='my-2'>Video Description</h4>
                        <p>{video?.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

