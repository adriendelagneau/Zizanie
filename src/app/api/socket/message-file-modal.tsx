"use client"

import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import qs from "query-string"
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import axios from "axios"

import { useModal } from '@/hooks/use-modal-store';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export const FormSchema = z.object({

    imageUrl: z.string().min(1, {
        message: "Server is required"
    })
})

const MessageFileModal = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [uploading, setUploading] = useState(false); 

  const {isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "messageFile"
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      imageUrl: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset()
    onClose()
}


  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    // update to server action
    try{
        await axios.post("/api/servers", values)
        router.refresh()
        window.location.reload()
     }catch(err) {
         console.log(err)
     }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setImageFile(file); 
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await uploadImage(formData);  // Server action call
    form.setValue("imageUrl", response.url)
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-semibold'>
            Add files ...
          </DialogTitle>
          <DialogDescription className='text-center '>
            pdf.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>

             
              <div className='flex flex-col items-center justify-center text-center gap-4'>
                {previewUrl ? (
                    <div className='relative'>

                  <div className='relative w-24 h-24 rounded-full overflow-hidden border'>
                    <Image src={previewUrl} alt="Server Preview" layout="fill" objectFit="cover" />
                        </div>
                    <button
                      type="button"
                      className="absolute z-20 w-8 h-8 top-1 cursor-pointer -right-4 rounded-full p-1"
                      onClick={() => {
                          setPreviewUrl(null);
                          setImageFile(null);
                          form.setValue("imageUrl", ""); 
                        }}
                        >
                      X
                    </button>
                  </div>
                ) : (
                  <label className='cursor-pointer text-blue-500 underline'>
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={isLoading}
                    />
                  </label>
                )}
              </div>

           
              {previewUrl && (
                <div className='flex justify-center'>
                  <Button 
                    type="button" 
                    onClick={handleImageUpload} 
                    className='cursor-pointer'
                    disabled={uploading}
                    variant="secondary"
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              )}

            
            </div>

            {/* Footer with Create Button */}
            <DialogFooter className=' px-6 py-4'>
              <Button type='submit' variant="secondary" className='cursor-pointer'>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
