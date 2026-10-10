'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  Search,
  Loader2,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { businessInfo } from '@/lib/business-info';
import {
  bookingStatusLabel,
  bookingStatusStyle,
  bookingStatusDescriptions,
  isBookingStatus,
  urgencyLabel,
} from '@/lib/booking-status';
import { findBooking, type BookingLookupResult } from '@/lib/booking-service';

export function FindBookingSection() {
  const [bookingId, setBookingId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [result, setResult] = React.useState<BookingLookupResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim() || !phone.trim()) {
      toast.error('Please enter both your Booking ID and phone number.');
      return;
    }

    setLoading(true);
    setSearched(false);
    try {
      const found = await findBooking(bookingId, phone);
      setResult(found);
      setSearched(true);
      if (!found) {
        toast.error("We couldn't find a booking matching those details.");
      } else {
        toast.success(`Booking ${found.bookingId} Loaded`, {
          description: `Current status: ${bookingStatusLabel(found.status)}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Something went wrong while looking up your booking.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <Card className="border-border/60">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bookingId">Booking ID *</Label>
                  <Input
                    id="bookingId"
                    placeholder="e.g. SP-20260922-A7K9Q2"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    autoCapitalize="characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lookupPhone">Phone Number *</Label>
                  <Input
                    id="lookupPhone"
                    type="tel"
                    placeholder="The number you booked with"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find My Booking
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {searched && !result && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="border-destructive/30">
                <CardContent className="pt-6 pb-6 text-center space-y-2">
                  <XCircle className="h-8 w-8 text-destructive mx-auto" />
                  <h3 className="font-display font-semibold">Booking not found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    We couldn&apos;t find a booking matching that Booking ID and phone number. Please
                    double-check both and try again, or{' '}
                    <a href={`tel:${businessInfo.phone}`} className="text-primary underline underline-offset-2">
                      call us
                    </a>{' '}
                    for help.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {result && (
            <motion.div
              key={result.bookingId}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="border-border/80 shadow-crisp-sm render-crisp">
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b">
                <div>
                  <p className="text-xs text-muted-foreground">Booking ID</p>
                  <p className="font-display font-bold text-lg text-primary">{result.bookingId}</p>
                </div>
                <Badge className={cn('border', bookingStatusStyle(result.status))}>
                  {bookingStatusLabel(result.status)}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {isBookingStatus(result.status)
                  ? bookingStatusDescriptions[result.status]
                  : 'Status updates will appear here as your booking progresses.'}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                  <Wrench className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-semibold text-sm">{result.serviceName}</p>
                  </div>
                </div>
                {result.urgency && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Urgency</p>
                      <p className="font-semibold text-sm">{urgencyLabel(result.urgency)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-semibold text-sm">{result.customerName}</p>
                  </div>
                </div>
                {result.address && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Service Address</p>
                      <p className="font-semibold text-sm">{result.address}</p>
                      {result.area && <p className="text-xs text-muted-foreground">{result.area}</p>}
                    </div>
                  </div>
                )}
                {result.preferredDate && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Preferred Date</p>
                      <p className="font-semibold text-sm">
                        {new Date(result.preferredDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {result.preferredTimeSlot && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Preferred Time</p>
                      <p className="font-semibold text-sm">{result.preferredTimeSlot}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-display font-semibold text-sm mb-4">Status Timeline</h4>
                {result.statusHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No status updates yet.</p>
                ) : (
                  <ol className="space-y-4">
                    {result.statusHistory.map((entry, i) => (
                      <li key={`${entry.status}-${entry.createdAt}-${i}`} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold shrink-0',
                              bookingStatusStyle(entry.status)
                            )}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                          {i < result.statusHistory.length - 1 && (
                            <span className="w-px flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-sm">{bookingStatusLabel(entry.status)}</p>
                          {entry.note && (
                            <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(entry.createdAt).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <p className="text-xs text-muted-foreground pt-2 border-t">
                Booked on{' '}
                {new Date(result.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </CardContent>
          </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
