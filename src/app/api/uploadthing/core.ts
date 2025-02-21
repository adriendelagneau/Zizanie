import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

  const handleAuth = () => {
    const userId = auth()

    if(!userId) throw new Error("Unauthorized")
      return { userId }
  }


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Route for uploading images
  serverImage: f({ image: { maxFileSize: "4MB", minFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Image uploaded successfully");
    }),

  // Route for uploading both images and PDFs
  messageFile: f(["image", "pdf"]) // This is the correct format
    .middleware(() => handleAuth())
    .onUploadComplete(({file}) => {
      console.log("File uploaded successfully:");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
