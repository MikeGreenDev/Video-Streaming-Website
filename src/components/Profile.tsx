"use client"
import { useSession } from 'next-auth/react'
import React, { Reducer, useReducer, useState } from 'react'
import Dropzone from './Dropzone';
import { Media, MediaType } from '@prisma/client';
import Image from 'next/image';
import { FaX } from 'react-icons/fa6';
import axios, { AxiosRequestConfig } from 'axios';
import { getImageSrcFromPath } from '@/lib/utility';
import useUserProfilePicture from '@/hooks/useUserProfilePicture';
import useUserHeader from '@/hooks/useUserHeader';

type SettingsState = {
    username: string;
    displayName: string;
    password: string;
    email: string;
    profilePicture: File | Media | null;
    profilePicturePreview: string;
    header: File | Media | null;
    headerPreview: string;
}

type Action = {
    type: string
    arg: number | string | File | null
}
function reducer(state: SettingsState, action: Action): SettingsState {
    switch (action.type) {
        case "CHANGE_USERNAME":
            if (typeof action.arg === "string") {
                return { ...state, username: action.arg }
            }
            break;
        case "CHANGE_DISPLAY_NAME":
            if (typeof action.arg === "string") {
                return { ...state, displayName: action.arg }
            }
            break;
        case "CHANGE_PASSWORD":
            if (typeof action.arg === "string") {
                return { ...state, password: action.arg }
            }
            break;
        case "CHANGE_PROFILE_PICTURE":
            if (action.arg instanceof File || action.arg === null) {
                console.log("Changing PP", action.arg)
                return { ...state, profilePicture: action.arg }
            }
            break;
        case "CHANGE_PROFILE_PICTURE_PREVIEW":
            if (typeof action.arg === "string") {
                return { ...state, profilePicturePreview: action.arg }
            }
            break;
        case "CHANGE_HEADER":
            if (action.arg instanceof File || action.arg === null) {
                return { ...state, header: action.arg }
            }
            break;
        case "CHANGE_HEADER_PREVIEW":
            if (typeof action.arg === "string") {
                return { ...state, headerPreview: action.arg }
            }
            break;
        default:
            throw new Error("Invalid Settings Argument")
    }
    throw new Error("Invalid Settings Argument")
}

