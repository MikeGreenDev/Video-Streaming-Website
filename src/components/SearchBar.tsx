"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FaMagnifyingGlass, FaX } from 'react-icons/fa6';

export default function SearchBar() {
    const [search, setSearch] = useState<string>("")
    const router = useRouter();

    const doSearch = (e: any) => {
        console.log(search)
        router.push(`/search?s=${encodeURI(search)}`)
        router.refresh();
    }

    return (
        <div className='w-[40%] m-auto'>
            <form action={(e) => doSearch(e)} className='bg-backgroundHL w-full flex h-[2.5em] border-[1px] border-gray-800 rounded-xl'>
                <div className='relative rounded-2xl grow'>
                    <input type='text' className='bg-backgroundHL w-full p-4 h-full rounded-xl'
                        onChange={(e) => setSearch(e.currentTarget.value)} value={search} placeholder='Search' />
                    {search &&
                        <button type='reset' onClick={() => setSearch("")} className='bg-backgroundHL w-fit h-full absolute right-0 mx-2 overflow-hidden'>
                            <FaX />
                        </button>
                    }
                </div>
                <button type='submit' className={`bg-backgroundHL w-fit h-full mx-2 ${search ? "text-white" : "text-gray-400"}`}>
                    <FaMagnifyingGlass />
                </button>
            </form>
        </div>
    )
}

