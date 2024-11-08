"use client"
import { useSession } from 'next-auth/react'
import React, { Reducer, useReducer, useState } from 'react'
import Dropzone from './Dropzone';
import { Media } from '@prisma/client';
import Image from 'next/image';
import { FaX } from 'react-icons/fa6';

type SettingsState = {
    username: string;
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
        case "CHANGE_PASSWORD":
            if (typeof action.arg === "string") {
                return { ...state, password: action.arg }
            }
            break;
        case "CHANGE_PROFILE_PICTURE":
            if (action.arg instanceof File || action.arg === null) {
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
    const { data: session } = useSession();
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const initSettingsState: SettingsState = {
        username: session?.user.username || "",
        password: "",
        email: session?.user.email || "",
        profilePicture: JSON.parse(session?.user.profilePicture as string) || null,
        profilePicturePreview: "",
        header: JSON.parse(session?.user.header as string) || null,
        headerPreview: "",
    }
    const [settingsState, dispatchSettings] = useReducer<Reducer<SettingsState, Action>>(reducer, initSettingsState)

    const profilePictureCallback = (files: File[]) => {
        const fileReader: FileReader = new FileReader;
        fileReader.readAsDataURL(files[0])
        fileReader.onload = function() {
            dispatchSettings({ type: "CHANGE_PROFILE_PICTURE_PREVIEW", arg: fileReader.result as string });
        }

        dispatchSettings({ type: "CHANGE_PROFILE_PICTURE", arg: files[0] })
    }

    const headerCallback = (files: File[]) => {
        const fileReader: FileReader = new FileReader;
        fileReader.readAsDataURL(files[0])
        fileReader.onload = function() {
            dispatchSettings({ type: "CHANGE_HEADER_PREVIEW", arg: fileReader.result as string });
        }

        dispatchSettings({ type: "CHANGE_HEADER", arg: files[0] })
    }

    return (
        <div className='flex flex-col gap-4'>
            <div>
                {settingsState.header === null ?
                    <Dropzone name="Header" acceptedFileTypes={"image/*"} fileCallback={headerCallback} />
                    :
                    <div className='relative'>
                        <button onClick={() => dispatchSettings({ type: "CHANGE_HEADER", arg: null })} className='hover:text-red-500 text-white absolute top-2 left-2'><FaX strokeWidth={30} stroke='black'/></button>
                        <Image src={settingsState.headerPreview} width={200} height={200} alt='Header Preview' style={{width: '100%', height: 'auto'}}/>
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
                            <Image src={settingsState.profilePicturePreview} width={200} height={200} alt='Profile Picture Preview' />
                        </div>
                    }
                </div>
                <div className='flex flex-col gap-4'>
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
            <button disabled={isSaving} className='btn w-fit'>{isSaving ? "Saving..." : "Save Changes"}</button>
        </div>
    )
}

