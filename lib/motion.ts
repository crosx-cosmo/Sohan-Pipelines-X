import type { Transition, Variants } from 'motion/react';

/**
 * Sohan Pipelines X — Calibrated Luxury Motion System
 * 
 * Standardized timings based on human perception thresholds:
 * - Micro-interactions (hover/tap): 180ms - 220ms
 * - Small UI elements (badges, toggles, buttons): 200ms - 280ms
 * - Menus, Drawers, Dropdowns: 280ms - 340ms
 * - Section entrances & scroll reveals: 450ms - 580ms
 * - Page/Route transitions: 260ms - 320ms
 */

export const luxuryEasing = [0.16, 1, 0.3, 1] as const;
export const gentleEasing = [0.22, 1, 0.36, 1] as const;
export const smoothOutEasing = [0, 0, 0.2, 1] as const;

export const transitionPresets = {
  hover: {
    duration: 0.2,
    ease: luxuryEasing,
  } satisfies Transition,
  tap: {
    duration: 0.14,
    ease: luxuryEasing,
  } satisfies Transition,
  toggle: {
    type: 'spring',
    stiffness: 450,
    damping: 32,
  } satisfies Transition,
  dropdown: {
    duration: 0.26,
    ease: luxuryEasing,
  } satisfies Transition,
  drawer: {
    duration: 0.32,
    ease: luxuryEasing,
  } satisfies Transition,
  modal: {
    duration: 0.28,
    ease: luxuryEasing,
  } satisfies Transition,
  section: {
    duration: 0.52,
    ease: luxuryEasing,
  } satisfies Transition,
  page: {
    duration: 0.28,
    ease: gentleEasing,
  } satisfies Transition,
};

export const hoverLiftProps = {
  whileHover: { y: -3 },
  whileTap: { scale: 0.985 },
  transition: transitionPresets.hover,
  style: { willChange: 'transform' },
};

export const buttonPressProps = {
  whileTap: { scale: 0.97 },
  transition: transitionPresets.tap,
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.38, ease: luxuryEasing },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: luxuryEasing },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.08,
    },
  },
};

export const drawerSlideVariants: Variants = {
  hidden: {
    x: '100%',
    transition: {
      duration: 0.28,
      ease: [0.32, 0, 0.67, 0],
    },
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.34,
      ease: luxuryEasing,
    },
  },
};

export const drawerBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.24, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.28, ease: 'easeIn' },
  },
};
