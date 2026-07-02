import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkStash — short links with analytics",
  description:
    "A full-stack URL shortener with a click-analytics dashboard: clicks over time, top referrers, and device breakdown.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
