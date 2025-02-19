"use client"
import { ServerWithMembersWithProfile } from '@/types'
import { MemberRole } from '@prisma/client'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown, LogOutIcon, PlusCircleIcon, SettingsIcon, TrashIcon, User2Icon, UserPlus } from 'lucide-react'
import { useModal } from '@/hooks/use-modal-store'

interface ServerHeaderProps {
    server: ServerWithMembersWithProfile
    role?: MemberRole
}

const ServerHeader = ({ server, role }: ServerHeaderProps) => {

    const { onOpen } = useModal()
    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR


    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className='foncus:outline-none'
                asChild
            >
                <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zin-700/10 dar:hover:bg-zinc-700/50 transition°'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 text-xs font-medim text-black dark:text-neutral-400 space-y-[2px]'>
               
                 {isModerator && (
                    <DropdownMenuItem 
                    className='text-blue-700 dark:text-blue-400 px-3 py-2 text-sm cursor-pointer'
                    onClick={() => onOpen("invite", { server })}
                    >
                        Invite people
                        <UserPlus className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("editServer", { server })} className='px-3 py-2 text-sm cursor-pointer'>
                        Server Settings
                        <SettingsIcon className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
              
                {isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("members", {server})} className='px-3 py-2 text-sm cursor-pointer'>
                        Mange Users
                        <User2Icon className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

             
                {isModerator && (
                    <DropdownMenuItem onClick={() => onOpen("createChannel")} className='px-3 py-2 text-sm cursor-pointer'>
                        Create Channel
                        <PlusCircleIcon className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}

                      
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={()=> onOpen("deleteServer", {server})} className='text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer'>
                        Delete Server
                        <TrashIcon className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
                    
                {!isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen("leaveServer", {server})} className='text-rose-600 px-3 py-2 text-sm cursor-pointer dark:text-rose-400'>
                        Leave Server
                        <LogOutIcon className='h-4 w-4 ml-auto' />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ServerHeader
