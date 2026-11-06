import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Landlords and Tenants",
  description: "A marketplace connecting landlords and tenants.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
