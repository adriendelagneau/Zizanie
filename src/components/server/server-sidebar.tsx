import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import { HashIcon, MicIcon, ShieldAlertIcon, ShieldCheckIcon, VideoIcon } from 'lucide-react'
import ServerHeader from './server-header'

interface ServerSidebarProps {
    serverId: string
}

const iconMap = {
    [ChannelType.TEXT]: <HashIcon className='w-4 h-4 mr-2' />,
    [ChannelType.AUDIO]: <MicIcon className='w-4 h-4 mr-2' />,
    [ChannelType.VIDEO]: <VideoIcon className='w-4 h-4 mr-2' />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheckIcon className='w-4 h-4 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlertIcon className='w-4 h-4 mr-2 text-rose-500' />,
}


const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)


    if (!server) {
        return redirect("/")
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
    <ServerHeader
                server={server}
                role={role}
            />
    </div>
  )
}

export default ServerSidebar
