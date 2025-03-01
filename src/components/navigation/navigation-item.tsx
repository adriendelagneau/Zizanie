"use client"

import React from 'react'
import ActionTooltip from '../action-tooltip'
import { cn } from '@/lib/utils'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'


interface NavigationItemProps {
    id: string
    imageUrl: string
    name: string
    defaultChannelId: string
}

const NavigationItem = ({
    id,
    imageUrl,
    name,
    defaultChannelId
}: NavigationItemProps) => {
    const params = useParams()
    const router = useRouter()

    

    const handleClick = () => {
        router.push(`/server/${id}/channels/${defaultChannelId}`)

    }

    return (
        <ActionTooltip
            side='right'
            align='center'
            label={name}
        >
            <button
                onClick={handleClick}
                className='group relative flex items-center'
            >
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )}/>
          <div className={cn(
            "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
            
            )}>
                <Image  sizes="100%" fill src={imageUrl} alt='channels'/>
            </div>
            </button>
        </ActionTooltip>
    )
}

export default NavigationItem
