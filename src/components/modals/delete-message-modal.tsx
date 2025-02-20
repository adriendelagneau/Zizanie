"use client"

import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { Button } from '../ui/button'
import axios from 'axios'
import qs from 'query-string'
import { socket } from '@/socket'



export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal()


    const isModalOpen = isOpen && type === "deleteMessage"
    const { apiUrl, query } = data

    const [isLoading, setIsLoading] = useState(false)

   

  
    const handleClick = async () => {
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
         const res =   await axios.delete(url)

         const channelId = query?.channelId

          if (channelId) {
               const channelKey = `chat:${channelId}:messages:delete`
               socket.emit(channelKey, res.data);
             }
             else{
                const conversationId = res.data.conversationId
                const conversationKey = `chat:${conversationId}:messages:delete`;
            
                console.log("📡 Emitting event to:", conversationKey, res.data); // ✅ Emit directly from form
                socket.emit(conversationKey, res.data);
              }
            
            onClose()
      
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className=' p-0 overflow-hidden '>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-semibold'>
                        Delete message
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to do this? <br />
                        <span className=' font-semibold'>the message will be permanetly deleted</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className=' px-6 py-4'>
                    <div className='flex items-center justify-between w-full'>
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant={"ghost"}
                        >Cancel</Button>
                        <Button
                            disabled={isLoading}
                            onClick={handleClick}
                            variant={"secondary"}
                        >Confirm</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


