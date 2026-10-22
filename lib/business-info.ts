export const businessInfo = {
  name: "Sohan Pipeline's & Plumbing",
  tagline: 'Total Plumbing Solutions',
  description:
    'Your trusted plumbing partner in West Medinipur and surrounding areas. From precision pipe fitting to full bathroom installation, we deliver reliable, professional plumbing services for homes and businesses.',
  phone: '+918670143003',
  phoneDisplay: '+91 86701 43003',
  email: 'contact@sohanpipelines.in',
  address:
    'Vill : - Bahardaltitia, PO : - Keshrambha, PS : - Dantan, Dist : - West Medinipur, State : - West Bengal, Pin Code : - 721451',
  addressShort: 'Vill : - Bahardaltitia, PO : - Keshrambha, PS : - Dantan',
  district: 'West Medinipur',
  state: 'West Bengal',
  pincode: '721451',
  area: 'Dist : - West Medinipur, State : - West Bengal, Pin Code : - 721451',
  hours: '10:00 AM - 3:00 PM',
  hoursDays: 'Monday to Saturday',
  sundayHours: 'Closed',
  emergencyNote: 'Emergency visits available on call — subject to availability',
  rating: 5.0,
  reviewCount: 0,
  established: 2015,
  serviceAreas: [] as string[],
  serviceDistricts: {} as Record<string, string[]>,
};

export interface TestimonialItem {
  name: string;
  role: string;
  rating: number;
  text: string;
  service: string;
}

// Dummy testimonials removed — reviews are exclusively sourced from verified work bookings.
export const testimonials: TestimonialItem[] = [];

export const bookingTimeSlots = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
];

export const faqs = [
  {
    question: 'Do you provide emergency plumbing service?',
    answer:
      'Yes, we offer emergency plumbing visits subject to availability. Call us and we will do our best to respond as quickly as possible, typically the same day across our active service areas.',
  },
  {
    question: 'What are your working hours?',
    answer:
      'Our working hours are 10:00 AM to 3:00 PM, Monday to Saturday. We are closed on Sundays. For urgent situations, call us and we will try to accommodate you.',
  },
  {
    question: 'What areas do you cover?',
    answer:
      'Operating from our base workshop at Vill : - Bahardaltitia, PO : - Keshrambha, PS : - Dantan, Dist : - West Medinipur, State : - West Bengal, Pin Code : - 721451, we serve all verified localities listed in our live Service Areas directory. Call us directly to confirm immediate dispatch to your location.',
  },
  {
    question: 'How much do your services cost?',
    answer:
      'Our prices start from Rs 199 for maintenance visits and vary based on the service. You can see the starting price for each service on our services page. We will give you a final quote after inspecting the work.',
  },
  {
    question: 'Do you offer annual maintenance contracts?',
    answer:
      'Yes, we offer annual maintenance contracts for both homes and commercial properties. This includes scheduled inspections, preventive repairs, and priority booking for service calls.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept cash, UPI (Google Pay, PhonePe, Paytm), and bank transfers. Payment is due after the work is completed to your satisfaction.',
  },
  {
    question: 'Do you provide a warranty on your work?',
    answer:
      'Yes, we provide a service warranty on installations and repairs. The warranty period depends on the type of work — typically 30 to 90 days for repairs and up to 1 year for new installations.',
  },
];
