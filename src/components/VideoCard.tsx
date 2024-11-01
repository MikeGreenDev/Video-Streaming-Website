import Image from 'next/image'
import React from 'react'

type VideoCardProps = {
    title: String
}

export default function VideoCard(props: VideoCardProps) {
  return (
      <div className='w-[20em] relative'>
        <Image src="/pexels-moose-photos-170195-1037992.jpg" alt="" width={2000} height={2000} quality={100} style={{width: '100%', height: 'auto'}}/>
        <div>
            <h3>{props.title.substring(0, 80)}{props.title.length > 80 && "..."}</h3>
        </div>
      </div>
  )
}

