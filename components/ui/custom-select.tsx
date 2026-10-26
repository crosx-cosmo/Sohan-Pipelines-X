'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  key?: string;
  value: string;
  label: string;
  description?: string;
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CustomSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
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
  label,
  disabled = false,
  size = 'md',
  align = 'left',
  className,
  buttonClassName,
  menuClassName,
  icon,
  required = false,
  'aria-label': ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);
  const [openUpward, setOpenUpward] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Compute whether menu should flip upward based on available viewport space
  const updateMenuPlacement = React.useCallback(() => {
    if (!buttonRef.current || typeof window === 'undefined') return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // Flip upward if less than 260px below and more room above
    setOpenUpward(spaceBelow < 260 && spaceAbove > spaceBelow);
  }, []);

  // Close when clicking outside or resizing/scrolling window
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleViewportChange() {
      if (isOpen) {
        updateMenuPlacement();
      }
    }

    if (isOpen) {
      updateMenuPlacement();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('scroll', handleViewportChange, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen, updateMenuPlacement]);

  const scrollOptionIntoView = (index: number) => {
    if (!listboxRef.current) return;
    const items = listboxRef.current.querySelectorAll('[role="option"]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement | HTMLUListElement>) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateMenuPlacement();
        setIsOpen(true);
        const idx = options.findIndex((opt) => opt.value === value && !opt.disabled);
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
          let next = prev < options.length - 1 ? prev + 1 : 0;
          let attempts = 0;
          while (options[next]?.disabled && attempts < options.length) {
            next = next < options.length - 1 ? next + 1 : 0;
            attempts++;
          }
          scrollOptionIntoView(next);
          return next;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev > 0 ? prev - 1 : options.length - 1;
          let attempts = 0;
          while (options[next]?.disabled && attempts < options.length) {
            next = next > 0 ? next - 1 : options.length - 1;
            attempts++;
          }
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
          if (chosen && !chosen.disabled) {
            onChange(chosen.value);
            setIsOpen(false);
            buttonRef.current?.focus();
          }
        }
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const sizeClasses = {
    sm: 'h-9.5 px-3 py-1.5 text-xs rounded-xl gap-2',
    md: 'h-11 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl gap-2.5',
    lg: 'h-12 px-4 py-3 text-sm rounded-xl gap-3',
  }[size];

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full min-w-0 max-w-full text-left', isOpen && 'z-[70]', className)}
    >
      {/* Hidden input for native form submission compatibility */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      <button
        ref={buttonRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-label={ariaLabel || label || placeholder}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            if (!isOpen) {
              updateMenuPlacement();
              const idx = options.findIndex((opt) => opt.value === value);
              setHighlightedIndex(idx >= 0 ? idx : 0);
            }
            setIsOpen((prev) => !prev);
          }
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex w-full min-w-0 max-w-full overflow-hidden items-center justify-between border font-medium cursor-pointer select-none',
          sizeClasses,
          'bg-card/85 dark:bg-card/70 backdrop-blur-md',
          'border-border/80 dark:border-border/70',
          'shadow-xs transition-[color,background-color,border-color,box-shadow] duration-150',
          'hover:border-primary/50 hover:bg-card dark:hover:bg-card/90 hover:shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary',
          isOpen && 'border-primary ring-2 ring-primary/20 bg-card dark:bg-card/95 shadow-sm',
          disabled && 'opacity-50 cursor-not-allowed hover:border-border/80',
          buttonClassName
        )}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1 truncate">
          {icon && (
            <span
              className={cn(
                'shrink-0 transition-colors',
                isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              )}
            >
              {icon}
            </span>
          )}
          {selectedOption?.icon && (
            <span className="shrink-0 text-primary">
              {selectedOption.icon}
            </span>
          )}
          {label && (
            <span className="text-muted-foreground font-medium shrink-0">
              {label}
            </span>
          )}
          <span
            className={cn(
              'truncate',
              selectedOption ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0 ml-1">
          {selectedOption?.badge !== undefined && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-primary/10 text-primary border border-primary/20">
              {selectedOption.badge}
            </span>
          )}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'shrink-0 transition-colors',
              isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </span>
      </button>

      {/* Theme-Based Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'opacity, transform' }}
            className={cn(
              'absolute z-[80] min-w-[220px] overflow-hidden rounded-xl border gpu-accelerated',
              openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
              align === 'right' ? 'right-0 left-0 sm:left-auto' : 'left-0 right-0',
              'bg-popover/98 dark:bg-card/95 backdrop-blur-2xl',
              'border-border/80 dark:border-border/70',
              'text-popover-foreground shadow-xl dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/10',
              menuClassName
            )}
          >
            <ul
              ref={listboxRef}
              id={id ? `${id}-listbox` : undefined}
              role="listbox"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              className="max-h-64 overflow-y-auto overscroll-contain p-1.5 space-y-0.5 focus:outline-none"
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <li
                    key={option.key || `${option.value || 'opt'}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => {
                      if (!option.disabled) {
                        setHighlightedIndex(index);
                      }
                    }}
                    className={cn(
                      'group relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-medium select-none transition-colors duration-150',
                      option.disabled
                        ? 'opacity-45 cursor-not-allowed'
                        : 'cursor-pointer',
                      isSelected
                        ? 'bg-primary/12 dark:bg-primary/20 text-primary font-semibold'
                        : isHighlighted && !option.disabled
                        ? 'bg-muted/80 dark:bg-muted/60 text-foreground'
                        : 'text-foreground/90 hover:bg-muted/60',
                      !option.value && !isSelected && 'text-muted-foreground italic font-normal'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
                      {option.icon && (
                        <span
                          className={cn(
                            'shrink-0 transition-colors',
                            isSelected
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        >
                          {option.icon}
                        </span>
                      )}
                      <div className="truncate">
                        <span className="block truncate">{option.label}</span>
                        {option.description && (
                          <span
                            className={cn(
                              'block text-[11px] font-normal truncate mt-0.5',
                              isSelected
                                ? 'text-primary/80 dark:text-primary/90'
                                : 'text-muted-foreground'
                            )}
                          >
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {option.badge !== undefined && (
                        <span
                          className={cn(
                            'px-1.5 py-0.5 text-[10px] font-mono rounded-md border',
                            isSelected
                              ? 'bg-primary/15 text-primary border-primary/30 font-bold'
                              : 'bg-muted/70 text-muted-foreground border-border/60 font-medium'
                          )}
                        >
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.15 }}
                          className="shrink-0 text-primary"
                        >
                          <Check className="h-4 w-4" />
                        </motion.span>
                      )}
                    </div>
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
