import {
  Droplets,
  Wrench,
  ShowerHead,
  Flame,
  Pipette,
  Building2,
  Home,
  AlertTriangle,
  Bath,
  Gauge,
  Recycle,
  Sparkles,
} from 'lucide-react';

export type ServiceCategory =
  | 'residential'
  | 'commercial'
  | 'emergency'
  | 'installation'
  | 'maintenance';

export interface PlumbingService {
  id: string;
  name: string;
  description: string;
  icon: typeof Droplets;
  category: ServiceCategory;
  features: string[];
  startingPrice: number;
  duration: string;
  popular?: boolean;
}

export const services: PlumbingService[] = [
  {
    id: 'pipe-fitting-repair',
    name: 'Pipe Fitting & Repair',
    description:
      'Expert installation, repair, and replacement of all pipe types — PVC, CPVC, copper, galvanized, and PEX — for reliable water flow throughout your property.',
    icon: Pipette,
    category: 'residential',
    features: [
      'All pipe materials supported',
      'Leak detection & sealing',
      'Pressure testing',
      'Rust & corrosion removal',
    ],
    startingPrice: 499,
    duration: '1-3 hours',
    popular: true,
  },
  {
    id: 'drainage-cleaning',
    name: 'Drainage Cleaning',
    description:
      'Complete drain cleaning and unclogging services for kitchens, bathrooms, and main sewer lines using high-pressure jetting and professional-grade equipment.',
    icon: Droplets,
    category: 'maintenance',
    features: [
      'High-pressure water jetting',
      'Sewer line cleaning',
      'Odor elimination',
      'Blockage removal',
    ],
    startingPrice: 399,
    duration: '1-2 hours',
    popular: true,
  },
  {
    id: 'bathroom-fitting',
    name: 'Bathroom Fitting',
    description:
      'Full bathroom plumbing solutions including commode installation, shower setup, faucet fitting, and complete bathroom renovation plumbing work.',
    icon: Bath,
    category: 'installation',
    features: [
      'Commode & urinal installation',
      'Shower & faucet fitting',
      'Geyser connection',
      'Tile-friendly plumbing',
    ],
    startingPrice: 799,
    duration: '2-5 hours',
  },
  {
    id: 'kitchen-plumbing',
    name: 'Kitchen Plumbing',
    description:
      'Kitchen sink installation, water tap fitting, water purifier connection, and drainage line setup for smooth kitchen water management.',
    icon: ShowerHead,
    category: 'residential',
    features: [
      'Sink & tap installation',
      'Water purifier hookup',
      'Drain trap fitting',
      'Hot water line setup',
    ],
    startingPrice: 449,
    duration: '1-3 hours',
  },
  {
    id: 'water-tank-installation',
    name: 'Water Tank Installation',
    description:
      'Overhead and underground water tank installation with motor connection, float valve setup, and complete piping from tank to taps.',
    icon: Gauge,
    category: 'installation',
    features: [
      'Overhead tank setup',
      'Underground tank fitting',
      'Motor & pump connection',
      'Float valve installation',
    ],
    startingPrice: 999,
    duration: '3-6 hours',
  },
  {
    id: 'geyser-installation',
    name: 'Geyser & Water Heater Installation',
    description:
      'Safe and reliable installation of electric geysers and water heaters with proper electrical connection, safety valve, and pipe fitting.',
    icon: Flame,
    category: 'installation',
    features: [
      'Electric geyser fitting',
      'Gas geyser setup',
      'Safety valve install',
      'Temperature regulation',
    ],
    startingPrice: 599,
    duration: '1-2 hours',
  },
  {
    id: 'leak-detection-repair',
    name: 'Leak Detection & Repair',
    description:
      'Advanced leak detection using pressure testing and visual inspection, followed by precise repair to stop water waste and damage.',
    icon: Wrench,
    category: 'emergency',
    features: [
      'Pressure-based leak detection',
      'Wall & floor leak repair',
      'Pipe joint sealing',
      'Waterproofing solutions',
    ],
    startingPrice: 349,
    duration: '1-3 hours',
    popular: true,
  },
  {
    id: 'commercial-plumbing',
    name: 'Commercial Plumbing',
    description:
      'Large-scale plumbing solutions for offices, shops, restaurants, and industrial buildings — including multi-floor pipe networks and restroom facilities.',
    icon: Building2,
    category: 'commercial',
    features: [
      'Multi-floor pipe networks',
      'Public restroom fitting',
      'Grease trap installation',
      'Commercial water systems',
    ],
    startingPrice: 1499,
    duration: 'Half day to full day',
  },
  {
    id: 'emergency-plumbing',
    name: '24/7 Emergency Plumbing',
    description:
      'Round-the-clock emergency plumbing service for burst pipes, major leaks, overflowing drains, and any urgent plumbing crisis.',
    icon: AlertTriangle,
    category: 'emergency',
    features: [
      '24/7 availability',
      'Burst pipe repair',
      'Flood prevention',
      'Immediate response',
    ],
    startingPrice: 699,
    duration: 'Same-day service',
  },
  {
    id: 'sewage-line-cleaning',
    name: 'Sewage Line Cleaning',
    description:
      'Professional sewage and sewer line cleaning, inspection, and repair to keep your waste system flowing and odor-free.',
    icon: Recycle,
    category: 'maintenance',
    features: [
      'Sewer line jetting',
      'Inspection camera service',
      'Root removal',
      'Manhole cleaning',
    ],
    startingPrice: 599,
    duration: '2-4 hours',
  },
  {
    id: 'home-plumbing-maintenance',
    name: 'Home Plumbing Maintenance',
    description:
      'Annual or scheduled maintenance contracts for homes — regular checks, preventive care, and priority service calls.',
    icon: Home,
    category: 'maintenance',
    features: [
      'Scheduled inspections',
      'Preventive repairs',
      'Priority booking',
      'Service report each visit',
    ],
    startingPrice: 199,
    duration: 'Ongoing contract',
  },
  {
    id: 'waterproofing-solutions',
    name: 'Waterproofing Solutions',
    description:
      'Complete waterproofing for bathrooms, terraces, and water-exposed areas to prevent seepage, dampness, and structural damage.',
    icon: Sparkles,
    category: 'residential',
    features: [
      'Bathroom waterproofing',
      'Terrace waterproofing',
      'Seepage treatment',
      'Damp wall solutions',
    ],
    startingPrice: 899,
    duration: '1-3 days',
  },
];

export type Category = 'all' | ServiceCategory;

export const categoryLabels: Record<Category, string> = {
  all: 'All Services',
  residential: 'Residential',
  commercial: 'Commercial',
  emergency: 'Emergency',
  installation: 'Installation',
  maintenance: 'Maintenance',
};

export const categoryDescriptions: Record<ServiceCategory, string> = {
  residential: 'Trusted home plumbing services for every household need',
  commercial: 'Scalable plumbing systems for businesses and institutions',
  emergency: 'Round-the-clock response when you need it most',
  installation: 'Professional fitting and setup of all plumbing fixtures',
  maintenance: 'Keep your plumbing in top shape with regular care',
};
