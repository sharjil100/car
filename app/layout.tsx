import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motor Shot Cars — Premium Cars in Dhaka, Bangladesh",
  description: "Motor Shot Cars · Bangladesh's curated collection of premium and luxury automobiles. Fresh imports, verified history, Banani, Dhaka.",
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
