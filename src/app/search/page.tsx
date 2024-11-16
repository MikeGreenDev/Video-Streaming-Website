"use client"
import { VideoSearchInfo } from '@/_types/prisma';
import { getImageSrcFromPath } from '@/lib/utility';
import { Media, User, Video } from '@prisma/client';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa6';

export default function page() {
    const searchParams = useSearchParams();
    const search = searchParams.get("s")?.toString() || "";
    const [results, setResults] = useState<(VideoSearchInfo | User)[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true)
        const doSearch = async () => {
            const res = await axios.get(`/api/search/searchQuery?query=${encodeURI(search)}`)
            setResults(res.data.results);
            setLoading(false)
        }
        doSearch();
    }, [search])

    return (
        <div>
            {loading ?
                <div>Loading...</div>
                :
                <div className='mx-[20%]'>
                    {
                        results.map((v, i) => {
                            const isVideo = !('username' in v)
                            console.log(v)
                            return (
                                <div key={`Result-${i}`}>
                                    <hr />
                                    {isVideo ?
                                        <Link href={`/video?v=${v.id}`} className='group/videoLongCard'>
                                            <div className='h-[15em] my-4 flex flex-row gap-2'>
                                                <div className='relative aspect-video h-full'>
                                                    <Image src={getImageSrcFromPath(JSON.parse(v.thumbnail as string).src)} alt={v.title} fill />
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                    <h3 className='m-0 group-hover/videoLongCard:text-primary'>{v.title}</h3>
                                                    <div className='flex flex-row gap-2'>
                                                        <div className='relative aspect-square h-[3em]'>
                                                            <Image className='rounded-full' src={getImageSrcFromPath((v.uploader.profilePicture as Media).src)} alt={v.title} fill />
                                                        </div>
                                                        <div className='flex flex-col'>
                                                            <p className='font-semibold'>{v.uploader.displayName}</p>
                                                            <p className='text-gray-300'>{v.uploader.subCnt} Subscribers</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className='overflow-hidden text-gray-200'>{v.description}</p>
                                                    </div>
                                                </div>
                                                <div className='grow' />
                                                <div className='flex flex-row h-fit gap-2'>
                                                    <div className='flex flex-row gap-2'><FaThumbsUp className='w-full h-full' />{v.likes.length}</div>
                                                    <div className='w-[2px] h-full bg-white rounded-lg' />
                                                    <div className='flex flex-row gap-2'><FaThumbsDown className='w-full h-full' />{v?.dislikes.length}</div>
                                                </div>
                                            </div>
                                        </Link>
                                        :
                                        <div>User: {v.id}</div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

