import { CaptionStyleState } from '@/_types/VideoPlayer'
import { captionColorsToDisplayColors, ColorDisplayNameArray } from '@/lib/VideoPlayer'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

type CaptionStyleOptionsProps = {
    menuString: string
    setMenuString: (str: string) => void
    captionStyles: CaptionStyleState
    updateStyles: (str: string, val: any) => void
}

const fontSizeToDisplaySize = (fs: string): string => {
    const f = Number(fs.slice(0, -2)) / 2
    const s = String(f * 100) + "%"
    return s
}

export default function CaptionStyleOptions(props: CaptionStyleOptionsProps) {
    function styleSetting(display: string, v: any, arr: string[]): React.ReactNode {
        return (
            <div className='w-fit min-w-[10em]'>
                <div className='cursor-pointer hover:text-secondary' onClick={() => { props.setMenuString("CaptionSettings") }}><FaArrowLeft /></div>
                <div className='w-max'>{display}</div>
                <hr className='mb-2' />
                {arr.map((a) => (
                    <div key={a} className={`cursor-pointer ${v == a && "text-primary"} ${v != a && "hover:text-secondary"}`} onClick={() => { props.updateStyles(display, a) }}>
                        <div className='ml-auto w-fit pr-2'>
                            {a}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    function styleInfo(display: string, v: any): React.ReactNode {
        return (
            <div className='flex flex-row cursor-pointer mb-1 group/setting' onClick={() => { props.setMenuString(display) }}>
                <div className='w-max mr-6'>{display}</div>
                <div className='flex-1 text-right group-hover/setting:text-secondary'>{v}</div>
            </div>
        )
    }

    return (
        <div className='w-fit'>
            {props.menuString == "CaptionSettings" &&
                <div>
                    <div className='cursor-pointer hover:text-secondary' onClick={() => { props.setMenuString("main") }}><FaArrowLeft /></div>
                    <div className='w-fit text-[.9em] my-4'>
                        {styleInfo("Font Color", captionColorsToDisplayColors(props.captionStyles.fontColor))}
                        {styleInfo("Font Size", fontSizeToDisplaySize(props.captionStyles.fontSize))}
                        {styleInfo("Background Color", captionColorsToDisplayColors(props.captionStyles.bgColor))}
                        {styleInfo("Background Opacity", props.captionStyles.bgOpacity)}
                        {styleInfo("Character Edge", props.captionStyles.characterEdge)}
                        {styleInfo("Edge Color", captionColorsToDisplayColors(props.captionStyles.edgeColor))}
                    </div>
                </div>
            }
            {props.menuString == "Font Color" &&
                styleSetting("Font Color", captionColorsToDisplayColors(props.captionStyles.fontColor), ColorDisplayNameArray)
            }
            {props.menuString == "Font Size" &&
                styleSetting("Font Size", fontSizeToDisplaySize(props.captionStyles.fontSize), ["200%", "175%", "150%", "125%", "100%", "75%", "50%", "25%"])
            }
            {props.menuString == "Background Color" &&
                styleSetting("Background Color", captionColorsToDisplayColors(props.captionStyles.bgColor), ColorDisplayNameArray)
            }
            {props.menuString == "Background Opacity" &&
                styleSetting("Background Opacity", props.captionStyles.bgOpacity, ["100%", "75%", "50%", "25%", "0%"])
            }
            {props.menuString == "Character Edge" &&
                styleSetting("Character Edge", props.captionStyles.characterEdge, ["None", "Raised", "Depressed", "Uniform", "Drop Shadow"])
            }
            {props.menuString == "Edge Color" &&
                styleSetting("Edge Color", captionColorsToDisplayColors(props.captionStyles.edgeColor), ColorDisplayNameArray)
            }
        </div>
    )
}

