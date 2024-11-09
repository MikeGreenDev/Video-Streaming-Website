"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link";
import { Media, UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { getImageSrcFromPath } from "@/lib/utility";

type ProfileBtnProps = {
    userRole: UserRole
}

export function ProfileBtn(props: ProfileBtnProps) {
    const { data: session } = useSession();
    const items: IMenuItem[] = [
        {
            id: "Profile",
            label: "Profile",
            url: "/profile?l=Profile",
        },
        {
            id: "UploadVideo",
            label: "Upload Video",
            url: "/upload"
        }
    ]

    const ref = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (!ref.current?.contains(event.target)) {
                setIsOpen(false);
            }
        }

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [ref])

    return (
        <div ref={ref} className="w-fit">
            <button onClick={toggle} className="rounded-full overflow-hidden">
                <Image
                    src={getImageSrcFromPath((session?.user.profilePicture as Media).src) || ""}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="relative w-full h-10"
                />
            </button>

            <div className="relative">
                {isOpen &&
                    <div className="w-full text-nowrap">
                        <ul className="hidden md:flex flex-col gap-x-6 text-white absolute p-4 rounded bg-[rgb(11,10,25)]">
                            {props.userRole === "Admin" &&
                                <>
                                    <Link href="/admin-dashboard" className="hover:text-primary">
                                        <li className="m-2">
                                            <p>Dashboard</p>
                                        </li>
                                    </Link>
                                </>
                            }
                            {items?.map((item, index) => (
                                <Link href={item.url} className="hover:text-primary">
                                    <li key={index} className="m-2">
                                        <p>{item.label}</p>
                                    </li>
                                </Link>
                            ))}
                            <Link href="/api/auth/signout" className="hover:text-primary">
                                <li className="m-2">
                                    <p>Log Out</p>
                                </li>
                            </Link>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}
