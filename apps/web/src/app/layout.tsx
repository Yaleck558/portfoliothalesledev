// apps/web/src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
      <body style={{ backgroundColor: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)', margin: 0, padding: 0 }}>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}