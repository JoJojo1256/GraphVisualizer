import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graph Theory Visualization",
  description: "Interactive visualization of graph theory concepts",
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
