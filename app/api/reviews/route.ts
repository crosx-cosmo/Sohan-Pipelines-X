import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { VerifiedWorkReview } from '@/lib/reviews-service';

const DATA_DIR = path.join(process.cwd(), '.data');
const REVIEWS_FILE = path.join(DATA_DIR, 'verified-reviews.json');

// Filter out any legacy pre-seeded dummy review IDs so only genuine customer submissions remain
const LEGACY_DUMMY_REVIEW_HEADLINES = new Set([
  'heavy-duty overhead tank & pressure pump manifold installation',
]);

function isLegacyDummyReview(r: VerifiedWorkReview): boolean {
  if (!r) return true;
  if (
    r.bookingId?.toUpperCase() === 'SP-20261014-054E7D' &&
    r.customerName?.trim().toLowerCase() === 'subhajit jana' &&
    LEGACY_DUMMY_REVIEW_HEADLINES.has((r.headline || '').trim().toLowerCase())
  ) {
    return true;
  }
  return false;
}

async function readStoredReviews(): Promise<VerifiedWorkReview[]> {
  try {
    const raw = await fs.readFile(REVIEWS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const cleaned = parsed.filter((r) => !isLegacyDummyReview(r));
    if (cleaned.length !== parsed.length) {
      await writeStoredReviews(cleaned);
    }
    return cleaned;
  } catch {
    return [];
  }
}

async function writeStoredReviews(reviews: VerifiedWorkReview[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
}

export async function GET() {
  const reviews = await readStoredReviews();
  const sorted = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json({ reviews: sorted });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const incoming = body?.review as VerifiedWorkReview | undefined;

    if (
      !incoming ||
      !incoming.bookingId ||
      !incoming.customerName ||
      !incoming.comment
    ) {
      return NextResponse.json(
        { error: 'Booking ID, customer name, and review comment are required.' },
        { status: 400 }
      );
    }

    const normalizedBookingId = incoming.bookingId.trim().toUpperCase();
    const existing = await readStoredReviews();
    const nowIso = new Date().toISOString();

    const existingIdx = existing.findIndex(
      (r) => r.bookingId.trim().toUpperCase() === normalizedBookingId
    );

    const savedReview: VerifiedWorkReview = {
      ...incoming,
      id:
        existingIdx >= 0
          ? existing[existingIdx].id
          : incoming.id ||
            `rev-${normalizedBookingId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      bookingId: normalizedBookingId,
      verifiedWorkOrder: true,
      helpfulCount:
        existingIdx >= 0
          ? existing[existingIdx].helpfulCount || 0
          : incoming.helpfulCount || 0,
      createdAt:
        existingIdx >= 0
          ? existing[existingIdx].createdAt
          : incoming.createdAt || nowIso,
      updatedAt: nowIso,
    };

    if (existingIdx >= 0) {
      existing[existingIdx] = savedReview;
    } else {
      existing.unshift(savedReview);
    }

    await writeStoredReviews(existing);

    return NextResponse.json({
      review: savedReview,
      reviews: existing,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : 'Unable to save verified review.',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const targetId = String(body?.id || '').trim();
    if (!targetId) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const existing = await readStoredReviews();
    const idx = existing.findIndex(
      (r) =>
        r.id === targetId ||
        r.bookingId.toUpperCase() === targetId.toUpperCase()
    );

    if (idx < 0) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    existing[idx] = {
      ...existing[idx],
      helpfulCount: (existing[idx].helpfulCount || 0) + 1,
    };

    await writeStoredReviews(existing);
    return NextResponse.json({ review: existing[idx] });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update helpful count' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id')?.trim();
    let targetId = idParam || '';

    if (!targetId) {
      try {
        const body = await req.json();
        targetId = String(body?.id || '').trim();
      } catch {
        // No body provided
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const existing = await readStoredReviews();
    const filtered = existing.filter(
      (r) =>
        r.id !== targetId &&
        r.bookingId.toUpperCase() !== targetId.toUpperCase()
    );

    await writeStoredReviews(filtered);
    return NextResponse.json({ reviews: filtered, deletedId: targetId });
  } catch {
    return NextResponse.json(
      { error: 'Unable to remove review' },
      { status: 500 }
    );
  }
}
