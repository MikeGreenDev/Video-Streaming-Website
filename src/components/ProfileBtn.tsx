"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from 'react'
import Link from "next/link";
import { UserRole } from "@prisma/client";

type ProfileBtnProps = {
    userRole: UserRole
}

export function ProfileBtn(props: ProfileBtnProps) {
    const items: IMenuItem[] = [
        {
            id: "profile",
            label: "profile",
            url: "profile",
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
            <button
                onClick={toggle}>
                <Image
                    src="/logoipsum-298.svg"
                    alt="Profile Picture"
                    width={0}
                    height={0}
                    className="relative w-full h-8"
                />
            </button>

            <div className="relative">
                {isOpen &&
                    <div>
                        <ul className="hidden md:flex flex-col gap-x-6 text-white absolute p-4 rounded bg-[rgb(11,10,25)]">
                            {props.userRole === "Admin" &&
                                <>
                                    <li className="m-2">
                                        <Link href="/admin-dashboard">
                                            <p>Dashboard</p>
                                        </Link>
                                    </li>
                                </>
                            }
                            {items?.map((item, index) => (
                                <li key={index} className="m-2">
                                    <Link href={item.url}>
                                        <p>{item.label}</p>
                                    </Link>
                                </li>
                            ))}
                            <li className="m-2">
                                <Link href="/upload">
                                    <p>Upload Video</p>
                                </Link>
                            </li>
                            <li className="m-2">
                                <Link href="/api/auth/signout">Log Out</Link>
                            </li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}
