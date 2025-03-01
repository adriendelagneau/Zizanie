"use client"

import { cn } from '@/lib/utils'
import { Member, MemberRole, Profile, Server } from '@prisma/client'
import { ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import UserAvatar from '../user-avatar'

interface ServerMemberProps {
  member: Member & { profile: Profile }
  server: Server
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheckIcon className='h-4 w-4 ml-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlertIcon className='h-4 w-4 ml-2 text-rose-500' />
}

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams()
  const router = useRouter()

  const icon = roleIconMap[member.role]

  const handleClick = () => {
     if (params?.serverId) {
      router.push(`/server/${params.serverId}/conversations/${member.id}`)
    }
  }
  return (
    <button
    onClick={handleClick}
      className={cn(
        "group px-2 py-2 w-full rounded-md flex items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transitionmb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.image || '/default-avatar.png'}
        className='h-8 w-8 md:h-8 md:w-8'
      />
      <p className={cn(
        "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
        params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}
      >

        {member.profile.name}
      </p>
      {icon}
    </button>
  )
}

export default ServerMember
