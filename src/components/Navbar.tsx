"use client"
import React, { useState } from "react";
import { ProfileBtn } from "./ProfileBtn";
import { UserRole } from "@prisma/client";
import Logo from "./Logo";
import Login from "./Login";
import { useSession } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function Navbar({ items }: { items: IMenuItem[] }) {
    const { data: session } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <>
            <div className="w-full h-20 bg-backgroundHL/60 backdrop-blur-sm sticky top-0 z-20"> <div className="mx-auto px-4 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div className="h-full w-[2em] m-4">
                            <button className="h-full w-full" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <GiHamburgerMenu className="h-full w-full" />
                            </button>
                        </div>
                        <Logo />
                        {/**
                        <button
                            type="button"
                            className="inline-flex items-center md:hidden"
                            onClick={toggle}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#fff"
                                    d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
                                />
                            </svg>
                        </button>
                        **/}
                        <div className="flex-grow" />
                        <div className="hidden md:block w-[10em]">
                            {!session?.user ?
                                <Login />
                                :
                                <ProfileBtn userRole={session.user.role as UserRole} />
                            }
                        </div>
                    </div>
                </div>
                {sidebarOpen &&
                    <div className="w-[12em] h-[100vh] bg-red-500">
                        <ul className="w-full p-2 text-center text-[1.2em] font-medium">
                            <li><Link href="/">Home</Link></li>
                        </ul>
                    </div>
                }
            </div>
        </>
    );
};

