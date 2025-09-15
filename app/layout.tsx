import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ottonexus - Event Management System | Golden Lotus",
  description: "Professional event management system by Golden Lotus for Otto employees and client guests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
