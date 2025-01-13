"use client"
import { User } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function SubscribeBtn({ uploader }: { uploader: User }) {
    const { data: session, update } = useSession();
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

    useEffect(() => {
        seeIfSubscribed();
    }, [])

    const seeIfSubscribed = async () => {
        const res = await axios.get("/api/User/getUserSubscribedTo");
        const subTo: User[] = res.data.subscribedTo
        let found = false;
        if (subTo) {
            subTo.map((v) => {
                if (v.id == uploader.id) {
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
            uploaderID: uploader.id
        }
        let opts: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" },
        }
        axios.post("/api/handleSubscribing", d, opts).then(() => {
            update()
            seeIfSubscribed();
        })
    }

    return (
        <div className='h-auto my-auto'>
            <button disabled={uploader.id === session?.user.id || session?.user === null} onClick={handleClickSubscribe} className={`${isSubscribed ? "bg-slate-500" : "bg-primary"} p-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-600`}>{isSubscribed ? "Subscribed" : "Subscribe"}</button>
        </div>
    )
}

