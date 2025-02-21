// import { useSocket } from "@/components/providers/socket-provider"
import { socket } from "@/socket"
import { useInfiniteQuery } from "@tanstack/react-query"

import qs from "query-string"


interface ChatQueryProps {
    queryKey: string
    apiUrl: string
    paramKey: "channelId" | "conversationId"
    paramValue: string
}


export const useChatQuey = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {

   const sk = socket.connected
   console.log(sk, 'connected sk')

    const fetchMessages = async ({ pageParam = undefined }) => {

        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue
            }
        }, { skipNull: true });
        const res = await fetch(url)
        return res.json()
    }

    const {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: sk ? false : 5000,
        initialPageParam: undefined, // Add this property to define the starting page parameter

    })

    return {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status
    }
}


