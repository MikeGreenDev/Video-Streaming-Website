"use client"
import React, { useEffect, useState } from 'react'
import UploadPopup from './UploadPopup'
import { Video } from '@prisma/client'
import Image from 'next/image'
import { getImageSrcFromPath } from '@/lib/utility'
import { FiEdit } from 'react-icons/fi'
import { FaRegTrashAlt } from 'react-icons/fa'
import axios, { AxiosRequestConfig } from 'axios'
import { useSession } from 'next-auth/react'

type FileUploadListEntry = {
    id: string
    progress: number
    remaining: number
}

type Dictionary<T> = {
    [key: string]: T;
}

export const VideoUploadList = () => {
    const { data: session } = useSession()
    const [uploadPopup, setUploadPopup] = useState<boolean>(false)
    const [videoUploading, setVideoUploading] = useState<Dictionary<FileUploadListEntry>>({})
    const [videos, setVideos] = useState<Video[]>([])
    const [video, setVideo] = useState<Video | undefined>(undefined)

    const getVideos = async () => {
        const r = await axios.get("/api/getUserVideos");
        setVideos(r.data.videos);
    }

    useEffect(() => {
        getVideos();
    }, [session])

    const deleteVideo = async (video: Video) => {
        let vid = {
            videoID: video.id,
            media: video.media,
            thumbnail: video.thumbnail
        }
        let opts: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" },
        }

        await axios.post("/api/deleteVideo", vid, opts).then(() => {
            getVideos()
        }).catch((e) => {
            throw new Error(e);
        })
    }

    const editVideo = async (video: Video) => {
        setVideo(video)
    }

    const videoFileCallback = (videoID: string, progress: number, remaining: number) => {
        if (progress < 100) {
            // Add/Update the array
            if (videoUploading[videoID] !== undefined) {
                let t = videoUploading;
                t[videoID].progress = progress
                t[videoID].remaining = remaining
                setVideoUploading(t);
                return
            } else {
                let t = videoUploading
                t[videoID] = { id: videoID, progress: progress, remaining: remaining }
                setVideoUploading(t);
                return
            }
        } else {
            if (videoUploading[videoID] !== undefined) {
                let t = videoUploading
                delete t[videoID]
                setVideoUploading(t);
            }
        }
    }

    const close = (b: boolean) => {
        setUploadPopup(false);
        setVideo(undefined)
    }

    return (
        <div className='m-8'>
            {(uploadPopup || video !== undefined) &&
                <UploadPopup closeBtn={close} fileProgressCallback={videoFileCallback} video={video}/>
            }
            <button className='btn' onClick={() => {setVideo(undefined); setUploadPopup(true)}}>Upload Video</button>
            <hr />
            <div className='flex flex-col gap-4 my-4'>
                {videos.map((v, i) => (
                    <div key={`VideoCard-${i}`} className='flex flex-row gap-4 h-fit'>
                        <Image src={getImageSrcFromPath(JSON.parse(v.thumbnail as string)?.src || "") || ""} alt={v.title} width={200} height={200} style={{ aspectRatio: 16 / 9 }} />
                        <h3>{v.title}</h3>
                        <div className='grow' />
                        {videoUploading[v.id] !== undefined &&
                            <p className='m-auto'>{videoUploading[v.id].remaining} remaining | {videoUploading[v.id].progress}%</p>
                        }
                        <button onClick={() => editVideo(v)} className='m-auto w-[1.5em] h-full hover:text-primary'><FiEdit className='w-full h-full' /></button>
                        <button onClick={() => deleteVideo(v)} className='m-auto w-[1.5em] h-full hover:text-red-500'><FaRegTrashAlt className='w-full h-full' /></button>
                    </div>
                ))}
            </div>
        </div>
    )
}
