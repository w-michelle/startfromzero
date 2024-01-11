import ToasterContext from "@/app/context/ToasterContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/nav-bar";

import { Roboto } from "next/font/google";
import Footer from "@/components/footer";
import AuthContext from "./context/AuthContext";
import { Providers } from "./redux/provider";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});
export const metadata: Metadata = {
  title: "Start From Zero",
  description: "Handmade woodwork",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`relative bg-[#1a1a1a] ${roboto.className}`}>
        <AuthContext>
          <Providers>
            <Toaster />
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </AuthContext>
      </body>
    </html>
  );
}
