import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

function getFrom(): string {
  return process.env.RESEND_FROM_EMAIL || "noreply@example.com";
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

const BRAND_COLOR = "#E53935";
const BG_COLOR = "#f7f7f7";

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG_COLOR};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:24px;font-weight:900;color:${BRAND_COLOR};letter-spacing:-0.03em;">AvontShop</span>
    </div>
    <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e5e5e5;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:24px;font-size:12px;color:#999;">
      <p>&copy; ${new Date().getFullYear()} AvontShop. All rights reserved.</p>
      <p>Riga, Latvia | <a href="${getSiteUrl()}" style="color:${BRAND_COLOR};">avontshop.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  const r = getResend();
  if (!r) {
    console.log("[Email] Welcome email skipped (Resend not configured) →", email);
    return;
  }

  const greeting = name ? `Hi ${name}` : "Welcome";
  const siteUrl = getSiteUrl();

  await r.emails.send({
    from: getFrom(),
    to: email,
    subject: "Welcome to AvontShop!",
    html: emailWrapper(`
      <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#1A1A2E;">${greeting}, welcome to AvontShop!</h1>
      <p style="color:#555;line-height:1.6;margin:0 0 16px;">
        Your account has been created successfully. You now have access to thousands of electrical materials and supplies at competitive prices.
      </p>
      <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:0 0 24px;">
        <p style="margin:0 0 8px;font-weight:600;color:#1A1A2E;">What you can do now:</p>
        <ul style="margin:0;padding:0 0 0 20px;color:#555;line-height:1.8;">
          <li>Browse our full catalog of products</li>
          <li>Save items to your wishlist</li>
          <li>Track your orders in real time</li>
          <li>Get free shipping on orders over &euro;100</li>
        </ul>
      </div>
      <div style="text-align:center;">
        <a href="${siteUrl}/en/catalog" style="display:inline-block;padding:14px 32px;background:${BRAND_COLOR};color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
          Start Shopping
        </a>
      </div>
      <p style="color:#999;font-size:13px;margin:24px 0 0;text-align:center;">
        Standard 2-year EU warranty on all products
      </p>
    `),
  });
}

interface OrderItem {
  productName: string;
  productSku: string;
  quantity: number;
  price: number | { toNumber?: () => number };
  total: number | { toNumber?: () => number };
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number | { toNumber?: () => number };
  taxAmount: number | { toNumber?: () => number };
  shippingCost: number | { toNumber?: () => number };
  total: number | { toNumber?: () => number };
  shippingMethod: string;
}

function toNum(v: number | { toNumber?: () => number }): number {
  if (typeof v === "number") return v;
  if (v && typeof v.toNumber === "function") return v.toNumber();
  return Number(v);
}

function formatEur(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(amount);
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const r = getResend();
  if (!r) {
    console.log("[Email] Order confirmation skipped (Resend not configured) → Order", data.orderId);
    return;
  }

  const siteUrl = getSiteUrl();
  const shortId = data.orderId.slice(0, 8).toUpperCase();

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
          <div style="font-weight:600;font-size:14px;color:#1A1A2E;">${item.productName}</div>
          <div style="font-size:12px;color:#999;margin-top:2px;">SKU: ${item.productSku}</div>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;color:#555;font-size:14px;">
          ${item.quantity}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;font-size:14px;color:#1A1A2E;">
          ${formatEur(toNum(item.total))}
        </td>
      </tr>`
    )
    .join("");

  const shippingLabel =
    data.shippingMethod === "express"
      ? "Express (2-3 days)"
      : data.shippingMethod === "free"
        ? "Economy (7-14 days)"
        : "Standard (5-7 days)";

  await r.emails.send({
    from: getFrom(),
    to: data.customerEmail,
    subject: `Order Confirmed — #${shortId}`,
    html: emailWrapper(`
      <div style="text-align:center;margin-bottom:24px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#E8F5E9;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
          <span style="font-size:28px;">&#10003;</span>
        </div>
        <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#1A1A2E;">Order Confirmed!</h1>
        <p style="margin:0;color:#999;font-size:14px;">Order #${shortId}</p>
      </div>

      <p style="color:#555;line-height:1.6;margin:0 0 24px;">
        Hi ${data.customerName}, thank you for your order! We&apos;re preparing it for shipment.
      </p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="border-bottom:2px solid #e5e5e5;">
            <th style="text-align:left;padding:8px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Product</th>
            <th style="text-align:center;padding:8px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
            <th style="text-align:right;padding:8px 0;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#555;font-size:14px;">Subtotal</span>
          <span style="font-weight:500;font-size:14px;">${formatEur(toNum(data.subtotal))}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#555;font-size:14px;">Shipping (${shippingLabel})</span>
          <span style="font-weight:500;font-size:14px;${toNum(data.shippingCost) === 0 ? "color:#2E7D32;" : ""}">${toNum(data.shippingCost) === 0 ? "Free" : formatEur(toNum(data.shippingCost))}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="color:#555;font-size:14px;">Tax (21%)</span>
          <span style="font-weight:500;font-size:14px;">${formatEur(toNum(data.taxAmount))}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:2px solid #e5e5e5;margin-top:4px;">
          <span style="font-weight:800;font-size:16px;color:#1A1A2E;">Total</span>
          <span style="font-weight:800;font-size:16px;color:#1A1A2E;">${formatEur(toNum(data.total))}</span>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="${siteUrl}/en/account" style="display:inline-block;padding:14px 32px;background:${BRAND_COLOR};color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
          View Your Orders
        </a>
      </div>

      <p style="color:#999;font-size:13px;margin:24px 0 0;text-align:center;">
        You&apos;ll receive a shipping confirmation when your order is on its way.
      </p>
    `),
  });
}
