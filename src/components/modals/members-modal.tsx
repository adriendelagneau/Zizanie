"use client"

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { ServerWithMembersWithProfile } from '@/types'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../user-avatar'
import { Check, GavelIcon, Loader2Icon, MoreVerticalIcon, ShieldAlertIcon, ShieldCheckIcon, ShieldIcon, ShieldQuestionIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'
import qs from "query-string"
import { useRouter } from 'next/navigation'
import axios from 'axios'


const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheckIcon className='h-4 w-4 ml-2 text-indigo-500' />,
    "ADMIN": <ShieldAlertIcon className='h-4 w-4 ml-2 text-rose-500' />
}


export const MembersModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const [loadingId, setLoadingId] = useState("")


    const isModalOpen = isOpen && type === "members"
    const { server } = data as { server: ServerWithMembersWithProfile }

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            })

            const res = await axios.delete(url)
            router.refresh()
            onOpen("members", { server: res.data })

        } catch (err) {
            console.log(err)
        } finally {
            setLoadingId("")
        }
    }

    const onRoleChange = async (memberId: string, role: string) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            })

            const res = await axios.patch(url, { role })
            router.refresh()
            onOpen("members", { server: res.data })
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingId("")
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='overflow-hidden '>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-semibold '>
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className='text-center '>
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className='mt-8 max-h-[420px] pr-6'>
                    {server?.members?.map((member) => (
                        <div key={member.id} className='flex items-center   gap-x-2 mb-6'>
                            <UserAvatar src={member.profile.image ? member.profile.image : "https://ik.imagekit.io/pxvdb30xa/posts/pngwing.com_xtHeMuHlt.png?updatedAt=1739174328957"} />
                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-semibold flex items-center gap-x-1'>
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className='text-xs'>
                                    {member.profile.email}
                                </p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className='flex flex-1 justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVerticalIcon className='w-4 h-4' />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side='left'>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className='flex items-center'>
                                                    <ShieldQuestionIcon className='w-4 h-4 ml-2' />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                                            <ShieldIcon className='w-4 h-4 mr-2' />
                                                            Guset
                                                            {member.role === "GUEST" && (
                                                                <Check className='w-4 h-4 mr-auto' />
                                                            )}
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>

                                                            <ShieldIcon className='w-4 h-4 mr-2' />
                                                            Moderator
                                                            {member.role === "MODERATOR" && (
                                                                <Check className='w-4 h-4 mr-auto' />
                                                            )}
                                                        </DropdownMenuItem>

                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => onKick(member.id)}>
                                                <GavelIcon className='w-4 h-4 mr-2' />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2Icon
                                    className='animate-spin text-zinc-500 ml-auto w-4 h-4'

                                />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}


