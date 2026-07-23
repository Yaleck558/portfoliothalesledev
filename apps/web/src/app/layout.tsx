// apps/web/src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import { Geist } from "next/font/google";
import { cn } from "../lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Thales - Portfolio',
  description: 'Portfolio personnel de Thales - Développeur et Designer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={cn("font-sans", geist.variable)}>
      <body className="bg-slate-950">
        <Header />
        <main className="pt-20 md:pt-28">
          {children}
        </main>
      </body>
    </html>
  );
}