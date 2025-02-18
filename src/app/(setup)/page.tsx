import InitialModal from "@/components/modals/initial-modal"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function SetupPage() {

  const user =  await currentUser()

  if (!user?.id) {
    return redirect("/sign-in")
}

const profile=  await db.profile.findUnique({
  where: {
    userId: user?.id
  }
})
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id
        }
      }
    }
  })

  if(server) {
    return redirect(`/server/${server.id}`)
  }

  return(
   <InitialModal/>
  )
  
}
