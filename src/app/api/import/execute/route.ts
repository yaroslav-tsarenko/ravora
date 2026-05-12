import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils/slugify";
import { importRowSchema } from "@/lib/validators/import-row";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { rows, mode } = await request.json();

    const job = await prisma.importJob.create({
      data: {
        fileName: "import",
        userId: user.id,
        totalRows: rows.length,
        status: "PROCESSING",
      },
    });

    let processed = 0;
    let errors = 0;
    const errorLog: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const validated = importRowSchema.parse(rows[i]);

        if (mode === "price") {
          await prisma.product.update({
            where: { sku: validated.sku },
            data: {
              price: validated.price,
              comparePrice: validated.comparePrice,
            },
          });
        } else if (mode === "stock") {
          await prisma.product.update({
            where: { sku: validated.sku },
            data: { quantity: validated.quantity },
          });
        } else {
          await prisma.product.upsert({
            where: { sku: validated.sku },
            update: {
              name: validated.name,
              price: validated.price,
              comparePrice: validated.comparePrice,
              quantity: validated.quantity,
              description: validated.description,
              shortDescription: validated.shortDescription,
              brand: validated.brand,
              status: validated.status,
              gtin: validated.gtin,
              mpn: validated.mpn,
              googleCategory: validated.googleCategory,
              condition: validated.condition,
            },
            create: {
              name: validated.name,
              slug: slugify(validated.name),
              sku: validated.sku,
              price: validated.price,
              comparePrice: validated.comparePrice,
              quantity: validated.quantity,
              description: validated.description,
              shortDescription: validated.shortDescription,
              brand: validated.brand,
              status: validated.status || "DRAFT",
              gtin: validated.gtin,
              mpn: validated.mpn,
              googleCategory: validated.googleCategory,
              condition: validated.condition || "new",
            },
          });
        }
        processed++;
      } catch (err) {
        errors++;
        errorLog.push({
          row: i + 1,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    await prisma.importJob.update({
      where: { id: job.id },
      data: {
        status: "COMPLETED",
        processed,
        errors,
        errorLog: errorLog.length > 0 ? errorLog : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      processed,
      errors,
      errorLog,
    });
  } catch (error) {
    console.error("Error executing import:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
