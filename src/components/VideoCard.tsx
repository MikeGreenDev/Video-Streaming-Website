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
        <Link href={`/video?v=${props.video.id}`} className='group/videoCard w-[20em] relative'>
            <Image src={getImageSrcFromPath(JSON.parse(props.video.thumbnail as string).src || "") || "/pexels-moose-photos-170195-1037992.jpg"} alt={props.video.title} width={2000} height={2000}
                quality={100} style={{ width: '100%', height: 'auto', aspectRatio: 16 / 9 }} className='rounded-lg' />
            <div className='flex flex-row gap-2 h-10 my-2'>
                <Image src={getImageSrcFromPath((pu.profilePicture as Media)?.src) || ""} alt='' width={1000} height={1000} style={{ height: 'full', width: 'auto' }} className='rounded-full' />
                <div className='flex flex-col w-full h-full'>
                    <h3 className='group-hover/videoCard:text-primary !m-0'>{props.video.title.substring(0, 80)}{props.video.title.length > 80 && "..."}</h3>
                    <div className='flex flex-row gap-2'>
                        <p className='text-slate-300'>{pu.displayName}</p>
                        <div className='dot' />
                        <p className='text-slate-300'>{getDateDifferenceInStr(props.video.uploadedOn.toString(), date.toString())}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}

