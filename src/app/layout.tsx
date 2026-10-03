import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";
import "./personal-space.css";
export const metadata: Metadata = {
  title: "Soul Sync — A little spark. A real connection.",
  description:
    "Find your people, make meaningful connections, and get a little guidance for your love life.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
