import { NextResponse } from "next/server";

export async function GET() {
  const headers = [
    "name", "sku", "price", "comparePrice", "quantity", "description",
    "shortDescription", "category", "brand", "weight", "status",
    "imageUrl", "gtin", "mpn", "googleCategory", "condition",
  ];

  const sampleRow = [
    "Sample Product", "SKU-001", "29.99", "39.99", "100",
    "A great product description", "Short desc", "Electronics",
    "BrandName", "0.5", "ACTIVE", "", "", "", "", "new",
  ];

  const csv = [headers.join(","), sampleRow.join(",")].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=import-template.csv",
    },
  });
}
