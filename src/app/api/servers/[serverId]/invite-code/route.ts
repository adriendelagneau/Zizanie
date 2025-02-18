import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

import { v4 as uuidv4 } from "uuid"

export async function PATCH(
    req: Request,
    { params }: { params: Promise< { serverId: string }> }
) {
    try {
        const {serverId} = await params
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!serverId) {
            return new NextResponse("ServerId missing", { status: 400 })
        }


        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4()
            }
        })

        return NextResponse.json(server)
    } catch (err) {
        console.log("[SERVER_ID]", err)
        return new NextResponse("Internal server error!", { status: 500 })
    }
}