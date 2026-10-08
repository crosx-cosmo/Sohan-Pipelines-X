'use client';

import * as React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Home,
  Loader2,
  PartyPopper,
  AlertTriangle,
  Timer,
  CalendarClock,
  Copy,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { services, type PlumbingService } from '@/lib/services';
import { bookingTimeSlots, businessInfo } from '@/lib/business-info';
import { cn } from '@/lib/utils';
import { URGENCY_LEVELS, urgencyLabel, type UrgencyLevel } from '@/lib/booking-status';
import { findOrCreateCustomer, createBooking } from '@/lib/booking-service';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';

type BookingStep = 'service' | 'urgency' | 'details' | 'location' | 'schedule' | 'confirm' | 'success';

interface BookingData {
  service: PlumbingService | null;
  urgency: UrgencyLevel | null;
  name: string;
  phone: string;
  address: string;
  area: string;
  notes: string;
  date: Date | undefined;
  timeSlot: string;
}

const initialData: BookingData = {
  service: null,
  urgency: null,
  name: '',
  phone: '',
  address: '',
  area: '',
  notes: '',
  date: undefined,
  timeSlot: '',
};

const urgencyIcons: Record<UrgencyLevel, typeof AlertTriangle> = {
  emergency: AlertTriangle,
  urgent: Timer,
  routine: CalendarClock,
};

