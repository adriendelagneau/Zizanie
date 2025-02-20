"use client"

import { SmileIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import Picker from '@emoji-mart/react'
import data from "@emoji-mart/data"

import { useTheme } from "next-themes"
import { useEffect } from "react"
import { socket } from "@/socket"


interface EmojiPickerProps {
    onChange: (value: string) => void
}

const EmojiPicker = ({onChange}: EmojiPickerProps) => {

    useEffect(() => {
        socket.on('message', (data) => {
            console.log('Received:', data);
        });

        // Cleanup on unmount
        
    }, []);
    const {resolvedTheme} = useTheme()
  return (
   <Popover>
    <PopoverTrigger>
        <SmileIcon className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover-text-300 transition"/>
    </PopoverTrigger>
    <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
        <Picker
        theme={resolvedTheme}
        data={data}
        onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
    </PopoverContent>
   </Popover>
  )
}

export default EmojiPicker
