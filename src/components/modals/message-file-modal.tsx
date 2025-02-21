"use client"


import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '../ui/button'

import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import axios from "axios"
import { useModal } from '@/hooks/use-modal-store'
import qs from 'query-string'

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachement is required"
    })
})

const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()

    const isModalOpen = isOpen && type === "messageFile"
    const { apiUrl, query } = data

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    })


    const handleClose = () => {
        form.reset()
        onClose()
    }

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })


            await axios.post(url, {
                ...values,
                content: values.fileUrl
            })
            handleClose()
            router.refresh()

        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className=' p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-semibold'>
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className='text-center '>
                        Send a file as message
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y*8 px-6'>
                            <div className='flex items-center justify-center text-center'>

                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className='px-6 py-4'>
                            <Button variant={"primary"} disabled={isLoading}>Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}

export default MessageFileModal
