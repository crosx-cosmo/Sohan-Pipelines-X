'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select';
import { businessInfo } from '@/lib/business-info';

export function ContactSection() {
  const [form, setForm] = React.useState({
    name: '',
    phone: '',
    service: 'Pipe Fitting & Repair',
    message: '',
  });
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your full name and phone number.');
      return;
    }
    if (form.phone.trim().length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success('Priority Inquiry Dispatched!', {
        description: `Thank you, ${form.name.trim()}. Sohan Ji will call ${form.phone.trim()} shortly.`,
      });
      setForm({ name: '', phone: '', service: 'Pipe Fitting & Repair', message: '' });
    }, 600);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} Copied to Clipboard`, {
        description: text,
      });
    } catch {
      toast.info(`${label}: ${text}`);
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Communication Channels (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.065em] text-primary">
              <span>Direct Communication</span>
              <span aria-hidden="true">·</span>
              <span className="text-muted-foreground font-medium">Available Mon–Sat</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
              Need a Plumber? We Are On Call.
            </h2>

            <p className="text-muted-foreground text-base leading-relaxed text-pretty font-normal tracking-[0.002em]">
              Whether you are dealing with a burst pipe emergency or planning scheduled
              bathroom fittings, our master technicians respond promptly.
            </p>

            <div className="space-y-3.5 pt-2">
              {/* Phone card */}
              <div className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition-[border-color,box-shadow,background-color] duration-200 hover:border-primary/40 hover:shadow-md">
                <a
                  href={`tel:${businessInfo.phone}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Emergency Line</p>
                    <p className="font-display font-bold text-base sm:text-lg tabular-nums font-mono text-foreground truncate">
                      {businessInfo.phoneDisplay}
                    </p>
                  </div>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(businessInfo.phone, 'Phone Number')}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy phone"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Email card */}
              <div className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card p-4 sm:p-5 transition-[border-color,box-shadow,background-color] duration-200 hover:border-primary/40 hover:shadow-md">
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-105">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground font-medium">Email Dispatch</p>
                    <p className="font-display font-bold text-sm sm:text-base text-foreground truncate">
                      {businessInfo.email}
                    </p>
                  </div>
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(businessInfo.email, 'Email Address')}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy email"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Office card */}
              <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Head Workshop</p>
                  <p className="font-display font-bold text-sm sm:text-base text-foreground">
                    {businessInfo.address}
                  </p>
                  <p className="text-xs text-muted-foreground">{businessInfo.area}</p>
                </div>
              </div>
            </div>

            {/* Operating Hours Block */}
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Operating Hours</span>
              </div>
              <p className="text-muted-foreground">
                Monday–Saturday: <strong className="text-foreground">{businessInfo.hours}</strong>
              </p>
              <p className="text-muted-foreground">
                Sunday: Emergency phone dispatches only
              </p>
            </div>
          </div>

          {/* Right Column: Direct Dispatch Inquiry Form (col-span-7) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl shadow-primary/5 space-y-6"
            >
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  Send a Rapid Dispatch Request
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Fill in your requirements below. Master plumber Sohan Ji will call back within 15–30 minutes.
                </p>
              </div>

              {sent && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>
                    Your inquiry has been logged! We will call you immediately. Or proceed to{' '}
                    <Link href="/book" className="underline font-bold">
                      online self-booking
                    </Link>.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-xs font-semibold">
                      Your Full Name *
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="e.g. Subrata Ghosh"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-11 text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-xs font-semibold">
                      Mobile Number *
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-11 text-xs sm:text-sm font-mono tabular-nums"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-service" className="text-xs font-semibold">
                    Service Required
                  </Label>
                  <CustomSelect
                    id="contact-service"
                    value={form.service}
                    onChange={(val) => setForm({ ...form, service: val })}
                    options={[
                      { value: 'Pipe Fitting & Repair', label: 'Pipe Fitting & Leak Repair', description: 'Precision joint fixing & pressure test' },
                      { value: 'Drainage & Sewer Jetting', label: 'Drainage & Blocked Drain Jetting', description: 'High-flow unblocking & cleanout' },
                      { value: 'Sanitary & Bathroom Fitting', label: 'Sanitary & Bathroom Fitting', description: 'Basin, shower, commode & tap work' },
                      { value: 'Water Tank & Motor Setup', label: 'Water Tank & Booster Motor Setup', description: 'Overhead tank & automatic pump system' },
                      { value: 'Concealed Leak Detection', label: 'Concealed Leak Detection & Pressure Test', description: 'Acoustic & moisture trace without breaking tiles' },
                      { value: 'Emergency Burst Pipe', label: 'Emergency Burst Pipe Repair', description: 'Priority immediate response team' },
                      { value: 'Other Plumbing Work', label: 'Other / General Plumbing Consultation', description: 'Custom site inspection or renovation' },
                    ]}
                    placeholder="Select service required"
                    icon={<Wrench className="h-4 w-4" />}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message" className="text-xs font-semibold">
                    Problem Details or Address Notes
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Briefly describe the plumbing issue, your locality in Medinipur, or preferred time..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="text-xs sm:text-sm"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto h-11 px-7 font-semibold text-xs whitespace-nowrap"
                  >
                    {sending ? (
                      'Dispatching...'
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </Button>

                  <Button asChild variant="outline" className="w-full sm:w-auto h-11 text-xs font-semibold">
                    <Link href="/book">
                      Switch to Step-by-Step Online Booking
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>No upfront fees. All work verified before invoice generation.</span>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
