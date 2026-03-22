import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#050507",
};

export const metadata: Metadata = {
  title: "HireLens — AI-Powered Job Intelligence",
  description:
    "Analyze your resume against job descriptions. Get match scores, missing keywords, and AI-powered improvement suggestions.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HireLens",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased safe-top safe-bottom">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
