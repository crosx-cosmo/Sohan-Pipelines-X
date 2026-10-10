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
            'group toast font-sans rounded-2xl group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:text-foreground group-[.toaster]:border-border/80 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-primary/10 py-3.5 px-4 text-xs sm:text-sm font-medium tracking-tight transition-all',
          description:
            'group-[.toast]:text-muted-foreground text-xs font-normal mt-1 leading-relaxed',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-semibold group-[.toast]:rounded-xl text-xs px-3.5 py-2 shadow-sm transition-all hover:group-[.toast]:bg-primary/90 active:scale-95',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-semibold group-[.toast]:rounded-xl text-xs px-3 py-1.5',
          success:
            'group-[.toaster]:border-emerald-500/50 group-[.toaster]:bg-card group-[.toaster]:text-emerald-700 dark:group-[.toaster]:text-emerald-300 dark:group-[.toaster]:bg-card/95 [&_[data-icon]]:text-emerald-500',
          error:
            'group-[.toaster]:border-rose-500/50 group-[.toaster]:bg-card group-[.toaster]:text-rose-700 dark:group-[.toaster]:text-rose-300 dark:group-[.toaster]:bg-card/95 [&_[data-icon]]:text-rose-500',
          info:
            'group-[.toaster]:border-sky-500/50 group-[.toaster]:bg-card group-[.toaster]:text-sky-700 dark:group-[.toaster]:text-sky-300 dark:group-[.toaster]:bg-card/95 [&_[data-icon]]:text-sky-500',
          warning:
            'group-[.toaster]:border-amber-500/50 group-[.toaster]:bg-card group-[.toaster]:text-amber-700 dark:group-[.toaster]:text-amber-300 dark:group-[.toaster]:bg-card/95 [&_[data-icon]]:text-amber-500',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
