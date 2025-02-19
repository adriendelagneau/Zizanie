"use client"

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Button } from '../ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'



export const LeaveServerModal = () => {
    const { isOpen, onClose, type, data } = useModal()
const router = useRouter()
    const isModalOpen = isOpen && type === "leaveServer"
    const { server } = data

    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)

            await axios.patch(`/api/servers/${server?.id}/leave`)
            onClose()
            router.refresh()
            router.push("/")
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
                        Leave server
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave <span className='text-indigo-500 font-semibold'>{server?.name}</span>?
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


