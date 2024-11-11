"use client"
import { Media } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

const useUserProfilePicture = () => {
    const [pfp, setPfp] = useState<Media | null>()

    useEffect(() => {
        const getPfp = async () => {
            await axios.get(`/api/getUserPFP`).then((res) => {
                setPfp(res.data.profilePicture)
            }).catch(() => {
                setPfp(null)
            });
        }
        getPfp()
    }, [])
    return pfp
}

export default useUserProfilePicture
