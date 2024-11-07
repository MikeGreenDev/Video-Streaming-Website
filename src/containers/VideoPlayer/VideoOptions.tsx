"use client"
import React, { useRef, useState } from 'react'
import { HiCog8Tooth } from "react-icons/hi2";
import { FaCheck, FaRegClock, FaRegClosedCaptioning } from "react-icons/fa6";
import { LuSettings2 } from "react-icons/lu";
import CaptionStyleOptions from './CaptionStyleOptions';
import { CaptionFile, CaptionProps } from '@/_types/VideoPlayer';

type videoOptionsProps = {
    quality: string
    setQuality: (quality: string) => void;
    playbackRate: number
    setPlaybackRate: (playbackRate: number) => void;
    qualityOptions?: string[];
    playbackRateOptions?: number[];
    captionProps: CaptionProps;
}

const initCaptionFile = (def: number | string, capFiles: CaptionFile[]): number | null => {
    if (typeof def == "number") {
        return def;
    } else {
        let i: number = 0;
        capFiles.map((f) => {
            if (f.displayLang == def) {
                return i
            }
            i++;
        })
    }
    console.warn("Default Caption File not found. Defaulting to first caption file in array")
    return 0
}

export default function VideoOptions(props: videoOptionsProps) {
    const [menuShown, setMenuShown] = useState<boolean>(false);
    const [tabNum, setTabNum] = useState<number>(props.qualityOptions ? 1 : 2);
    const [curCcFileIdx, setCurCcFileIdx] = useState<number | null>(props.captionProps.defaultCaptionFile ?
        initCaptionFile(props.captionProps.defaultCaptionFile, props.captionProps.captionFiles || []) : null)
    const [menuString, setMenuString] = useState<string>("main")
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuShown(!menuShown)
    }

    const changeTabNum = (v: number) => {
        setTabNum(v);
    }

    return (
        <div className='group/options p-0 m-0 relative inline-block'>
            <button className='h-full w-full relative' onClick={toggleMenu}>
                <div className='flex items-center cursor-pointer justify-center rounded-[1em] w-[25px] transition-opacity duration-[500ms] hover:bg-[rgba(255,255,255,0.08)] h-full'>
                    <div className={`text-white font-semibold tracking-[.5px] relative top-[-1px] w-full`}>
                        <HiCog8Tooth className='h-full w-full' />
                    </div>
                </div>
            </button>
            {menuShown &&
                <div className="text-white absolute bg-[rgba(0,0,0,0.8)] p-2 rounded bottom-[50px] w-fit h-fit right-[50%] cursor-default" ref={menuRef}>
                    {menuString == "main" ?
                        <div className='w-[12em]'>
                            <div className='TabHead border-b-2 border-b-white flex gap-[.5em]'>
                                {props.qualityOptions &&
                                    <div className={`Tabs p-1 bg-grey h-full w-[2em] ${tabNum === 1 ? "text-white" : "text-[rgba(200,200,200,0.9)]"}`}>
                                        <button className='w-full' onClick={() => changeTabNum(1)}><LuSettings2 className='w-full h-auto' /></button>
                                    </div>
                                }
                                {props.playbackRateOptions &&
                                    <div className={`Tabs p-1 bg-grey h-full w-[2em] ${tabNum === 2 ? "text-white" : "text-[rgba(200,200,200,0.9)]"}`}>
                                        <button className='w-full' onClick={() => changeTabNum(2)}><FaRegClock className='w-full h-auto' /></button>
                                    </div>
                                }
                                {props.captionProps.captionFiles && props.captionProps.captionFiles.length > 0 &&
                                    <div className={`Tabs p-1 bg-grey h-full w-[2em] ${tabNum === 3 ? "text-white" : "text-[rgba(200,200,200,0.9)]"}`}>
                                        <button className='w-full' onClick={() => changeTabNum(3)}><FaRegClosedCaptioning className='w-full h-auto' /></button>
                                    </div>
                                }
                            </div>
                            <div className='TabBody h-full w-full'>
                                {tabNum == 1 && <div>
                                    {props.qualityOptions?.map((quality) => (
                                        <div className={`${quality === props.quality ? "text-primary" : "text-white"} cursor-pointer h-[1.5em] w-full justify-between rounded-sm flex flex-row items-center
                                    ${quality != props.quality && "hover:text-secondary"} hover:bg-[rgba(0,0,0,0.4)] focus:bg-[rgba(0,0,0,0.4)]`}
                                            key={`playbackquality_${quality}`}
                                            onClick={() => {
                                                if (props.quality === quality) return;
                                                props.setQuality(quality);
                                            }}
                                        >
                                            <div className='w-[.2em]'>
                                                {quality === props.quality ? <FaCheck /> : ''}
                                            </div>
                                            <div className="font-semibold tracking-[.5px] relative top-[-1px]">
                                                {quality}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                }
                                {tabNum == 2 && <div>
                                    {props.playbackRateOptions?.map((rate) => (
                                        <div className={`${rate === props.playbackRate ? "text-primary" : "text-white"} cursor-pointer h-[1.5em] w-full justify-between rounded-sm flex flex-row items-center 
                                    ${rate != props.playbackRate && "hover:text-secondary"} hover:bg-[rgba(0,0,0,0.4)] focus:bg-[rgba(0,0,0,0.4)]`}
                                            key={`playbackRate_${rate}`}
                                            onClick={() => {
                                                if (props.playbackRate === rate) return;
                                                props.setPlaybackRate(rate);
                                            }}
                                        >
                                            <div className='w-[.2em]'>
                                                {rate === props.playbackRate ? <FaCheck /> : ''}
                                            </div>
                                            <div className="font-semibold tracking-[.5px] relative top-[-1px]">
                                                {rate}x
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                }
                                {tabNum == 3 &&
                                    <div>
                                        <div className='underline text-slate-300 ml-auto w-fit cursor-pointer hover:text-orange-500' onClick={() => {setMenuString("CaptionSettings")}}>
                                            Settings
                                        </div>
                                        <div className={`${null == curCcFileIdx ? "text-primary" : "text-white"} cursor-pointer h-[1.5em] w-full justify-between rounded-sm flex flex-row items-center
                                            ${null != curCcFileIdx && "hover:text-secondary"} hover:bg-[rgba(0,0,0,0.4)] focus:bg-[rgba(0,0,0,0.4)]`}
                                            onClick={() => {
                                                if (curCcFileIdx === null) return;
                                                if (props.captionProps.setCaptionFileIdx != null) {
                                                    props.captionProps.setCaptionFileIdx(null);
                                                    setCurCcFileIdx(null)
                                                }
                                            }}>
                                            <div className='w-[.2em]'>
                                                {null == curCcFileIdx ? <FaCheck /> : ''}
                                            </div>
                                            <div className="font-semibold tracking-[.5px] relative top-[-1px]">
                                                Off
                                            </div>
                                        </div>
                                        {props.captionProps.captionFiles && props.captionProps.captionFiles.map((ccFile, i) => (
                                            <div key={i} className={`${i == curCcFileIdx ? "text-primary" : "text-white"} cursor-pointer h-[1.5em] w-full justify-between rounded-sm flex flex-row items-center
                                                ${i != curCcFileIdx && "hover:text-secondary"} hover:bg-[rgba(0,0,0,0.4)] focus:bg-[rgba(0,0,0,0.4)]`}
                                                onClick={() => {
                                                    if (curCcFileIdx === i) return;
                                                    if (props.captionProps.setCaptionFileIdx != null) {
                                                        props.captionProps.setCaptionFileIdx(i);
                                                        setCurCcFileIdx(i)
                                                    }
                                                }}>
                                                <div className='w-[.2em]'>
                                                    {i == curCcFileIdx ? <FaCheck /> : ''}
                                                </div>
                                                <div className="font-semibold tracking-[.5px] relative top-[-1px]">
                                                    {ccFile.displayLang}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                        :
                        <div>
                            {props.captionProps.captionStyles &&
                                <CaptionStyleOptions menuString={menuString} setMenuString={setMenuString} captionStyles={props.captionProps.captionStyles} updateStyles={props.captionProps.updateStyles}/>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    )
}
