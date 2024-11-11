'use client'

import { HTMLInputAutoCompleteAttribute } from "react";

interface InputProps {
    type:any,
    value:any,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string
    textarea?:boolean
    id:string
    placeholder?:string
    big?:boolean
    autoComplete?: HTMLInputAutoCompleteAttribute
}

export default function Input({type,value,onChange,name,textarea,id,placeholder,big, autoComplete}:InputProps) {
  return (
    <input id={id} placeholder={placeholder} autoComplete={autoComplete} type={type} value={value} onChange={onChange} name={name} className={`text-black w-full rounded-sm py-4 font-light bg-white border-2 outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${textarea ? 'w-700px h-500px' : 'w-full'} ${big ? 'w-[400px] pb-[6rem]': ''} px-4`}/>
  )
}
