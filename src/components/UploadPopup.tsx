"use client"
import React, { Dispatch, Reducer, SetStateAction, useReducer, useState } from 'react'
import { FaX } from 'react-icons/fa6'
import Dropzone from './Dropzone'
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

type UploadMediaState = {
    title: string
    description: string
    tags: string
    file: File | null
    thumbnail: File | null
    thumbnailPreview: string
}

type Action = {
    type: string
    arg: number | string | File | null
}

function reducer(state: UploadMediaState, action: Action): UploadMediaState {
    switch (action.type) {
        case "CHANGE_TITLE":
            if (typeof action.arg === "string") {
                return { ...state, title: action.arg }
            }
            break;
        case "CHANGE_DESCRIPTION":
            if (typeof action.arg === "string") {
                return { ...state, description: action.arg }
            }
            break;
        case "CHANGE_TAGS":
            if (typeof action.arg === "string") {
                return { ...state, tags: action.arg }
            }
            break;
        case "CHANGE_FILE":
            if (action.arg instanceof File || action.arg === null) {
                return { ...state, file: action.arg }
            }
            break;
        case "CHANGE_THUMBNAIL":
            if (action.arg instanceof File || action.arg === null) {
                return { ...state, thumbnail: action.arg }
            }
            break;
        case "CHANGE_THUMBNAIL_PREVIEW":
            if (typeof action.arg === "string") {
                return { ...state, thumbnailPreview: action.arg }
            }
            break;
        default:
            throw new Error("Invalid UploadMedia Argument")
    }
    throw new Error("Invalid UploadMedia Argument")
}

type UploadPopupProps = {
    fadeBg?: boolean
    closeBtn?: Dispatch<SetStateAction<boolean>> | (() => void)
    fileProgressCallback?: (progress: number, remaining: number) => void
    videoInfoCallback?: (videoID: string) => void
}

