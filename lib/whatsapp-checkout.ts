import { businessInfo } from '@/lib/business-info';
import type { CartItem } from '@/lib/cart-context';

export interface CustomerEnquiryInfo {
  customerName?: string;
  deliveryArea?: string;
  additionalNotes?: string;
}

/**
 * Builds a professional, structured WhatsApp checkout message containing all
 * selected cart products, SKU codes, quantities, database prices, and subtotal.
 */
export function buildCartWhatsAppMessage(
  items: CartItem[],
  customerInfo?: CustomerEnquiryInfo
): string {
  if (!items || items.length === 0) {
    return 'Hello Sohan Pipeline\'s, I would like to inquire about plumbing spare parts availability.';
  }

  const lines: string[] = [];

  lines.push('🛠️ *SOHAN PIPELINES & HARDWARE — PARTS ENQUIRY*');
  lines.push('Hello Sohan Pipeline\'s, I would like to check availability and purchase the following plumbing items:');
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let totalCalculableSubtotal = 0;
  let hasUnpriced = false;
  let totalUnits = 0;

  items.forEach((item, index) => {
    const itemNumber = index + 1;
    totalUnits += item.quantity;

    lines.push(`*${itemNumber}. ${item.name}*`);

    if (item.sku) {
      lines.push(`   • SKU: \`${item.sku}\``);
    }

    if (item.category) {
      lines.push(`   • Category: ${item.category}`);
    }

    lines.push(`   • Quantity: *${item.quantity}*`);

    if (item.selling_price && item.selling_price > 0) {
      const lineTotal = item.selling_price * item.quantity;
      totalCalculableSubtotal += lineTotal;
      lines.push(`   • Verified Price: ₹${item.selling_price} each`);
      lines.push(`   • Item Subtotal: *₹${lineTotal.toLocaleString('en-IN')}*`);
    } else {
      hasUnpriced = true;
      lines.push('   • Price: Price on warehouse confirmation');
    }

    lines.push('');
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`📦 *Total Items:* ${items.length} items (${totalUnits} total units)`);

  if (totalCalculableSubtotal > 0) {
    lines.push(
      `💰 *Estimated Subtotal:* *₹${totalCalculableSubtotal.toLocaleString('en-IN')}*${
        hasUnpriced ? ' (+ unpriced items)' : ''
      }`
    );
  }

  // Customer metadata if provided
  if (customerInfo?.customerName || customerInfo?.deliveryArea || customerInfo?.additionalNotes) {
    lines.push('');
    lines.push('👤 *Customer Details:*');
    if (customerInfo.customerName) {
      lines.push(`   • Name: ${customerInfo.customerName.trim()}`);
    }
    if (customerInfo.deliveryArea) {
      lines.push(`   • Locality / Site: ${customerInfo.deliveryArea.trim()}`);
    }
    if (customerInfo.additionalNotes) {
      lines.push(`   • Note: ${customerInfo.additionalNotes.trim()}`);
    }
  }

  lines.push('');
  lines.push('📋 *Order Request:*');
  lines.push('Please confirm current warehouse stock availability, final pricing, and dispatch / counter pickup timeline.');
  lines.push('');
  lines.push('Thank you!');

  return lines.join('\n');
}

/**
 * Returns the direct WhatsApp URL with prefilled checkout message.
 */
export function getCartWhatsAppUrl(
  items: CartItem[],
  customerInfo?: CustomerEnquiryInfo
): string {
  // Extract digits for international wa.me link: +918670143003 -> 918670143003
  const rawPhone = businessInfo.phone.replace(/[^0-9]/g, '');
  const message = buildCartWhatsAppMessage(items, customerInfo);
  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
}
