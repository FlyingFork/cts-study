import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { LangProvider } from '@/lib/context/LangContext';
import { ProgressProvider } from '@/lib/context/ProgressContext';
import { ThemeProvider } from '@/lib/context/ThemeContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: 'CTS',
  description: 'Interactive CTS study guide for university exam',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} min-h-screen bg-light-bg font-sans text-light-text antialiased dark:bg-dark-bg dark:text-dark-text`}>
        <ThemeProvider>
          <LangProvider>
            <ProgressProvider>
              <Navbar />
              <main className="mx-auto min-h-[calc(100vh-7rem)] w-full max-w-6xl px-4 py-8">{children}</main>
              <Footer />
            </ProgressProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
