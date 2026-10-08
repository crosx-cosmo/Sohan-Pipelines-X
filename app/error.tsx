'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-4">
        <h2 className="font-display text-2xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          An error occurred while loading this section.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button onClick={() => reset()} size="sm">
            Try again
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
