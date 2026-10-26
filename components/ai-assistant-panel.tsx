'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Sparkles,
  X,
  Minimize2,
  Send,
  Phone,
  MessageSquare,
  Wrench,
  Package,
  MapPin,
  Calendar,
  Search,
  RotateCcw,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { businessInfo } from '@/lib/business-info';
import { getRecentLocalBookings } from '@/lib/booking-service';
import type {
  AssistantActionLink,
  AssistantProductCard,
  AssistantServiceCard,
  AssistantBookingSummary,
} from '@/app/api/assistant/route';

export const SUGGESTED_PROMPTS = [
  'Which plumbing service do I need?',
  'Find spare parts and prices',
  'Is my location serviceable?',
  'How do I book a technician?',
  'Help me track my booking',
  'Talk to the SOHAN PIPELINES team',
] as const;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  actions?: AssistantActionLink[];
  followUpPrompts?: string[];
  matchedProducts?: AssistantProductCard[];
  matchedServices?: AssistantServiceCard[];
  bookingSummary?: AssistantBookingSummary | null;
  isError?: boolean;
}

interface AiAssistantPanelProps {
  onClose: () => void;
  onMinimize: () => void;
}

/** Lightweight safe formatter for bold text (**text**) and inline code (`code`) */
function renderInlineFormatted(text: string): React.ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((token, idx) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-muted font-mono text-[11px] text-primary border border-border/60"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

/** Structured block renderer for paragraphs, bullet lists, and numbered steps */
function FormattedAssistantText({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: Array<
    | { type: 'p'; text: string }
    | { type: 'ul'; items: string[] }
    | { type: 'ol'; items: string[] }
  > = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const bulletMatch = line.match(/^[-*•]\s+(.*)$/);
    const numberedMatch = line.match(/^\d+\.\s+(.*)$/);

    if (bulletMatch) {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === 'ul') {
        prev.items.push(bulletMatch[1]);
      } else {
        blocks.push({ type: 'ul', items: [bulletMatch[1]] });
      }
    } else if (numberedMatch) {
      const prev = blocks[blocks.length - 1];
      if (prev && prev.type === 'ol') {
        prev.items.push(numberedMatch[1]);
      } else {
        blocks.push({ type: 'ol', items: [numberedMatch[1]] });
      }
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }

  return (
    <div className="space-y-2 text-[13px] leading-relaxed text-foreground/90">
      {blocks.map((block, i) => {
        if (block.type === 'ul') {
          return (
            <ul key={i} className="space-y-1.5 pl-4 list-disc marker:text-primary">
              {block.items.map((item, j) => (
                <li key={j} className="leading-snug">
                  {renderInlineFormatted(item)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={i} className="space-y-1.5 pl-4 list-decimal marker:text-primary marker:font-semibold">
              {block.items.map((item, j) => (
                <li key={j} className="leading-snug">
                  {renderInlineFormatted(item)}
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  role: 'model',
  content: `Welcome to **SOHAN PIPELINES** (*Total Plumbing Solutions*). I am your AI Customer Assistant, connected to our live service catalog, genuine spare-parts inventory, and coverage directory across **Paschim & Purba Medinipur**.\n\nHow can I help you today?`,
  timestamp: 'Just now',
  actions: [
    {
      id: 'book-service',
      label: 'Book a Service',
      href: '/book',
      variant: 'primary',
    },
    {
      id: 'explore-services',
      label: 'Explore Services',
      href: '/services',
      variant: 'secondary',
    },
    {
      id: 'browse-spare-parts',
      label: 'Browse Spare Parts',
      href: '/spare-parts',
      variant: 'secondary',
    },
    {
      id: 'check-service-areas',
      label: 'Check Service Areas',
      href: '/service-areas',
      variant: 'secondary',
    },
  ],
};

export default function AiAssistantPanel({ onClose, onMinimize }: AiAssistantPanelProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showBookingHelper, setShowBookingHelper] = React.useState(false);
  const [helperBookingId, setHelperBookingId] = React.useState(() => {
    const recent = getRecentLocalBookings();
    return recent.length > 0 ? recent[0].bookingId || '' : '';
  });
  const [helperPhone, setHelperPhone] = React.useState(() => {
    const recent = getRecentLocalBookings();
    return recent.length > 0 ? recent[0].phone || '' : '';
  });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showBookingHelper, scrollToBottom]);

  const sendMessage = React.useCallback(
    async (textToSend: string) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoading) return;

      // If user clicks "Help me track my booking", also open the quick verification inputs
      if (trimmed.toLowerCase() === 'help me track my booking') {
        setShowBookingHelper(true);
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsLoading(true);

      try {
        // Prepare conversation history (excluding welcome message)
        const historyPayload = messages
          .filter((m) => m.id !== 'welcome-msg' && !m.isError)
          .slice(-8)
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        // Pass device-local bookings so verified lookup works for newly created bookings too
        const localBookings = getRecentLocalBookings()
          .slice(0, 5)
          .map((b) => ({
            bookingId: b.bookingId,
            phone: b.phone,
            serviceName: b.serviceName,
            status: b.status,
            urgency: b.urgency,
            preferredDate: b.preferredDate,
            preferredTimeSlot: b.preferredTimeSlot,
            area: b.area,
            createdAt: b.createdAt,
          }));

        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: historyPayload,
            localBookings,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || 'Unable to reach the assistant right now. Please try again.'
          );
        }

        const assistantMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.reply || 'How else can I help you with your plumbing needs today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: Array.isArray(data.actions) ? data.actions : undefined,
          followUpPrompts: Array.isArray(data.followUpPrompts) ? data.followUpPrompts : undefined,
          matchedProducts: Array.isArray(data.matchedProducts) ? data.matchedProducts : undefined,
          matchedServices: Array.isArray(data.matchedServices) ? data.matchedServices : undefined,
          bookingSummary: data.bookingSummary || null,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        if (data.bookingSummary) {
          setShowBookingHelper(false);
        }
      } catch (err) {
        const errorText =
          err instanceof Error
            ? err.message
            : 'Connection interrupted. You can retry or contact SOHAN PIPELINES directly via WhatsApp or Phone below.';

        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'model',
          content: errorText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          actions: [
            {
              id: 'whatsapp-fallback',
              label: 'Contact on WhatsApp',
              href: `https://wa.me/918670143003?text=${encodeURIComponent(
                `Hello Sohan Pipeline's & Plumbing, I need help with: ${trimmed}`
              )}`,
              variant: 'whatsapp',
              external: true,
            },
            {
              id: 'call-fallback',
              label: 'Call Our Team',
              href: `tel:${businessInfo.phone}`,
              variant: 'call',
            },
          ],
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleBookingHelperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bId = helperBookingId.trim().toUpperCase();
    const ph = helperPhone.trim();
    if (!bId || ph.replace(/\D/g, '').length < 10) return;
    sendMessage(`Track my booking ${bId} with registered phone number ${ph}`);
  };

  const handleResetChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setShowBookingHelper(false);
    setInputValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-label="SOHAN PIPELINES AI Customer Assistant"
      className={cn(
        'fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/98 dark:bg-card/95 backdrop-blur-xl shadow-2xl render-crisp',
        // Mobile: fits neatly above MobileQuickBar without covering bottom bar or header
        'bottom-20 right-3 left-3 h-[min(72vh,560px)] sm:left-auto sm:right-5 sm:bottom-22 sm:w-[400px] md:bottom-20 md:right-6 md:w-[420px] md:h-[min(76vh,620px)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-gradient-to-r from-primary/12 via-primary/5 to-transparent px-4 py-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
            <Sparkles className="h-4 w-4" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card"
              title="Connected to live business data"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-sm font-bold tracking-tight text-foreground truncate">
                SOHAN PIPELINES Assistant
              </h2>
            </div>
            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
              <span>Live Catalog · Spare Parts · Dispatch Support</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onMinimize}
            title="Minimize assistant"
            aria-label="Minimize assistant"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close assistant"
            aria-label="Close assistant"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col gap-2',
              msg.role === 'user' ? 'items-end' : 'items-start'
            )}
          >
            <div
              className={cn(
                'max-w-[90%] rounded-2xl px-3.5 py-2.5 shadow-2xs',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm text-[13px]'
                  : msg.isError
                  ? 'bg-destructive/10 border border-destructive/30 text-foreground rounded-bl-sm'
                  : 'bg-muted/65 dark:bg-muted/40 border border-border/60 text-foreground rounded-bl-sm'
              )}
            >
              {msg.role === 'user' ? (
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="space-y-2.5">
                  {msg.isError && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Assistant Notice</span>
                    </div>
                  )}
                  <FormattedAssistantText content={msg.content} />
                </div>
              )}
            </div>

            {/* Matched Plumbing Services Cards */}
            {msg.matchedServices && msg.matchedServices.length > 0 && (
              <div className="w-full max-w-[94%] grid gap-2">
                {msg.matchedServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between gap-2.5 rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-3.5 w-3.5 text-primary shrink-0" />
                        <p className="text-xs font-semibold text-foreground truncate">
                          {svc.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Starting from{' '}
                        <strong className="text-foreground">₹{svc.startingPrice}</strong> ·{' '}
                        {svc.duration}
                      </p>
                    </div>
                    <Link
                      href={`/book?service=${encodeURIComponent(svc.slug)}`}
                      onClick={onMinimize}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
                    >
                      <span>Book</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Matched Spare Parts Cards (Real DB Image, Price, SKU, Stock) */}
            {msg.matchedProducts && msg.matchedProducts.length > 0 && (
              <div className="w-full max-w-[94%] grid gap-2">
                {msg.matchedProducts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card p-2 shadow-2xs"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-lg border border-border/50 bg-muted/40 flex items-center justify-center overflow-hidden p-1">
                      {part.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={part.imageUrl}
                          alt={part.name}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {part.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          ₹{part.sellingPrice.toLocaleString('en-IN')}
                        </span>
                        {part.sku && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            SKU: {part.sku}
                          </span>
                        )}
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                            part.inStock
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-destructive/10 text-destructive'
                          )}
                        >
                          {part.inStock ? `In Stock (${part.stock})` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/spare-parts"
                      onClick={onMinimize}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-border/80 bg-muted/50 hover:bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-foreground transition-colors"
                    >
                      <span>View</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Verified Booking Status Card */}
            {msg.bookingSummary && (
              <div className="w-full max-w-[94%] rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-mono text-xs font-bold text-primary">
                      {msg.bookingSummary.bookingId}
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {msg.bookingSummary.statusLabel}
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {msg.bookingSummary.serviceName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {msg.bookingSummary.statusDescription}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <Link
                    href={`/find-booking?id=${encodeURIComponent(msg.bookingSummary.bookingId)}`}
                    onClick={onMinimize}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <span>Open Full Timeline</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Actionable Links / Buttons inside Chat */}
            {msg.role === 'model' && msg.actions && msg.actions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-w-[94%] pt-0.5">
                {msg.actions.map((act) => {
                  const baseClasses =
                    'inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.98]';
                  const variantClasses =
                    act.variant === 'primary'
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs'
                      : act.variant === 'whatsapp'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                      : act.variant === 'call'
                      ? 'bg-card border border-primary/30 text-primary hover:bg-primary/10'
                      : 'bg-card border border-border/80 text-foreground hover:bg-muted/70';

                  const icon =
                    act.variant === 'whatsapp' ? (
                      <MessageSquare className="h-3 w-3 shrink-0" />
                    ) : act.variant === 'call' ? (
                      <Phone className="h-3 w-3 shrink-0" />
                    ) : act.href.includes('spare-parts') ? (
                      <Package className="h-3 w-3 shrink-0" />
                    ) : act.href.includes('service-areas') ? (
                      <MapPin className="h-3 w-3 shrink-0" />
                    ) : act.href.includes('find-booking') ? (
                      <Search className="h-3 w-3 shrink-0" />
                    ) : act.href.includes('book') ? (
                      <Calendar className="h-3 w-3 shrink-0" />
                    ) : (
                      <Wrench className="h-3 w-3 shrink-0" />
                    );

                  if (act.external || act.href.startsWith('tel:') || act.href.startsWith('http')) {
                    return (
                      <a
                        key={act.id}
                        href={act.href}
                        target={act.external ? '_blank' : undefined}
                        rel={act.external ? 'noopener noreferrer' : undefined}
                        className={cn(baseClasses, variantClasses)}
                      >
                        {icon}
                        <span>{act.label}</span>
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={act.id}
                      href={act.href}
                      onClick={onMinimize}
                      className={cn(baseClasses, variantClasses)}
                    >
                      {icon}
                      <span>{act.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Follow-up prompt chips on the latest assistant message */}
            {msg.role === 'model' &&
              msg.id !== 'welcome-msg' &&
              msg.followUpPrompts &&
              msg.followUpPrompts.length > 0 &&
              msg.id === messages[messages.length - 1]?.id &&
              !isLoading && (
                <div className="flex flex-wrap gap-1.5 max-w-[94%] pt-1">
                  {msg.followUpPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="text-left text-[11px] font-medium px-2.5 py-1 rounded-lg border border-border/70 bg-muted/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-muted-foreground transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}

        {/* Initial 6 Suggested Prompts when at start of conversation */}
        {messages.length === 1 && !isLoading && (
          <div className="pt-1 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-0.5">
              Suggested Questions
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center justify-between gap-2 w-full text-left rounded-xl border border-border/70 bg-card/80 hover:bg-primary/8 hover:border-primary/35 px-3 py-2 text-xs font-medium text-foreground transition-colors group"
                >
                  <span>“{prompt}”</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inline Verified Booking Lookup Helper */}
        {showBookingHelper && (
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-primary" />
                <span>Verify &amp; Track Booking</span>
              </p>
              <button
                type="button"
                onClick={() => setShowBookingHelper(false)}
                className="text-[11px] text-muted-foreground hover:text-foreground"
              >
                Hide
              </button>
            </div>
            <form onSubmit={handleBookingHelperSubmit} className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Booking ID (e.g. SOP-123456)"
                  value={helperBookingId}
                  onChange={(e) => setHelperBookingId(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <input
                  type="tel"
                  placeholder="10-digit Phone"
                  value={helperPhone}
                  onChange={(e) => setHelperPhone(e.target.value)}
                  className="h-8 rounded-lg border border-border bg-card px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-8 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Check Verified Status
              </button>
            </form>
          </div>
        )}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-muted/60 px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                <span className="ml-1.5 text-[11px] font-medium text-muted-foreground">
                  Checking SOHAN PIPELINES records...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form
        onSubmit={handleFormSubmit}
        className="border-t border-border/70 bg-card/95 p-2.5 shrink-0"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about services, spare parts, areas, or booking..."
            maxLength={500}
            disabled={isLoading}
            className="flex-1 h-10 rounded-xl border border-border/80 bg-muted/40 px-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-card transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-45 transition-all active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
          <span>Grounded in live SOHAN PIPELINES data</span>
          <button
            type="button"
            onClick={() => setShowBookingHelper((prev) => !prev)}
            className="font-medium text-primary hover:underline"
          >
            {showBookingHelper ? 'Close tracker' : 'Track booking ID'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
