"use client"
import { User, Video } from '@prisma/client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function page() {
    const searchParams = useSearchParams();
    const search = searchParams.get("s")?.toString() || "";
    const [results, setResults] = useState<(Video | User)[]>([])
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
                <div>
                    {
                        results.map((v) => {
                            const isVideo = !('username' in v)
                            return (
                                <div>
                                    {isVideo ?
                                        <div>Video: {v.title}</div>
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

