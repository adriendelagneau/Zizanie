import type { Metadata } from "next";
import "@uploadthing/react/styles.css";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { dark, neobrutalism } from '@clerk/themes'
import QueryProvider from "@/components/providers/query-provider";
import Socket from "@/components/Socket";

export const metadata: Metadata = {
  title: "Zizanie",
  description: " Connect, Chat, and Collaborate in Real Time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <ClerkProvider 
    appearance={{
      baseTheme: dark,
      signIn: { baseTheme: neobrutalism },
    }}
    afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-clone"
          >
                <ModalProvider />
                <QueryProvider>
                <Socket/>
            {children}
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
