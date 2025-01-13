"use client"
import React, { useEffect, useState } from "react";
import { ProfileBtn } from "./ProfileBtn";
import { Media, User, UserRole } from "@prisma/client";
import Logo from "./Logo";
import Login from "./Login";
import { useSession } from "next-auth/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import SearchBar from "./SearchBar";
import DropdownUI from "./DropdownUI";
import axios from "axios";
import Image from "next/image";
import { getImageSrcFromPath } from "@/lib/utility";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession()
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [subbedTo, setSubbedTo] = useState<User[]>([]);
    const pathname = usePathname()

    useEffect(() => {
        getSubscribedTo();
    }, [])

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname])

    const getSubscribedTo = async () => {
        if (!session) return;
        const res = await axios.get("/api/User/getUserSubscribedTo");
        setSubbedTo(res.data.subscribedTo)
    }

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
                    <div className="hidden md:block w-[10em] m-auto">
                        {!session?.user ?
                            <Login />
                            :
                            <ProfileBtn userRole={session.user.role as UserRole} username={session.user.username} />
                        }
                    </div>
                </div>
            </div>
                {sidebarOpen &&
                    <div className="w-[14em] h-[100vh] bg-backgroundHL overflow-y-auto">
                        <ul className="w-full p-2 text-center text-[1.2em] font-medium [&>*]:p-1 text-white">
                            <li><Link className="block px-4 py-1 hover:text-primary" href="/">Home</Link></li>
                            <li><Link className="block px-4 py-1 hover:text-primary" href="/feed/trending">Explore</Link></li>
                            <li><Link className="block px-4 py-1 hover:text-primary" href="/feed/trending">Trending</Link></li>
                            {session &&
                                <>
                                    <hr />
                                    <li>
                                        <DropdownUI title="You">
                                            <ul className="[&>*]:block [&>*]:px-4 [&>*]:py-1 hover:[&>*]:text-primary [&>*]:text-[.9em]">
                                                <li><Link href="#">History</Link></li>
                                                <li><Link href="#">Playlists</Link></li>
                                                <li><Link href="#">Watch Later</Link></li>
                                                <li><Link href="#">Subscriptions</Link></li>
                                            </ul>
                                        </DropdownUI>
                                    </li>
                                </>
                            }
                            <hr />
                            <li>
                                <DropdownUI title="Tags" isOpenDefault={true}>
                                    <ul role="menu" aria-orientation="vertical" aria-labelledby="options-menu" className="[&>*]:block [&>*]:px-4 [&>*]:py-1 hover:[&>*]:text-primary [&>*]:text-[.9em]">
                                        <li><Link href="#">Music</Link></li>
                                        <li><Link href="#">Gaming</Link></li>
                                        <li><Link href="#">Sports</Link>
                                        </li>
                                    </ul>
                                </DropdownUI>
                            </li>
                            {session &&
                                <>
                                    <hr />
                                    <li>
                                        <DropdownUI title="Subscriptions">
                                            <ul className="[&>*]:block [&>*]:px-2 [&>*]:py-1 hover:[&>*]:text-primary [&>*]:text-[.9em] overflow-x-visible">
                                                {subbedTo.map((s) => (
                                                    <li><Link href={`/${s.username}`} className="flex flex-row overflow-x-visible flex-wrap">
                                                        <div className='min-w-8 w-8 h-2/3 aspect-square relative my-auto'>
                                                            <Image src={getImageSrcFromPath((s.profilePicture as Media)?.src)} alt={`${s.username}'s Profile Picture`} fill className='rounded-full' />
                                                        </div>
                                                        <h4 className="font-normal my-2 ml-2">
                                                            {s.displayName}
                                                        </h4>
                                                    </Link></li>
                                                ))}
                                            </ul>
                                        </DropdownUI>
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                }
            </div>
        </>
    );
};

