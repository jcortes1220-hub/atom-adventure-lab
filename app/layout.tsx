import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Element Lab — A chemistry playground',
  icons: { icon: `${process.env.ELEMENT_LAB_BASE_PATH || ''}/favicon.svg` },
  description:
    'Explore 118 elements and unlock chemistry discoveries in a virtual lab.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
