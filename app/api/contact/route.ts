import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, number, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const { error } = await resend.emails.send({
      from: "Ashbin Website <onboarding@resend.dev>",
      to: "ashbinwebsite@gmail.com",
      subject: `New enquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #222; padding: 24px; }
              .header { border-bottom: 2px solid #A8E4A0; padding-bottom: 12px; margin-bottom: 20px; }
              h1 { font-size: 18px; margin: 0; }
              .field { margin-bottom: 16px; }
              .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888; margin-bottom: 4px; }
              .value { font-size: 14px; color: #222; margin: 0; }
              .message-box { background: #f5faf5; border-radius: 8px; padding: 16px; margin-top: 4px; }
              .footer { border-top: 1px solid #eee; padding-top: 12px; margin-top: 24px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Contact Form Enquiry</h1>
            </div>

            <div class="field">
              <div class="label">Name</div>
              <p class="value">${escapeHtml(name)}</p>
            </div>

            <div class="field">
              <div class="label">Email</div>
              <p class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            </div>

            ${number ? `
            <div class="field">
              <div class="label">Phone Number</div>
              <p class="value">${escapeHtml(number)}</p>
            </div>
            ` : ""}

            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">
                <p class="value" style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
              </div>
            </div>

            <div class="footer">
              <p>Sent from ashbinweb.com contact form</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
