"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Badge } from "./ui/badge";

export default function Socket() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

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