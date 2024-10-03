import localFont from "next/font/local";
import "./styles/globals.css";
import Header from "./components/layout/Header";
import Submenu from "./components/layout/Submenu";
import { fetchCategories } from "./lib/api";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await fetchCategories();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Submenu categories={categories} />
        {children}
      </body>
    </html>
  );
}
