import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface ServerIdPageProps  {
  params: Promise<{ serverId: string}>;

}

const ServerIdPage = async ({params}: ServerIdPageProps) => {
  
const { serverId} = await params
  
  const profile = await currentProfile()
  if(!profile) {
      return redirect("/sign-in")
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
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



  return redirect(`/server/${serverId}}`)
 
}

export default ServerIdPage
