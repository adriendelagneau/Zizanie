"use client"

import React from 'react'
import qs from "query-string"
import ActionTooltip from '@/components/action-tooltip'
import { VideoIcon, VideoOffIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'


const ChatVideoButton = () => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const isVideo = searchParams?.get("video")

    const handleClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, {skipNull: true})
        router.push(url)
    }
    const Icon = isVideo ? VideoOffIcon : VideoIcon
    const tooltipLabel = isVideo ? "End video call" : "Start video call"
   
    return (
    <ActionTooltip side='bottom' label={tooltipLabel}>
      <button  onClick={handleClick} className='hover:opacity-75 transition mr-4'>
        <Icon className='w-6 h-6 '/>
      </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
