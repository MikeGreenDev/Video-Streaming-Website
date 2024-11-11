"use client"
import { Media } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

const useUserHeader = () => {
    const [header, setHeader] = useState<Media | null>()

    useEffect(() => {
        const getHeader = async () => {
            await axios.get(`/api/getUserHeader`).then((res) => {
                setHeader(res.data.header)
            }).catch(() => {
                setHeader(null)
            });
        }
        getHeader()
    }, [])
    return header
}

export default useUserHeader
