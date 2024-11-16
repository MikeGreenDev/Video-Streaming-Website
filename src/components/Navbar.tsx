"use client"
import React, { useState } from "react";
import { ProfileBtn } from "./ProfileBtn";
import { UserRole } from "@prisma/client";
import Logo from "./Logo";
import Login from "./Login";
import { useSession } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Navbar() {
    const { data: session } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <>
            <div className="w-full h-16 bg-backgroundHL/60 backdrop-blur-sm sticky top-0 z-20"> <div className="mx-auto px-4 h-full">
                <div className="flex justify-between items-center h-full">
                    <div className="flex">
                        <div className="h-full w-[2em] m-4">
                            <button className="h-full w-full" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                <GiHamburgerMenu className="h-full w-full" />
                            </button>
                        </div>
                        <Logo />
                    </div>
                    <div className="flex-grow">
                        <SearchBar />
                    </div>
                    <div className="hidden md:block w-[10em]">
                        {!session?.user ?
                            <Login />
                            :
                            <ProfileBtn userRole={session.user.role as UserRole} username={session.user.username} />
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

