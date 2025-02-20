"use client"

import { cn } from "@/lib/utils"
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { EditIcon, HashIcon, LockIcon, MicIcon, Router, TrashIcon, VideoIcon } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import ActionTooltip from "../action-tooltip"
import { ModalType, useModal } from "@/hooks/use-modal-store"

interface ServerChannelProps {
    channel: Channel
    server: Server
    role?: MemberRole
}

const iconMap = {
    [ChannelType.TEXT]: HashIcon,
    [ChannelType.AUDIO]: MicIcon,
    [ChannelType.VIDEO]: VideoIcon,
}




const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    
    const params = useParams()
    const router = useRouter()
    const {onOpen} = useModal()
    
    const Icon = iconMap[channel.type]

    const handleClick = () => {
    router.push(`/server/${params.serverId}/channels/${channel.id}`)

    }

   const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, {channel, server})
   } 

    return (
        <button
            onClick={handleClick}
            className={cn(
                " w-full group px-2 py-2 rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-2",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dar:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>{channel.name}</p>

            {channel.name !=="general" && role !== MemberRole.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Edit">
                        <EditIcon
                        onClick={(e) => onAction(e, "editChannel")}
                        className="hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition w-4 h-4 "/>
                    </ActionTooltip>
                    <ActionTooltip label="Delete">
                        <TrashIcon
                        onClick={(e) => onAction(e, "deleteChannel")}
                        className="hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition w-4 h-4 "/>
                    </ActionTooltip>
                </div>
            )}

            {channel.name === "general" && (
                <LockIcon className="ml-auto w-4 h-4 text-zinc-500"/>
            )}
        </button>
    )
}

export default ServerChannel
