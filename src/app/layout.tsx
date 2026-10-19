import '../styles/globals.css';
import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navbar';
import { DbProvider } from '@/context/DbContext';
import { AuthProvider } from '@/context/AuthContext';
import { PlatformProvider } from '@/components/PlatformProvider';
import NotificacionesToast from '@/components/ui/NotificacionesToast';

export const metadata: Metadata = {
  title: "Vecino's Pizzería - Pide tu pizza a domicilio",
  description:
    "Vecino's Pizzería - Las mejores pizzas artesanales directo a tu puerta",
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#EA580C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-vecinos-crema text-vecinos-texto min-h-screen">
        <PlatformProvider>
          <AuthProvider>
            <DbProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pb-20 md:pb-0">{children}</main>
              </div>
              <NotificacionesToast />
            </DbProvider>
          </AuthProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}
