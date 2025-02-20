// import ChatHeader from '@/components/chat/chat-header'
// import ChatInput from '@/components/chat/chat-input'
// import ChatMessages from '@/components/chat/chat-messages'
// import MediaRoom from '@/components/media-room'
import ChatHeader from '@/components/chat/chat-header'
import { getOrCreateConversation } from '@/lib/conversation' 
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

interface MemeberIdPageProps {
  params:Promise< {
    memberId: string
    serverId: string
  }>
  searchParams:Promise< {
    video?: boolean
  }>
}

const MemeberIdPage = async ({ params, searchParams }: MemeberIdPageProps) => {
  const { memberId, serverId } = await params
  const profile = await currentProfile()
  const {video} = await searchParams
  
  if (!profile) {
    return redirect("/sign-in")
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })
  if (!currentMember) {
    return redirect("/")
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if (!conversation) {
    console.log("no conversation")
    return redirect(`server/${serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.image ?? ''}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {/* {video && (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.user.name}
            chatId={conversation.id}
            type='conversation'
            apiUrl='/api/direct-messages'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              conversationId: conversation.id
            }}
          />
          <ChatInput
            name={otherMember.user.name}
            type="conversation"
            apiUrl='/api/socket/direct-messages'
            query={{
              conversationId: conversation.id
            }}
          />
        </>
      )} */}
    </div>
  )
}

export default MemeberIdPage
