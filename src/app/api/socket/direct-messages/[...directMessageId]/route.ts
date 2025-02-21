import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Handle POST requests to create messages
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ directMessageId: string }> }) {
    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const { directMessageId } = await params;

        const titi = directMessageId[0]
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID is missing" }, { status: 400 });
        }


        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
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
                }
            }
        })


        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }


        let directMessage = await db.directMessage.findFirst({
            where: {
                id: titi as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        if (!directMessage || directMessage.deleted) {
            return NextResponse.json({ error: "DirectMessage not found" }, { status: 404 });
        }

        const isDirectMessageOwner = directMessage.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR
        const canModify = isDirectMessageOwner || isAdmin || isModerator

        if (!canModify) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        directMessage = await db.directMessage.update({
            where: {
                id: titi as string
            },
            data: {
                fileUrl: null,
                content: "this message has been deleted",
                deleted: true
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        return NextResponse.json(directMessage, { status: 200 });
    } catch (err) {
        console.error("[MESSAGES_POST]", err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}




export async function PATCH(req: NextRequest, { params }: { params: Promise<{ directMessageId: string }> }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const { directMessageId } = await params;

        const titi = directMessageId[0]
        const conversationId = searchParams.get("conversationId");
        const { content } = await req.json();


        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID is missing" }, { status: 400 });
        }


        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
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
                }
            }
        })

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo

        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: titi as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        if (!directMessage || directMessage.deleted) {
            return NextResponse.json({ error: "DirectMessage not found" }, { status: 404 });
        }

        const isMessageOwner = directMessage.memberId === member.id


        if (!isMessageOwner) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        directMessage = await db.directMessage.update({
            where: {
                id: titi as string
            },
            data: {
                content,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })


        return NextResponse.json(directMessage, { status: 200 });
    } catch (err) {
        console.error("[MESSAGES_POST]", err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}
