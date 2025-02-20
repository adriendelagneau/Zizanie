import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins (adjust for production)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected", socket.id);

    // Handle new messages dynamically for any chat
    socket.onAny((event, message) => {
      const newMessageMatch = event.match(/^chat:(.+):messages$/);
      const updateMessageMatch = event.match(/^chat:(.+):messages:update$/);
      const deleteMessageMatch = event.match(/^chat:(.+):messages:delete$/);

      if (newMessageMatch) {
        const chatId = newMessageMatch[1];
    //    console.log(`📨 New message in chat ${chatId}:`, message);

        // Emit the message to everyone in the chat room
        io.emit(`chat:${chatId}:newMessages`, message);
      }

      if (updateMessageMatch) {
        const chatId = updateMessageMatch[1];
      //  console.log(`✏️ Message updated in chat ${chatId}:`, message);

        // Emit the updated message to all clients in the chat room
        io.emit(`chat:${chatId}:messages:update`, message);
      }

      if (deleteMessageMatch) {
        const chatId = deleteMessageMatch[1];
      //  console.log(`🗑️ Message deleted in chat ${chatId}:`, message);

        // Emit the deletion event to all clients in the chat room
        io.emit(`chat:${chatId}:messages:update`, message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
