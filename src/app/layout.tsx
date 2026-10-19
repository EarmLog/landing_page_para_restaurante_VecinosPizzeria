'use client';

import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { DbProvider } from '@/context/DbContext';
import { AuthProvider } from '@/context/AuthContext';
import { PlatformProvider } from '@/components/PlatformProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vecino's Pizzería - Pide tu pizza a domicilio</title>
        <meta name="description" content="Vecino's Pizzería - Las mejores pizzas artesanales directo a tu puerta" />
      </head>
      <body className="bg-vecinos-crema text-vecinos-texto min-h-screen">
        <PlatformProvider>
          <AuthProvider>
            <DbProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 pb-20 md:pb-0">
                  {mounted && children}
                </main>
              </div>
            </DbProvider>
          </AuthProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}