export default function Profile() {
    const { data: session, update } = useSession();
    const profilePicture = useUserProfilePicture();
    const header = useUserHeader();
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const initSettingsState: SettingsState = {
        username: session?.user.username || "",
        displayName: session?.user.displayName || "",
        password: "",
        email: session?.user.email || "",
        profilePicture: profilePicture || null,
        profilePicturePreview: "",
        header: header || null,
        headerPreview: "",
    }
    const [settingsState, dispatchSettings] = useReducer<Reducer<SettingsState, Action>>(reducer, initSettingsState)

    const profilePictureCallback = (files: File[]) => {
        dispatchSettings({ type: "CHANGE_PROFILE_PICTURE", arg: files[0] })
        const fileReader: FileReader = new FileReader;
        fileReader.readAsDataURL(files[0])
        fileReader.onload = function() {
            dispatchSettings({ type: "CHANGE_PROFILE_PICTURE", arg: files[0] })
            dispatchSettings({ type: "CHANGE_PROFILE_PICTURE_PREVIEW", arg: fileReader.result as string });
        }
    }

    const headerCallback = (files: File[]) => {
        dispatchSettings({ type: "CHANGE_HEADER", arg: files[0] })
        const fileReader: FileReader = new FileReader;
        fileReader.readAsDataURL(files[0])
        fileReader.onload = function() {
            dispatchSettings({ type: "CHANGE_HEADER", arg: files[0] })
            dispatchSettings({ type: "CHANGE_HEADER_PREVIEW", arg: fileReader.result as string });
        }
    }

    const saveSettings = () => {
        setIsSaving(true)
        const fd = new FormData();
        fd.append('username', settingsState.username);
        fd.append('displayName', settingsState.displayName)
        fd.append('email', settingsState.email);
        fd.append('profilePicture', settingsState.profilePicture as File);
        fd.append('header', settingsState.header as File);
        let opts: AxiosRequestConfig = {
            headers: { "Content-Type": "multipart/form-data" },
        }
        axios.post("/api/updateSettings", fd, opts).then(() => {
            setIsSaving(false)
            update();
        })
    }

    const getImgSrc = (type: MediaType): string => {
        if (type == MediaType.Header) {
            if (settingsState.header instanceof File || settingsState.header === null) {
                return settingsState.headerPreview;
            } else {
                return getImageSrcFromPath(settingsState.header.src);
            }
        } else if (type == MediaType.ProfilePicture) {
            if (settingsState.profilePicture instanceof File || settingsState.profilePicture === null) {
                return settingsState.profilePicturePreview;
            } else {
                return getImageSrcFromPath(settingsState.profilePicture.src);
            }
        }
        return ""
    }

    return (
        <div className='flex flex-col gap-4'>
            <div>
                {settingsState.header === null ?
                    <Dropzone name="Header" acceptedFileTypes={"image/*"} fileCallback={headerCallback} />
                    :
                    <div className='relative'>
                        <button onClick={() => dispatchSettings({ type: "CHANGE_HEADER", arg: null })} className='hover:text-red-500 text-white absolute top-2 left-2'><FaX strokeWidth={30} stroke='black' /></button>
                        {settingsState.headerPreview !== null ?
                            <Image src={getImgSrc(MediaType.Header)} width={2000} height={2000} quality={100} alt='Header Preview' style={{ width: '100%', height: 'auto' }} />
                            :
                            <div>Loading</div>
                        }
                    </div>
                }
            </div>
            <div className='flex flex-row gap-4'>
                <div>
                    {settingsState.profilePicture === null ?
                        <Dropzone name="Profile Picture" acceptedFileTypes={"image/*"} fileCallback={profilePictureCallback} />
                        :
                        <div className='relative'>
                            <button onClick={() => dispatchSettings({ type: "CHANGE_PROFILE_PICTURE", arg: null })} className='hover:text-red-500 text-white absolute top-2 left-2'><FaX strokeWidth={30} stroke='black' /></button>
                            <Image src={getImgSrc(MediaType.ProfilePicture)} width={200} height={200} alt='Profile Picture Preview' />
                        </div>
                    }
                </div>
                <div className='flex flex-col gap-4'>
                    <div>
                        <label htmlFor='DisplayName'>Display Name</label>
                        <input type="text" name="DisplayName" id="DisplayName" placeholder='Display Name' autoComplete='off'
                            value={settingsState.displayName} onChange={(e) => dispatchSettings({ type: "CHANGE_DISPLAY_NAME", arg: e.currentTarget.value })}
                            className={`text-black w-full rounded-sm font-light bg-white border-2 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed p-2`} />
                    </div>
                    <div>
                        <label htmlFor='Username'>Username</label>
                        <input type="text" name="Username" id="Username" placeholder='Username' autoComplete='off'
                            value={settingsState.username} onChange={(e) => dispatchSettings({ type: "CHANGE_USERNAME", arg: e.currentTarget.value })}
                            className={`text-black w-full rounded-sm font-light bg-white border-2 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed p-2`} />
                    </div>
                    <div>
                        <label htmlFor='Email'>Email</label>
                        <input type="text" name="Email" id="Email" placeholder='Email' spellCheck="false"
                            value={settingsState.email} onChange={(e) => dispatchSettings({ type: "CHANGE_EMAIL", arg: e.currentTarget.value })}
                            className={`text-black w-full rounded-sm font-light bg-white border-2 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed p-2`} />
                    </div>
                </div>
            </div>
            <button onClick={saveSettings} disabled={isSaving} className='btn w-fit'>{isSaving ? "Saving..." : "Save Changes"}</button>
        </div>
    )
}

