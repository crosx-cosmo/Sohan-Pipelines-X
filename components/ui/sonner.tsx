'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast font-sans rounded-xl group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-primary/10 py-3.5 px-4 text-xs sm:text-sm font-medium tracking-tight',
          description: 'group-[.toast]:text-muted-foreground text-xs font-normal mt-0.5 leading-relaxed',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-semibold group-[.toast]:rounded-lg text-xs px-3 py-1.5 transition-colors hover:group-[.toast]:bg-primary/90',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-semibold group-[.toast]:rounded-lg text-xs px-3 py-1.5',
          success: 'group-[.toaster]:border-emerald-500/40 group-[.toaster]:bg-emerald-950/20 dark:group-[.toaster]:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200',
          error: 'group-[.toaster]:border-rose-500/40 group-[.toaster]:bg-rose-950/20 dark:group-[.toaster]:bg-rose-950/40 text-rose-950 dark:text-rose-200',
          info: 'group-[.toaster]:border-primary/40 group-[.toaster]:bg-primary/5 text-foreground',
          warning: 'group-[.toaster]:border-amber-500/40 group-[.toaster]:bg-amber-950/20 dark:group-[.toaster]:bg-amber-950/40 text-amber-950 dark:text-amber-200',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
