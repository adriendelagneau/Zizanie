"use client"

import { Member, MemberRole, Profile } from "@prisma/client"
import UserAvatar from "../user-avatar"
import ActionTooltip from "../action-tooltip"
import { EditIcon, FileIcon, ShieldAlertIcon, ShieldCheckIcon, TrashIcon, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import qs from "query-string"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import axios from "axios"
import { useModal } from "@/hooks/use-modal-store"
import { useParams, useRouter } from "next/navigation"
import { socket } from "@/socket"

interface ChatItemProps {
    id: string
    content: string
    member: Member & {
        profile: Profile
    }
    fileUrl: string | null
    deleted: boolean
    currentMember: Member
    isUpdated: boolean
    socketUrl: string
    socketQuery: Record<string, string>
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheckIcon className="h-4 w-4 text-indigo-500" />,
    "ADMIN": <ShieldAlertIcon className="h-4 w-4 text-rose-500" />,
}

const formSchema = z.object({
    content: z.string().min(1)
})

const ChatItem = ({ id, content, member, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {

    const [isEditing, setIsEditing] = useState(false)
    const { onOpen } = useModal()
    const params = useParams()
    const router = useRouter()

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return
        }
        router.push(`/server/${params?.serverId}/conversations/${member.id}`)
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            })

            const res = await axios.patch(url, values)

            const channelId = socketQuery?.channelId

            if (channelId) {
                const channelKey = `chat:${channelId}:messages:update`;

                console.log("📡 Emitting event to:", channelKey, res.data); // ✅ Emit directly from form
                socket.emit(channelKey, res.data);
            } else {
                const conversationId = res.data.conversationId
                const conversationKey = `chat:${conversationId}:messages:update`;

                console.log("📡 Emitting event to:", conversationKey, res.data); // ✅ Emit directly from form
                socket.emit(conversationKey, res.data);
            }


            form.reset()
            setIsEditing(false)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content])

    const fileType = fileUrl?.split(".").pop()
    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id

    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !deleted && isOwner && !fileUrl

    const isPDF = fileType === "pdf" && fileUrl
    const isImage = !isPDF && fileUrl

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.image || "/default-avatar.png"} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer pr-2">{member.profile.name}</p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                    </div>
                    {isImage && (
                        <a href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48">
                            <Image src={fileUrl} alt={content} fill className="object-cover" />
                        </a>
                    )}
                    {isPDF && (
                        <div className="">
                            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10 w-full'>
                                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
                                <a href={fileUrl} target='_blank' rel='noopener noreferrer' className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                                    PDF File
                                </a>
                            </div>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 mt-1 text-xs"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
                            )}
                        </p>
                    )}

                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem
                                            className="flex-1"
                                        >
                                            <FormControl>
                                                <div className="relative full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none borde-0 focus-visible:ring-0 focus-within:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} size={"sm"} variant={"primary"}>
                                    Save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400">
                                Press escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <EditIcon
                                onClick={() => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-better transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete">
                        <TrashIcon
                            onClick={() => onOpen("deleteMessage", {
                                apiUrl: `${socketUrl}/${id}`,
                                query: socketQuery
                            })}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-better transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}

export default ChatItem
