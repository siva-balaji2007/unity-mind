import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'UnityMind — AI Companion for Unity Developers',
  description:
    'Connect your Unity project and chat with an AI that understands your scripts, scenes, prefabs, and architecture. Ship faster with deep project intelligence.',
  keywords: ['Unity', 'AI', 'game development', 'developer tool', 'code assistant', 'Unity AI'],
  openGraph: {
    title: 'UnityMind — AI Companion for Unity Developers',
    description: 'AI companion for Unity developers that understands your entire project.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
