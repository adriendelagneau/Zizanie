import { db } from "./db"

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)

    if (!conversation) {
        conversation = await createConversation(memberOneId, memberTwoId)
    }

    return conversation
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    console.log("find conversation")
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId },
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                },

            }
        })

    } catch (err) {
        console.log(err)
        return null
    }
}

const createConversation = async (memberOneId: string, memberTwoId: string) => {
  
    console.log("create conversation")
  
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                },
            }
        })
    } catch (err) {
        console.log(err)
        return null
    }
}

