import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { Chatbot } from "@/components/chatbot";
import "./globals.css";
import "./personal-space.css";
export const metadata: Metadata = {
  title: "Soul Sync — Private kink & lifestyle guidance",
  description:
    "Explore your kinks, desires, and fantasies with personal lifestyle guidance. No public profiles or pictures. Just discussion and support, at your pace.",
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
        <Chatbot />
      </body>
    </html>
  );
}
