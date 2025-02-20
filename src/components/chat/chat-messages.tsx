"use client"

import { Member, Message, Profile } from "@prisma/client"
import ChatWelcome from "./chat-welcome"
import { useChatQuey } from "@/hooks/use-chat-query"
import { Loader2Icon, ServerCrashIcon } from "lucide-react"
import { Fragment, useRef } from "react"
import ChatItem from "./chat-item"
import { format } from "date-fns"

const DATE_FORMAT = "d MMM yyyy, HH:mm"

type MessagesWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

interface ChatMessagesProps {
    name: string
    member: Member & {
        profile: Profile
    }
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, string>
    paramKey: "channelId" | "conversationId"
    paramValue: string
    type: "channel" | "conversation"
}
import React from 'react'
import { useChatSocket } from "@/hooks/use-socket"
import { useChatScroll } from "@/hooks/use-chat-scroll"


const ChatMessages = ({ name, member, chatId, apiUrl, socketUrl, socketQuery, paramKey, paramValue, type }: ChatMessagesProps) => {

    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:newMessages`
    const updateKey = `chat:${chatId}:messages:update`


    const chatRef = useRef<HTMLDivElement>(null)
    const bottomRef = useRef<HTMLDivElement>(null)

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuey({ queryKey, apiUrl, paramKey, paramValue })
    console.log(data)
    useChatSocket({ queryKey, addKey, updateKey })
    useChatScroll({
        chatRef: chatRef as React.RefObject<HTMLDivElement>,
        bottomRef: bottomRef as React.RefObject<HTMLDivElement>,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0
    })

    if (status === "pending") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2Icon className="h-7 w-7 animate-spin my-4" />
                <p className="text-xs">Loading messages ...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrashIcon className="h-7 w-7 my-4" />
                <p className="text-xs">Something went wrong ...</p>
            </div>
        )
    }
    
    return (
        <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
            <div className="flex-1">
                <ChatWelcome
                    type={type}
                    name={name}
                />

                <div className="flex flex-col-reverse ml-auto">
                    {data?.pages?.map((group, i) => (
                        <Fragment key={`group-${i}`}> {/* ✅ Ensure unique key */}
                            {group.items.map((message: MessagesWithMemberWithProfile) => (
                                <ChatItem
                                    key={message.id}  // ✅ Fallback in case `message.id` is undefined
                                    id={message.id}
                                    currentMember={member}
                                    member={message.member}
                                    content={message.content}
                                    fileUrl={message.fileUrl}
                                    deleted={message.deleted}
                                    isUpdated={message.updatedAt !== message.createdAt}
                                    socketUrl={socketUrl}
                                    socketQuery={socketQuery}
                                />
                            ))}
                        </Fragment>
                    ))}
                </div>
                <div ref={bottomRef}></div>
            </div>
        </div>
    )
}

export default ChatMessages
