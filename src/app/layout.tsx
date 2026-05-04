import type { Metadata, Viewport } from "next";
import { MantineProvider } from "@mantine/core";
import Script from "next/script";
import "./globals.css";

const themeInitScript = `
(() => {
  try {
    const savedTheme = window.localStorage.getItem("theme");
    const resolvedTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  } catch {
    // Theme initialization should fail gracefully.
  }
})();
`;

export const metadata: Metadata = {
  title: "TertiaryFree",
  description:
    "Simplify university life. Centralize timetables, course materials, announcements, attendance, and payments into one premium platform.",
  keywords: [
    "university",
    "academic",
    "student platform",
    "timetable",
    "course materials",
    "attendance",
  ],
  icons: {
    apple: "/pwalogo-removebg-preview.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { PwaSplashScreen } from "@/components/PwaSplashScreen";
import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <MantineProvider defaultColorScheme="auto">
          <PwaSplashScreen />
          <AuthProvider>
            {children}
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
