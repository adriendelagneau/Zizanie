"use client"

import {
    VideoConference,
    LiveKitRoom,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface MediaRoomProps {
    chatId: string
    video: boolean
    audio: boolean
}

const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const [token, setToken] = useState('');
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        (async () => {
            try {
                const resp = await fetch(`/api/livekit?room=${chatId}&username=${user.username || user.id}`);
                const data = await resp.json();
                setToken(data.token);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [user, chatId]);

    if (!user) {
        return null;
    }

    if (token === '') {
        return (
            <div className='flex flex-col flex-1 justify-center items-center'>
                <Loader2 className='h-7 w-7 animate-spin my-4' />
                <p className=''>Loading ...</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            video={true}
            audio={true}
            token={token}
        >
            <VideoConference />
        </LiveKitRoom>
    );
};

export default MediaRoom;
