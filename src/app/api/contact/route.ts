import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators/contact";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: process.env.RESEND_FROM_EMAIL,
        subject: `Contact Form: ${validated.subject}`,
        text: `Name: ${validated.name}\nEmail: ${validated.email}\n\n${validated.message}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending contact form:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
