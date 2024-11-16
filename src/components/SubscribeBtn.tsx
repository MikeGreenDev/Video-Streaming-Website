"use client"
import { Prisma, User } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

export default function SubscribeBtn({ uploader }: { uploader: User }) {
    const { data: session, update } = useSession();
    const [videoUploader, setVideoUploader] = useState<User | null>(uploader)
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

    useEffect(() => {
        seeIfSubscribed();
    }, [])

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
            seeIfSubscribed();
        })
    }
    return (
        <div className='h-auto my-auto'>
            <button onClick={handleClickSubscribe} className={`${isSubscribed ? "bg-slate-500" : "bg-primary"} p-2 rounded-lg`}>{isSubscribed ? "Subscribed" : "Subscribe"}</button>
        </div>
    )
}

