/**
 * Central brand identity for ravora / JAYHALE LIMITED.
 * Import from here instead of hardcoding company details in components.
 */

export const brand = {
  name: "ravora",
  displayName: "Ravora",
  domain: "ravora.co.uk",
  url: "https://ravora.co.uk",
  tagline: "Refined athletic apparel.",
  description:
    "Ravora — a curated apparel edit from JAYHALE LIMITED. Sustainably sourced tees, hoodies, bottoms and swimwear for men, women and kids. Shipped from the United Kingdom.",
  applicationName: "Ravora",

  company: {
    legalName: "JAYHALE LIMITED",
    number: "16020956",
    address: {
      line1: "Academy House",
      line2: "11 Dunraven Place",
      city: "Bridgend",
      region: "Mid Glamorgan",
      postcode: "CF31 1JF",
      country: "United Kingdom",
    },
  },

  contact: {
    email: "info@ravora.co.uk",
    emailB2B: "b2b@ravora.co.uk",
    phone: "+44 7915 921997",
    phoneHref: "tel:+447915921997",
  },

  social: {
    twitter: "@ravora",
  },
} as const;

export const brandAddressLine = [
  brand.company.address.line1,
  brand.company.address.line2,
  brand.company.address.city,
  brand.company.address.region,
  brand.company.address.postcode,
  brand.company.address.country,
].join(", ");

export const brandLegalLine = `${brand.company.legalName} · Company No. ${brand.company.number} · ${brand.company.address.line1}, ${brand.company.address.line2}, ${brand.company.address.city}, ${brand.company.address.postcode}, ${brand.company.address.country}`;
