import { getCurURL, getDateDifferenceInStr, getImageSrcFromPath } from '@/lib/utility'
import { Media, User, Video } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type VideoCardProps = {
    video: Video
}

export default async function VideoCard(props: VideoCardProps) {
    const puRes = await axios.get(`${getCurURL()}/api/getPublicUser?userID=${props.video.uploaderID}`)
    const pu: User = puRes.data.publicUser
    let date = new Date().toISOString()

    return (
        <Link href={`/video?v=${props.video.id}`} className='group/videoCard w-[20em] flex flex-col'>
            <Image src={getImageSrcFromPath((props.video.thumbnail as Media)?.src || "") || "/pexels-moose-photos-170195-1037992.jpg"} alt={props.video.title} width={2000} height={2000}
                quality={100} style={{ width: '100%', height: 'auto', aspectRatio: 16 / 9 }} className='rounded-lg' />
            <div className='flex flex-row gap-2 h-20 my-2 max-w-full'>
                <div className='h-2/3 aspect-square relative'>
                    <Image src={getImageSrcFromPath((pu.profilePicture as Media)?.src)} alt={`${pu.username}'s Profile Picture`} fill className='rounded-full'/>
                </div>
                <div className=''>
                    <h4 className='group-hover/videoCard:text-primary !m-0 overflow-ellipsis line-clamp-2 text-wrap hyphens-auto break-all'>{props.video.title}</h4>
                    <div className='inline-flex'>
                        <p className='text-slate-300'>{pu.displayName}</p>
                        <div className='dot' />
                        <p className='text-slate-300'>{getDateDifferenceInStr(props.video.uploadedOn.toString(), date.toString())}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

