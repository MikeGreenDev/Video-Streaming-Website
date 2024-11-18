"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { getImageSrcFromPath } from "@/lib/utility";
import useUserProfilePicture from "@/hooks/useUserProfilePicture";
import { IoPersonSharp } from "react-icons/io5";

type ProfileBtnProps = {
    username: string
    userRole: UserRole
}

export function ProfileBtn(props: ProfileBtnProps) {
    const profilePicture = useUserProfilePicture();
    const items: IMenuItem[] = [
        {
            id: "Channel",
            label: "Channel",
            url: `/${props.username}`,
        },
        {
            id: "Profile",
            label: "Profile",
            url: "/profile?l=Profile",
        },
        {
            id: "UploadVideo",
            label: "Upload Video",
            url: "/profile?l=Videos"
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
        <div ref={ref} className="w-fit h-fit">
            <button onClick={toggle} className="rounded-full overflow-hidden m-auto h-fit">
                {profilePicture ?
                    <div className='relative aspect-square h-[3em] m-auto'>
                        <Image className='rounded-full' src={getImageSrcFromPath(profilePicture.src)} alt={"Profile Button"} fill style={{objectFit: "scale-down"}}/>
                    </div>
                    :
                    <IoPersonSharp />
                }
            </button>

            <div className="relative">
                {isOpen &&
                    <div className="w-full text-nowrap">
                        <ul className="hidden md:flex flex-col gap-x-6 text-white absolute p-4 rounded bg-[rgb(11,10,25)] right-0">
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
                                <Link key={`ProfileBtnLink-${index}`} href={item.url} className="hover:text-primary">
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
