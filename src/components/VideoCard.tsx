import { getImageSrcFromPath } from '@/lib/utility'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type VideoCardProps = {
    title: string
    link: string
    thumbnail: string
    alt?: string
}

export default function VideoCard(props: VideoCardProps) {
  return (
      <Link href={props.link} className='group/videoCard w-[20em] relative'>
        <Image src={getImageSrcFromPath(props.thumbnail || "") || "/pexels-moose-photos-170195-1037992.jpg"} alt={props.alt || props.title} width={2000} height={2000} quality={100} style={{width: '100%', height: 'auto', aspectRatio: 16/9}}/>
        <div>
            <h3 className='group-hover/videoCard:text-primary'>{props.title.substring(0, 80)}{props.title.length > 80 && "..."}</h3>
        </div>
      </Link>
  )
}

