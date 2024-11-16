import SubscribeBtn from '@/components/SubscribeBtn'
import VideoCard from '@/components/VideoCard'
import { getCurURL, getImageSrcFromPath } from '@/lib/utility'
import { Media, Prisma, User, Video } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({
    params,
}: {
    params: Promise<{ username: string }>
}) {
    const username = (await params).username
    const puRes = await axios.get(`${getCurURL()}/api/getPublicUser?username=${username}&videos=true`).catch((e) => {
        notFound()
    })
    const pu: Prisma.UserGetPayload<{ include: { videos: true } }> = puRes.data.publicUser
    return (
        <div>
            {pu &&
                <div className='flex flex-col'>
                    <div className='max-h-[20em] overflow-hidden'>
                        <Image className='w-full h-auto max-h-full' src={getImageSrcFromPath((pu?.header as Media)?.src) || ""} alt="" width={2000} height={2000} />
                    </div>
                    <div className='flex flex-row mx-[3em] my-[1em]'>
                        <Image className='rounded-full w-[10em] h-auto' src={getImageSrcFromPath((pu?.profilePicture as Media)?.src) || ""} alt="" width={200} height={200} />
                        <div className='flex flex-col m-4'>
                            <h3 className='m-0 text-[2em]'>{pu.displayName}</h3>
                            <div className='flex flex-row gap-2 text-gray-300'>
                                <p>{pu.username}</p>
                                <div className='dot' />
                                <p>{pu.subCnt} Subscribers</p>
                            </div>
                            <SubscribeBtn uploader={pu} />
                        </div>
                        <div className='grow' />
                    </div>
                    <hr className='mx-10' />
                    <div className="flex flex-wrap gap-6 justify-start my-8 mx-10">
                        {pu.videos.map((v: Video, i: number) => (
                            <VideoCard key={`VideoCard-${i}`} video={v} />
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

