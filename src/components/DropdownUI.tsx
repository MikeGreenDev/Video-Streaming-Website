import Link from 'next/link';
import React, { useState } from 'react'

export default function DropdownUI({ title, isOpenDefault, children }: { title: string, isOpenDefault?: boolean, children?: any }) {
    const [isOpen, setIsOpen] = useState(isOpenDefault || false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    //<svg className="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    //    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
    //</svg>
    return (
        <div className='w-full text-inherit'>
            <button
                type="button"
                className="inline-flex items-center w-full"
                onClick={toggleDropdown}
            >
                <div className='flex-grow'>
                    <div className='text-left font-bold text-[1.1em] text-primary'>{title}</div>
                </div>
                <div className='px-3'>
                    <svg className="w-2.5 h-2.5 ml-2.5 hover:[M2,2_L5,8_L8,2]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        {isOpen ?
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2,8 L5,2 L8,8" />
                            :
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2,2 L5,8 L8,2" />
                        }
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="mt-2 w-full text-inherit">
                    {children}
                </div>
            )}
        </div>
    )
}