export default function UploadPopup(props: UploadPopupProps) {
    const { data: session } = useSession();
    console.log(session)
    const acceptedFileTypes = 'video/*'
    const initMediaState: UploadMediaState = {
        title: "",
        description: "",
        tags: "",
        file: null,
        thumbnail: null,
        thumbnailPreview: ""
    }
    const [mediaState, dispatchMedia] = useReducer<Reducer<UploadMediaState, Action>>(reducer, initMediaState)
    const fileCallback = (files: File[]) => {
        // TODO: File validation
        dispatchMedia({ type: "CHANGE_FILE", arg: files[0] })
    }

    const thumbnailCallback = (files: File[]) => {
        const fileReader: FileReader = new FileReader;
        fileReader.readAsDataURL(files[0])
        fileReader.onload = function() {
            dispatchMedia({ type: "CHANGE_THUMBNAIL_PREVIEW", arg: fileReader.result as string });
        }

        dispatchMedia({ type: "CHANGE_THUMBNAIL", arg: files[0] })
    }

    const closeBtn = () => {
        if (props.closeBtn) {
            props.closeBtn(false);
        }
    }

    const uploadMedia = async (formData: FormData) => {
        let videoID: string | null = null
        try {
            console.log(session)
            let vid = {
                title: mediaState.title,
                description: mediaState.description,
                tags: mediaState.tags,
            }
            let opts: AxiosRequestConfig = {
                headers: { "Content-Type": "application/json" },
            }
            const r = await axios.post("/api/createVideo", vid, opts)
            console.log(r.data)
            videoID = r.data.videoID;
        } catch (e: any) {
            console.error(e);
            return
        }

        try {
            let startAt = Date.now();
            let fd = new FormData();
            if (videoID === null) throw new Error("Video ID in null");
            fd.append("videoID", videoID);
            fd.append("type", "Thumbnail")
            if (mediaState.thumbnail) {
                fd.append("files", mediaState.thumbnail);
            }
            let opts: AxiosRequestConfig = {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (props.fileProgressCallback) {
                        const loaded = progressEvent.loaded;
                        const total = progressEvent.total || 0;
                        const percentage = (loaded * 100) / total;

                        // Calculate the progress duration
                        const timeElapsed = Date.now() - startAt;
                        const uploadSpeed = loaded / timeElapsed;
                        const duration = (total - loaded) / uploadSpeed;
                        props.fileProgressCallback(+percentage.toFixed(2), duration);
                    }
                },
            }
            const thumbnailData = await axios.post("/api/uploadMedia", fd, opts);
        }catch(e){
            console.error(e)
            return
        }

        try {
            let startAt = Date.now();
            let fd = new FormData();
            if (videoID === null) throw new Error("Video ID in null");
            fd.append("videoID", videoID);
            fd.append("type", "Video")
            if (mediaState.file) {
                fd.append("files", mediaState.file);
            }

            let opts: AxiosRequestConfig = {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (props.fileProgressCallback) {
                        const loaded = progressEvent.loaded;
                        const total = progressEvent.total || 0;
                        const percentage = (loaded * 100) / total;

                        // Calculate the progress duration
                        const timeElapsed = Date.now() - startAt;
                        const uploadSpeed = loaded / timeElapsed;
                        const duration = (total - loaded) / uploadSpeed;
                        props.fileProgressCallback(+percentage.toFixed(2), duration);
                    }
                },
            }

            if (props.videoInfoCallback) {
                props.videoInfoCallback(videoID)
            }

            const videoData = await axios.post("/api/uploadMedia", fd, opts);
            console.log(videoData)
        } catch (e: any) {
            console.error(e)
            return
        }
    }

    return (
        <div className='fixed w-full h-full my-8 [&_h3]:text-lg [&_h3]:underline [&_h3]:font-semibold [&_h3]:m-0'>
            {props.fadeBg &&
                <div className='w-[100vw] h-[100vh] bg-black/50'></div>
            }
            <form action={uploadMedia} className='w-[50%] rounded bg-gray-700 m-auto p-8 py-4 [&_*]:my-2 [&_input]:p-2 [&_input]:rounded-md [&_input]:text-white [&_input]:bg-gray-900 [&_input]:w-full'>
                <div className='flex flex-row gap-4'>
                    <div>
                        <h3>Video Details</h3>
                        <input type='text' placeholder='Title' name='Title' id='title' onChange={(e) => dispatchMedia({ type: "CHANGE_TITLE", arg: e.currentTarget.value })} />

                        <textarea className='w-full bg-gray-900 p-2 rounded-md' placeholder='Description' name='Description' id='description' autoComplete='off' onChange={(e) => dispatchMedia({ type: "CHANGE_DESCRIPTION", arg: e.currentTarget.value })} />
                        <div className='flex flex-row gap-2 items-center'>
                            <h3>Tags</h3><span className='text-sm text-gray-300 h-fit !m-0'> Seperated by comma</span>
                        </div>
                        <input type='text' placeholder='Tags' name='Tags' id='tags' onChange={(e) => dispatchMedia({ type: "CHANGE_TAGS", arg: e.currentTarget.value })} />
                    </div>
                    <div className='flex-grow flex flex-col'>
                        <div>
                            {mediaState.thumbnail === null ?
                                <Dropzone name="Thumbnail" acceptedFileTypes={"image/*"} fileCallback={thumbnailCallback} />
                                :
                                <div className='flex flex-row items-center gap-2'>
                                    <button onClick={() => dispatchMedia({ type: "CHANGE_THUMBNAIL", arg: null })} className='hover:text-red-500'><FaX /></button>
                                    <p>{mediaState.thumbnail.name}</p>
                                    <Image src={mediaState.thumbnailPreview} width={200} height={200} alt='Thumbnail Preview' />
                                </div>
                            }
                        </div>
                        <div>
                            {mediaState.file === null ?
                                <Dropzone name="Video" acceptedFileTypes={acceptedFileTypes} fileCallback={fileCallback} />
                                :
                                <div className='flex flex-row items-center gap-2'>
                                    <button onClick={() => dispatchMedia({ type: "CHANGE_FILE", arg: null })} className='hover:text-red-500'><FaX /></button>
                                    <p>{mediaState.file.name}</p>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='!m-0'>
                        <button className='w-full' onClick={() => closeBtn()}>
                            <FaX className='ml-auto h-full !my-0' />
                        </button>
                    </div>
                </div>
                <div className='flex flex-row-reverse'>
                    <button type='submit'>Upload</button>
                </div>
            </form>
        </div>
    )
}

