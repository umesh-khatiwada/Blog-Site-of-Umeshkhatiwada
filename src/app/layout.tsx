import localFont from "next/font/local";
import "./styles/globals.css";
import Header from "./components/layout/Header";
import Submenu from "./components/layout/Submenu";
import { Metadata } from "next";
// import { Metadata } from "next";

// eslint-disable-next-line react-hooks/rules-of-hooks

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Umesh Khatiwada - DevOps Professional &amp; Cloud Architect",
  description: "Explore Umesh Khatiwada's expertise in cloud infrastructure, automation, and software development. DevOps Professional & Cloud Architect offering services and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Submenu/>
        {children}

      </body>
    </html>
  );
}
