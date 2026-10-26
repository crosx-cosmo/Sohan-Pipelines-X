import * as React from 'react';

/**
 * PageLayout provides consistent top padding and minimum viewport height
 * for subpages beneath the persistent fixed header.
 */
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-20 md:pt-24 min-h-[calc(100vh-250px)] flex-1 flex flex-col w-full min-w-0 max-w-full overflow-x-hidden">
      {children}
    </main>
  );
}
