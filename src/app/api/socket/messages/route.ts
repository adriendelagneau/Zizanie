import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Handle POST requests to create messages
export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { content, fileUrl } = await req.json();  // Parsing JSON body
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        const channelId = searchParams.get("channelId");

        if (!profile) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (!serverId) {
            return NextResponse.json({ error: "Server ID is missing" }, { status: 400 });
        }
        if (!content) {
            return NextResponse.json({ error: "Content is missing" }, { status: 400 });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: { profileId: profile.id }
                }
            },
            include: { members: true }
        });

        if (!server) {
            return NextResponse.json({ message: "Server not found" }, { status: 404 });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId
            }
        });

        if (!channel) {
            return NextResponse.json({ message: "Channel not found" }, { status: 404 });
        }

        const member = server.members.find((member) => member.profileId === profile.id);
        if (!member) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: { profile: true }
                }
            }
        });

  
      const channelKey = `chat:${channelId}:messages`;

     

    

        return NextResponse.json(message);

    } catch (err) {
        console.error("[MESSAGES_POST]", err);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

// Handle non-POST methods
export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
