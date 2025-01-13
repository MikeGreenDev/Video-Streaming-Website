"use client"
import { Media } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useUserProfilePicture = () => {
    const {data: session} = useSession()
    const [pfp, setPfp] = useState<Media | null>()

    useEffect(() => {
        const getPfp = async () => {
            await axios.get(`/api/User/getUserPFP`).then((res) => {
                setPfp(res.data.profilePicture)
            }).catch(() => {
                setPfp(null)
            });
        }
        getPfp()
    }, [session])
    return pfp
}

export default useUserProfilePicture
