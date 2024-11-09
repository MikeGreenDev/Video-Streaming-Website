"use client"
import Profile from '@/components/Profile'
import { VideoUploadList } from '@/components/VideoUploadList'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { FaVideo } from 'react-icons/fa6'
import { IoPerson } from 'react-icons/io5'

enum ParamLocation {
    "Profile" = "Profile",
    "Videos" = "Videos"
}

function getMainPage(): React.ReactNode {
    const searchParams = useSearchParams();
    const loc = searchParams.get("l")?.toString() || "";
    console.log(loc)
    if (loc == ParamLocation.Profile.toString()) {
        console.log("Profile Clicked")
        return (
            <Profile />
        )
    } else if (loc == ParamLocation.Videos.toString()) {
        return (
            <VideoUploadList />
        )
    }
}

function SidebarLink({ location, children }: { location: ParamLocation, children?: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const changeParams = (location: ParamLocation) => {
        const params = new URLSearchParams();
        switch (location) {
            case ParamLocation.Profile:
                params.set("l", "Profile");
                break;
            case ParamLocation.Videos:
                params.set("l", "Videos");
                break;
            default:
                break;
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div onClick={() => changeParams(location)} className='w-full cursor-pointer hover:text-primary'>
            <h3 className='my-2 flex flex-row gap-2'>
                {children}
            </h3>
            <hr />
        </div>
    )
}
export default function page() {
    const sidebarWidth = "12%"
    return (
        <div className='flex flex-row'>
            <div className={`h-[100vh] p-4 fixed flex flex-row`} style={{width: `${sidebarWidth}`}}>
                <div className='w-full'>
                    <SidebarLink location={ParamLocation.Profile}><IoPerson /><p>Profile</p></SidebarLink>
                    <SidebarLink location={ParamLocation.Videos}><FaVideo /><p>Videos</p></SidebarLink>
                </div>
                <div className='grow' />
                <hr className='w-[2px] h-full bg-white m-4'/>
            </div>
            <div className={`w-full h-fit m-4`} style={{marginLeft: `calc(${sidebarWidth} + 2em)`}}>
                {getMainPage()}
            </div>
        </div>
    )
}

