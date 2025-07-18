import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: 'Wenlock Hospital Management',
  description: 'Centralized Patient & Resource Management System for Wenlock Hospital',
};

export default function RootLayout({
  children,
}:
  Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
        <Toaster position="bottom-right" richColors expand={true} closeButton />
      </body>
    </html>
  );
}
