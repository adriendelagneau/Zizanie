import { socket } from "@/socket";
import { Member, Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;

  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    user: User;
  };
};

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      console.error("🚨 Socket is not initialized!");
      return;
    }

    console.log("🔌 Listening for events:", { addKey, updateKey });

    // ✅ Handle new messages
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      console.log("📩 New message received:", message);

      try {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return { pages: [{ items: [message] }] };
          }

          const newData = [...oldData.pages];
          newData[0] = { ...newData[0], items: [message, ...newData[0].items] };

          return { ...oldData, pages: newData };
        });
      } catch (error) {
        console.error("Error updating query data for new message:", error);
      }
    });
    
    // // ✅ Handle message deletions
    // socket.on(deleteKey, (messageId: string) => {
    //   console.log("🗑 Message deleted:tttttttt", messageId);

    //   try {
    //     queryClient.setQueryData([queryKey], (oldData: any) => {
    //       if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

    //       const newData = oldData.pages.map((page: any) => ({
    //         ...page,
    //         items: page.items.filter((item: MessageWithMemberWithProfile) => item.id !== messageId),
    //       }));

    //       return { ...oldData, pages: newData };
    //     });
    //   } catch (error) {
    //     console.error("Error updating query data for deleted message:", error);
    //   }
    // });




    // ✅ Handle message updates
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      console.log("🔄 Message updated:", message);

      try {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

          const newData = oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) =>
              item.id === message.id ? message : item
            ),
          }));

          return { ...oldData, pages: newData };
        });
      } catch (error) {
        console.error("Error updating query data for updated message:", error);
      }
    });


    // ✅ Cleanup on unmount
    return () => {
      console.log("🛑 Removing socket listeners");
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, queryKey]);

  return null;
};
