"use client"

import { SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { useParams, useRouter } from 'next/navigation'
import { DialogTitle } from '../ui/dialog'

interface ServerSearchProps {
  data: {
    label: string
    type: "channel" | "member"
    data: {
      icon: React.ReactNode
      name: string
      id: string
    }[] | undefined
  }[]
}

const ServerSearch = ({ data }: ServerSearchProps) => {

  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const handleSelect = ({ id, type }: { id: string, type: "channel" | "member" }) => {
    setOpen(false)
    if (type === "member") {
      return router.push(`/server/${params?.serverId}/conversations/${id}`)
    }
    if (type === "channel") {
      return router.push(`/server/${params?.serverId}/channels/${id}`)
    }
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group px-2 py-2 rounded-md flex items-center gap-x-6 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition '>
        <SearchIcon className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
        <p className='font-semiboldtext-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition'>
          Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className='text-xs'>CMD</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* Add a DialogTitle for accessibility */}
        <DialogTitle className="sr-only"> {/* Use a screen-reader-only title */}
          Search for channels or members
        </DialogTitle>
        <CommandInput placeholder='Search all channels ans members' />
        <CommandList>
          <CommandEmpty />
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => handleSelect({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
