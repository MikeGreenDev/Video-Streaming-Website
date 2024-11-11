"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link";
import { Media, UserRole } from "@prisma/client";
import { getImageSrcFromPath } from "@/lib/utility";
import useUserProfilePicture from "@/hooks/useUserProfilePicture";
import { IoPersonSharp } from "react-icons/io5";

type ProfileBtnProps = {
    userRole: UserRole
}

export function ProfileBtn(props: ProfileBtnProps) {
    const profilePicture = useUserProfilePicture();
    const items: IMenuItem[] = [
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
        <div ref={ref} className="w-fit">
            <button onClick={toggle} className="rounded-full overflow-hidden">
                {profilePicture ?
                <Image
                    src={getImageSrcFromPath(profilePicture?.src || "") || ""}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="relative w-full h-10"
                />
                :
                    <IoPersonSharp />
                }
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
