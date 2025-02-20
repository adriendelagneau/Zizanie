import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { socket } from "@/socket";

import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Handle POST requests to create messages
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ messageId: string }> }) {
    try {

        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const channelId = searchParams.get("channelId");
        const { messageId } = await params

        const recieveMessageId = messageId[0]

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!serverId) {
            return NextResponse.json({ error: "Server ID is missing" }, { status: 400 });
        }
        if (!channelId) {
            return NextResponse.json({ error: "ChannelId is missing" }, { status: 400 });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        })
        if (!server) {
            return NextResponse.json({ error: "Server not found" }, { status: 404 });
        }


        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })
        if (!channel) {
            return NextResponse.json({ error: "Channel not found" }, { status: 404 });
        }

        const member = server.members.find((member) => member.profileId === profile.id)
        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        let message = await db.message.findFirst({
            where: {
                id: recieveMessageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        if (!message || message.deleted) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        const isMessageOwner = message.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isModerator

        if (!canModify) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        message = await db.message.update({
            where: {
                id: recieveMessageId as string
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
        return NextResponse.json(message, { status: 200 });
    } catch (err) {
        console.error("[MESSAGES_POST]", err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}




export async function PATCH(req: NextRequest, { params }: { params: Promise<{ messageId: string }> }) {
    try {
        const profile = await currentProfile();
        const { content } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const channelId = searchParams.get("channelId");
        const { messageId } = await params

        const recieveMessageId = messageId[0]
        console.log(recieveMessageId, "messageId")

        console.log(content, "content")
        console.log("Received messageId:", messageId);

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!serverId) {
            return NextResponse.json({ error: "Server ID is missing" }, { status: 400 });
        }
        if (!channelId) {
            return NextResponse.json({ error: "ChannelId is missing" }, { status: 400 });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        })
        if (!server) {
            return NextResponse.json({ error: "Server not found" }, { status: 404 });
        }


        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })
        if (!channel) {
            return NextResponse.json({ error: "Channel not found" }, { status: 404 });
        }

        const member = server.members.find((member) => member.profileId === profile.id)
        if (!member) {
            return NextResponse.json({ error: "Member not found" }, { status: 404 });
        }
        let message = await db.message.findFirst({
            where: {
                id: recieveMessageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        if (!message || message.deleted) {
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        const isMessageOwner = message.memberId === member.id


        if (!isMessageOwner) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        message = await db.message.update({
            where: {
                id: recieveMessageId as string
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


        return NextResponse.json(message, { status: 200 });
    } catch (err) {
        console.error("[MESSAGES_POST]", err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}
