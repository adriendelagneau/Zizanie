"use client"

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Button } from '../ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'



export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === "deleteChannel"
    const { server, channel } = data

    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url)
            onClose()
            router.push(`/server/${server?.id}`)
            router.refresh()
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white tex-black p-0 overflow-hidden text-black'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-semibold text-gray-800'>
                        Delete channel
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to do this? <br />
                        <span className='text-indigo-500 font-semibold'>#{channel?.name} </span>will be permanetly deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-gray-100 px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant={"ghost"}
                        >Cancel</Button>
                        <Button
                            disabled={isLoading}
                            onClick={handleClick}
                            variant={"primary"}
                        >Confirm</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


