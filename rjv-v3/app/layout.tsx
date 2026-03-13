import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'RJV Media Lab | Sound Fader Inc. Studio',
  description: 'Birmingham premier multimedia studio. Recording, podcasting, music production, marketing and branding — all under one roof.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
