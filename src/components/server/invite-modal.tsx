"use client"

import React, { useState } from 'react'


import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Label } from '@/components/ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CheckIcon, Copy, RefreshCcwIcon } from 'lucide-react'
import { useOrigin } from '@/hooks/use-origin'
import axios from 'axios'


export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal()
    const origin = useOrigin()

    const isModalOpen = isOpen && type === "invite"
    const { server } = data

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const onNew = async () => {
        try {
            setIsLoading(true)
            const res = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            onOpen("invite", { server: res.data })

        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className=' p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-semibold'>
                        invite Friends
                    </DialogTitle>
                    <DialogDescription >
                      Give this code to your friends, after they passed the link in the url bar, they will be added to your server
                    </DialogDescription>
                </DialogHeader>
                <div className='p-6'>
                    <Label className='uppercase text-xs font-bold'>
                        server link
                    </Label>
                    <div className='flex items-center mt-2 gap-x-2'>
                        <Input
                            onChange={() => { }}
                            disabled={isLoading}
                            className=' border-0 focus-visible:ring-0  focus-visible:ring-offset-0'
                            value={inviteUrl}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon"  variant={"secondary"}>
                            {copied ? <CheckIcon className='w-4 h-4' /> : <Copy className='w-4 h-4' />}

                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant={"link"}
                        size={"sm"}
                        className='text-xs text-zinc-500 mt-4'>
                        Generate a new link
                        <RefreshCcwIcon className='w--4 h-4 ml-2' />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}


