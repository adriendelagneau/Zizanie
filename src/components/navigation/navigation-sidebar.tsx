import React from 'react'
import NavigationAction from './navigation-action'
import { currentProfile } from '@/lib/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area' 
import NavigationItem from './navigation-item'
import { ModeToggle } from '../mode-toggle'
import { UserButton } from '@clerk/nextjs'
import Socket from '../Socket'



const NavigationSidebar = async () => {

    const profile = await currentProfile()

    if (!profile) {
        return redirect("/")
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
              where: {
                name: "general"
              },
              orderBy: {
                createdAt: "asc"
              }
            }
          }
    })
    return (
        <div className='space-y-4 text-white flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3'>
            <NavigationAction />
            <Separator
                className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto w-10'
            />
            <ScrollArea className='flex-1 w-full'>
                {servers.map((server) => (
                    <div key={server.id} className='mb-4'>
                        <NavigationItem
                        defaultChannelId={server.channels[0].id}
                            id={server.id}
                            imageUrl={server.imageUrl}
                            name={server.name}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
                <ModeToggle />
        
             <UserButton/>
            </div>
            <Socket/>
        </div>
    )
}

export default NavigationSidebar
