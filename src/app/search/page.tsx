"use client"
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function page() {
    const searchParams = useSearchParams();
    const search = searchParams.get("s")?.toString() || "";
    return (
        <div>

        </div>
    )
}

