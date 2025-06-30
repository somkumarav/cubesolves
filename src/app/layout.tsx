import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/site-footer";
import "./globals.css";
import ProviderWrapper from "../provider-wrapper";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "cubesolves",
  description:
    "Create with love by somu. A platform for cubers to connect, share, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        suppressHydrationWarning
        className={`${robotoMono.className} antialiased`}
      >
        <ProviderWrapper>
          <main className='container  mx-auto min-h-[90vh]'>{children}</main>
          <NavBar />
          <Footer />
        </ProviderWrapper>
      </body>
    </html>
  );
}
