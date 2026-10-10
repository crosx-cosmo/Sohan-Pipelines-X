'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  icon?: React.ReactNode;
  required?: boolean;
  'aria-label'?: string;
}

export function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
  buttonClassName,
  menuClassName,
  icon,
  required = false,
  'aria-label': ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLUListElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        const idx = options.findIndex((opt) => opt.value === value);
        setHighlightedIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev < options.length - 1 ? prev + 1 : 0;
          scrollOptionIntoView(next);
          return next;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : options.length - 1;
          scrollOptionIntoView(next);
          return next;
        });
        break;

      case 'Home':
        e.preventDefault();
        setHighlightedIndex(0);
        scrollOptionIntoView(0);
        break;

      case 'End':
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        scrollOptionIntoView(options.length - 1);
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          const chosen = options[highlightedIndex];
          onChange(chosen.value);
          setIsOpen(false);
          buttonRef.current?.focus();
        }
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const scrollOptionIntoView = (index: number) => {
    if (!listboxRef.current) return;
    const items = listboxRef.current.querySelectorAll('[role="option"]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full text-left', className)}
    >
      {/* Hidden input for form submission compatibility */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      <button
        ref={buttonRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            const idx = options.findIndex((opt) => opt.value === value);
            setHighlightedIndex(idx >= 0 ? idx : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex w-full items-center justify-between gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs sm:text-sm font-medium',
          'bg-card/75 dark:bg-card/60 backdrop-blur-md',
          'border-border/80 dark:border-border/60',
          'shadow-xs transition-[color,background-color,border-color,box-shadow] duration-150',
          'hover:border-primary/50 hover:bg-card/90 dark:hover:bg-card/80 hover:shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary',
          isOpen && 'border-primary ring-2 ring-primary/20 bg-card/95 shadow-sm',
          disabled && 'opacity-50 cursor-not-allowed hover:border-border/80',
          buttonClassName
        )}
      >
        <span className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
          {icon && (
            <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
              {icon}
            </span>
          )}
          {selectedOption?.icon && (
            <span className="shrink-0 text-primary">
              {selectedOption.icon}
            </span>
          )}
          <span
            className={cn(
              'truncate',
              selectedOption ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        {/* Custom Animated Chevron */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors ml-1"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'opacity, transform' }}
            className={cn(
              'absolute left-0 right-0 z-50 mt-1.5 min-w-[200px] overflow-hidden rounded-xl border gpu-accelerated',
              'bg-card/95 dark:bg-card/90 backdrop-blur-xl',
              'border-border/80 dark:border-border/60',
              'shadow-xl dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/5',
              menuClassName
            )}
          >
            <ul
              ref={listboxRef}
              id={id ? `${id}-listbox` : undefined}
              role="listbox"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              className="max-h-60 overflow-y-auto overscroll-contain p-1.5 focus:outline-none"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={option.value || `empty-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'group relative flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-medium select-none transition-colors duration-150',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : isHighlighted
                        ? 'bg-muted/70 text-foreground'
                        : 'text-foreground/90 hover:bg-muted/50',
                      !option.value && 'text-muted-foreground italic font-normal'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
                      {option.icon && (
                        <span
                          className={cn(
                            'shrink-0 transition-colors',
                            isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <div className="truncate">
                        <span className="block truncate">{option.label}</span>
                        {option.description && (
                          <span className="block text-[11px] text-muted-foreground font-normal truncate mt-0.5">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.15 }}
                        className="shrink-0 text-primary ml-2"
                      >
                        <Check className="h-4 w-4" />
                      </motion.span>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
