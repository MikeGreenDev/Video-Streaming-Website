"use client"
import VideoPlayer from '@/containers/VideoPlayer/VideoPlayer'
import { Video } from '@prisma/client';
import axios from 'axios';
import { User } from 'next-auth';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';
import { IoMdPerson } from 'react-icons/io';

export default function VideoPlayerContainer() {
    const [video, setVideo] = useState<Video | null>(null)
    const [videoUploader, setVideoUploader] = useState<User | null>(null)
    const searchParams = useSearchParams();
    const videoID = searchParams.get("v") || "";
    const timeSkip = searchParams.get("t") || "";

    useEffect(() => {
        axios.get(`/api/getVideoEntry?videoID=${videoID}`).then((res) => {
            setVideo(res.data.video)
            axios.get(`/api/getPublicUser?userID=${res.data.video.uploaderID}`).then((res) => {
                setVideoUploader(res.data.publicUser);
            })
        })

    }, [])
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
                                src={JSON.parse(videoUploader.profilePicture as string).src}
                                alt="Profile Picture"
                                width={0}
                                height={0}
                                className="relative w-full h-auto"
                            />
                            :
                            <IoMdPerson className='h-full m-auto'/>
                            }
                        </div>
                        <div className='h-auto my-auto'>
                            <h3 className='my-0'>{videoUploader?.username}</h3>
                            <p>{videoUploader?.subCnt} Subscribers</p>
                        </div>
                        <div className='h-auto my-auto'>
                            {/** TODO: Add functionility If viewer is subscribed (Styling, Functions)*/}
                            <button className={`bg-primary p-2 rounded-lg`}>Subscribe</button>
                        </div>
                        <div className='grow' />
                        <div className='p-4 bg-backgroundHL rounded-lg flex flex-row gap-2'>
                            <button className='flex flex-row gap-2'><FaThumbsUp />{video?.likes}</button>
                            <div className='w-[2px] h-full bg-white rounded-lg' />
                            <button className='flex flex-row gap-2'><FaThumbsDown />{video?.dislikes}</button>
                        </div>
                    </div>
                    <div className='my-2 bg-backgroundHL p-4 rounded-lg'>
                        <h4 className='my-2'>Video Description</h4>
                        {video?.description}
                    </div>
                </div>
            </div>
        </div>
    )
}

