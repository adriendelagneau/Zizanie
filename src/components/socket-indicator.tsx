"use client"

import React, { useEffect, useState } from 'react'

import { socket } from '@/socket';
import { Badge } from './ui/badge';

const SocketIndicator = () => {
      const [isConnected, setIsConnected] = useState(false);

      useEffect(() => {
          if (socket.connected) {
              setIsConnected(true);

          }
      
        }, [socket.connected]);

      

        if (!isConnected) {
            return (
                <Badge
                    variant={"outline"}
                    className="bg-yellow-600 text-white border-none"
                >
                    Fallback: Polling every 1s
                </Badge>
            )
        }
        return (
            <Badge
                variant={"outline"}
                className="bg-emerald-600 text-white border-none"
            >
                Live: Real-time update
            </Badge>
        )
}

export default SocketIndicator
