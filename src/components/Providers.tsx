'use client';

import { Header } from './Header';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-20">
        {children}
      </main>
    </>
  );
}
