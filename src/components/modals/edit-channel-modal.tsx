"use client"

import React, { useEffect } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, Dialog, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import qs from "query-string"

import { useParams,  useRouter } from 'next/navigation'
import axios from "axios"
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required"
    }).refine(
        name => name !== "general",
        {
            message: "Channel name can be 'general'"
        }
    ),
    type: z.nativeEnum(ChannelType)

})

export const EditChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal()
    const params = useParams()
    const router = useRouter()

    const isModalOpen = isOpen && type === "editChannel"
    const {  channel, server} = data

 
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channel?.type || ChannelType.TEXT
        }
    })

    useEffect(() => {
        if(channel) {
            form.setValue("name", channel.name)
            form.setValue("type", channel.type)
        }
    }, [form, channel])

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query:{
                    serverId: server?.id
                }
            })
            await axios.patch(url, values)
            form.reset()
            router.refresh()
            onClose()
        } catch (err) {
            console.log(err)
        }
    }

    const handleClose = () => {
        form.reset()
        onClose()
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='  p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-semibold '>
                        Edit your channel
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className='space-y*8 px-6'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold '>
                                            Channel name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className=' border-0 focus-visible:ring-0  focus-visible:ring-offset-0'
                                                placeholder='Enter your channel'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel className='uppercase text-xs font-bold '>
                                            Channel type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className=' border-0 focus:ring-0 ring-offste-0 focus:ring-offset-0 capitalize outline-none'>
                                                    <SelectValue
                                                        placeholder="Select a channel type"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className='capitalize'
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter className='px-6 py-4'>
                            <Button variant={"primary"} disabled={isLoading}>Save</Button>
                        </DialogFooter>
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}


