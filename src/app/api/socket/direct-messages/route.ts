import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Handle POST requests to create messages
export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { content, fileUrl } = await req.json();  // Parsing JSON body
        const { searchParams } = new URL(req.url);
        const conversationId = searchParams.get("conversationId");
     

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID is missing" }, { status: 400 });
        }
        if (!content) {
            return NextResponse.json({ error: "Content is missing" }, { status: 400 });
        }

        const conversation = await db.conversation.findUnique({
            where: { 
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            userId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            userId: profile.id
                        }
                    }
                ]
             },
             include: {
                memberOne: { include: { user: true } },
                memberTwo: {include: { user: true } }
             }
      
        });

        if (!conversation) {
            return NextResponse.json({ message: "Conversation not found" }, { status: 404 });
        }

        const member = conversation.memberOne.userId === profile.id ? conversation.memberOne : conversation.memberTwo;
        if (!member) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: { user: true }
                }
            }
        });

    

        return NextResponse.json(message);

    } catch (err) {
        console.error("[MESSAGES_POST]", err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}


