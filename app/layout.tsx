import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/client-providers";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeutschLern — German Learning Platform",
  description: "A highly scalable, future-proof German language learning platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="min-h-full flex text-slate-200">
        <ClientProviders>
          <div className="flex flex-col md:flex-row w-full min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-900/50">
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
