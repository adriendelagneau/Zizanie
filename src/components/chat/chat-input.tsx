"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../emoji-picker";
import { socket } from "@/socket";
import { useParams } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const params = useParams();

  // ✅ Ensure channelId is extracted properly
  const channelId = (params as Record<string, string>).channelId;


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting; // ✅ Corrected loading state

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    
    // ✅ Send the message to the API, but don't rely on it for emitting
    const url = qs.stringifyUrl({ url: apiUrl, query });
   const res =  await axios.post(url, values);

   console.log(res)
   
    if (channelId) {
      const channelKey = `chat:${channelId}:messages`;

      console.log("📡 Emitting event to:", channelKey, res.data); // ✅ Emit directly from form
      socket.emit(channelKey, res.data);
    }

    if(type === "conversation"){
      const conversationId = res.data.conversationId
      const conversationKey = `chat:${conversationId}:messages`;
  
      console.log("📡 Emitting event to:", conversationKey, res.data); // ✅ Emit directly from form
      socket.emit(conversationKey, res.data);
    }



    form.reset();
  } catch (err) {
    console.error("❌ Error sending message:", err);
  }
};

  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 z-0">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading} // ✅ Prevent multiple submissions
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8 z-10 cursor-pointer">
                    <EmojiPicker
                      onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