export function BookingSection() {
  const [step, setStep] = React.useState<BookingStep>('service');
  const [data, setData] = React.useState<BookingData>(initialData);
  const [submitting, setSubmitting] = React.useState(false);
  const [bookingId, setBookingId] = React.useState('');

  const updateData = (patch: Partial<BookingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleServiceSelect = (service: PlumbingService) => {
    updateData({ service });
    setStep('urgency');
    toast.info(`Selected: ${service.name}`, {
      description: `Starting from ₹${service.startingPrice} · Next: choose urgency level`,
    });
  };

  const handleUrgencySelect = (urgency: UrgencyLevel) => {
    updateData({ urgency });
    setStep('details');
    toast.info(`Priority: ${urgencyLabel(urgency)}`, {
      description: 'Proceeding to your contact information',
    });
  };

  const handleDetailsNext = () => {
    if (!data.name.trim() || !data.phone.trim()) {
      toast.error('Please fill in your name and phone number.');
      return;
    }
    if (data.phone.trim().length < 10) {
      toast.error('Please enter a valid phone number.');
      return;
    }
    setStep('location');
  };

  const handleLocationNext = () => {
    if (!data.address.trim()) {
      toast.error('Please enter your address.');
      return;
    }
    setStep('schedule');
  };

  const handleScheduleNext = () => {
    setStep('confirm');
  };

  const handleSubmit = async () => {
    if (!data.service || !data.urgency) {
      toast.error('Something went wrong — please start over.');
      return;
    }

    setSubmitting(true);
    try {
      const customerId = await findOrCreateCustomer(data.name.trim(), data.phone.trim());

      const booking = await createBooking({
        customerId,
        serviceId: data.service.id,
        serviceName: data.service.name,
        urgency: data.urgency,
        preferredDate: data.date ? data.date.toISOString().slice(0, 10) : null,
        preferredTimeSlot: data.timeSlot || null,
        notes: data.notes.trim() || null,
        address: data.address.trim(),
        area: data.area || null,
      });

      setBookingId(booking.bookingId);
      setStep('success');
      toast.success('Booking confirmed! We will call you shortly.');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving your booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setData(initialData);
    setStep('service');
    setBookingId('');
  };

  const handleCopyBookingId = async () => {
    try {
      await navigator.clipboard.writeText(bookingId);
      toast.success('Booking ID copied to clipboard.');
    } catch {
      toast.error('Could not copy automatically — please copy it manually.');
    }
  };

  const stepOrder: BookingStep[] = ['service', 'urgency', 'details', 'location', 'schedule', 'confirm'];
  const currentStepIndex = stepOrder.indexOf(step);
  const progress = step === 'success' ? 100 : ((currentStepIndex + 1) / stepOrder.length) * 100;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {step !== 'success' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2 overflow-x-auto">
              {['Service', 'Urgency', 'Details', 'Location', 'Schedule', 'Confirm'].map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium transition-colors shrink-0',
                    i <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all',
                      i < currentStepIndex
                        ? 'bg-primary text-primary-foreground'
                        : i === currentStepIndex
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {i < currentStepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
              ))}
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Service Selection */}
        {step === 'service' && (
          <div className="animate-fade-in">
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service, i) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="group text-left rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary transition-transform group-hover:scale-110">
                      <service.icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display font-semibold text-sm leading-tight">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold tabular-nums font-mono">₹{service.startingPrice}</span>
                        <span className="text-xs text-muted-foreground">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Urgency */}
        {step === 'urgency' && (
          <Card className="animate-fade-in border-border/60">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">How urgent is this?</h3>
                  <p className="text-sm text-muted-foreground">
                    This helps us prioritize your visit correctly
                  </p>
                </div>
              </div>

              {data.service && (
                <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/15 p-3">
                  <data.service.icon className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{data.service.name}</p>
                    <p className="text-xs text-muted-foreground">Starting from ₹{data.service.startingPrice}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep('service')} className="text-xs">
                    Change
                  </Button>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                {URGENCY_LEVELS.map((level) => {
                  const Icon = urgencyIcons[level.id];
                  return (
                    <button
                      key={level.id}
                      onClick={() => handleUrgencySelect(level.id)}
                      className={cn(
                        'text-left rounded-2xl border p-4 transition-all hover:border-primary/40 hover:-translate-y-0.5',
                        data.urgency === level.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/60 bg-card'
                      )}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="font-display font-semibold text-sm">{level.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-start pt-2">
                <Button variant="outline" onClick={() => setStep('service')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Customer Details */}
        {step === 'details' && (
          <Card className="animate-fade-in border-border/60">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">Your Details</h3>
                  <p className="text-sm text-muted-foreground">Tell us who you are</p>
                </div>
              </div>

              {data.service && (
                <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/15 p-3">
                  <data.service.icon className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{data.service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {data.urgency ? urgencyLabel(data.urgency) : ''} · Starting from ₹{data.service.startingPrice}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep('urgency')}
                    className="text-xs"
                  >
                    Change
                  </Button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={data.name}
                    onChange={(e) => updateData({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={data.phone}
                    onChange={(e) => updateData({ phone: e.target.value })}
                    maxLength={13}
                  />
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll use this to verify you when you look up your booking later.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('urgency')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleDetailsNext}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Location */}
        {step === 'location' && (
          <Card className="animate-fade-in border-border/60">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">Service Location</h3>
                  <p className="text-sm text-muted-foreground">Where should we come?</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="House number, street, locality"
                  value={data.address}
                  onChange={(e) => updateData({ address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area / City</Label>
                <CustomSelect
                  id="area"
                  value={data.area}
                  onChange={(val) => updateData({ area: val })}
                  options={[
                    { value: '', label: 'Select your area' },
                    ...businessInfo.serviceAreas.map((area) => ({
                      value: area,
                      label: area,
                      description: 'Direct technician dispatch available',
                    })),
                    { value: 'other', label: 'Other (mention in notes)', description: 'Nearby village / township' },
                  ]}
                  placeholder="Select your area"
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe the problem or any specific requirements..."
                  value={data.notes}
                  onChange={(e) => updateData({ notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('details')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleLocationNext}>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Schedule */}
        {step === 'schedule' && (
          <Card className="animate-fade-in border-border/60">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Calendar className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">Pick Date & Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Optional — choose when you would like us to visit
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={data.date}
                  onSelect={(d: Date | undefined) => updateData({ date: d ?? undefined })}
                  disabled={(date: Date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                    date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  }
                  className="rounded-2xl border border-border/60 mx-auto"
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select Time Slot
                </Label>
                <RadioGroup
                  value={data.timeSlot}
                  onValueChange={(v) => updateData({ timeSlot: v })}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  {bookingTimeSlots.map((slot) => (
                    <Label
                      key={slot}
                      htmlFor={slot}
                      className={cn(
                        'flex items-center justify-center rounded-lg border p-3 text-xs font-medium text-center cursor-pointer transition-all hover:border-primary/40',
                        data.timeSlot === slot
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 bg-card'
                      )}
                    >
                      <RadioGroupItem value={slot} id={slot} className="sr-only" />
                      {slot}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('location')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleScheduleNext}>
                  Review Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Confirm */}
        {step === 'confirm' && (
          <Card className="animate-fade-in border-border/60">
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display font-semibold">Review & Confirm</h3>
                  <p className="text-sm text-muted-foreground">Please check your booking details</p>
                </div>
              </div>

              <div className="space-y-4">
                {data.service && (
                  <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                    <data.service.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="font-semibold">{data.service.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Starting from ₹{data.service.startingPrice} · {data.service.duration}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Urgency</p>
                      <p className="font-semibold text-sm">
                        {data.urgency ? urgencyLabel(data.urgency) : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-semibold text-sm">{data.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-semibold text-sm">{data.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-semibold text-sm">{data.address}</p>
                      {data.area && <p className="text-sm text-muted-foreground">{data.area}</p>}
                    </div>
                  </div>
                  {data.date && (
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                      <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="font-semibold text-sm">
                          {data.date?.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                  {data.timeSlot && (
                    <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time Slot</p>
                        <p className="font-semibold text-sm">{data.timeSlot}</p>
                      </div>
                    </div>
                  )}
                </div>

                {data.notes && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <Home className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm">{data.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Final price will be confirmed after inspection. You will receive a
                  confirmation call within 30 minutes.
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep('schedule')} disabled={submitting}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={submitting} size="lg">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {step === 'success' && (
          <Card className="animate-scale-in border-success/30">
            <CardContent className="pt-10 pb-10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success animate-scale-in">
                    <PartyPopper className="h-10 w-10" />
                  </div>
                  <div className="absolute inset-0 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-ping opacity-20" />
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold mb-2">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  Thank you, {data.name}! Your booking has been received.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl bg-muted/50 border px-6 py-3">
                <span className="text-sm text-muted-foreground">Booking ID:</span>
                <span className="font-display font-bold text-lg text-primary">{bookingId}</span>
                <button
                  onClick={handleCopyBookingId}
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  aria-label="Copy booking ID"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Save this ID — along with the phone number you provided — to check your booking
                status anytime on the{' '}
                <Link href="/find-booking" className="text-primary underline underline-offset-2">
                  Find My Booking
                </Link>{' '}
                page.
              </p>

              <div className="max-w-md mx-auto text-left space-y-2 rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-semibold">{data.service?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Urgency:</span>
                  <span className="font-semibold">{data.urgency ? urgencyLabel(data.urgency) : '—'}</span>
                </div>
                {data.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">
                      {data.date?.toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                )}
                {data.timeSlot && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{data.timeSlot}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-semibold">{data.phone}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Button asChild variant="outline">
                  <a href={`tel:${businessInfo.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call to Confirm
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/find-booking">
                    <Search className="mr-2 h-4 w-4" />
                    Find My Booking
                  </Link>
                </Button>
                <Button onClick={handleReset}>
                  Book Another Service
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
