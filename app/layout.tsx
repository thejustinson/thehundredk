import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THEHUNDREDK | Let's Grow Your Business",
  description:
    "The package for small businesses you will ever get under ₦100,000. Websites, business tools, customer data organisation, and post-project support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
