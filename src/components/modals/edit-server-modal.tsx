"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-upload";
import { useEffect } from "react";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.string().min(1, { message: "Server image is required" }),
});

export const EditServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "editServer";
  const {server} = data



  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {

      await axios.patch(`/api/servers/${server?.id}`, values);
      router.refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  useEffect(() => {
    if(server){
      form.setValue('name', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
  },[server, form])

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 overflow-hidden bg-secondary">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-semibold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* Server Image Field */}
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Server Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold">Server Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer with Create Button */}
            <DialogFooter className="px-6 py-4">
              <Button type="submit" variant="primary" disabled={isLoading} className="cursor-pointer">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
