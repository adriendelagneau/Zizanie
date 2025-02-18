import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
    src: string
    className?: string
}
const UserAvatar = ({src, className}: UserAvatarProps) => {
  return (
 <Avatar className={cn(
    "h-7 w-7 md:w-10 md:h-10 rounded-full",
    className
 )}>
    <AvatarImage src={src }/>
 </Avatar>
  )
}

export default UserAvatar
