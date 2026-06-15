import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/storage";
import { getCourses } from "@/lib/content";
import { TopBar } from "@/components/nav/TopBar";
import { BottomNav } from "@/components/nav/BottomNav";
import { OfflineServiceWorker } from "@/components/OfflineServiceWorker";
import type { NavCourse } from "@/components/nav/nav-utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Platform",
  description:
    "Personal exam-prep platform — adaptive study scheduler, lessons, spaced-repetition flashcards, and timed exam simulations.",
};

export const viewport: Viewport = {
  themeColor: "#110F1B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Build the serialisable nav course list. Empty until Phase 3 — the shell
  // degrades gracefully (switcher hides, bottom-tab course links disable).
  const navCourses: NavCourse[] = getCourses().map((c) => ({
    id: c.id,
    title: c.title,
    accentToken: c.accentToken,
    examDate: c.examDate,
    hasDrills: !!c.drills?.length || !!c.walkthroughs?.length,
  }));

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <OfflineServiceWorker />
          <TopBar courses={navCourses} />
          <main className="mx-auto w-full max-w-screen-lg flex-1 px-4 pb-28 pt-5 sm:px-6 md:pb-12">
            {children}
          </main>
          <BottomNav courses={navCourses} />
        </StoreProvider>
      </body>
    </html>
  );
}
