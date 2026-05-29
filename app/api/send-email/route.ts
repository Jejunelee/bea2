import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // You can change this after verifying your domain
      to: ["hello@typeharder.com"],
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Contact Form Submission</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                border-bottom: 2px solid #e9c08f;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .field {
                margin-bottom: 20px;
                background: #fefdf8;
                padding: 15px;
                border-radius: 8px;
                border-left: 3px solid #e9c08f;
              }
              .field-label {
                font-weight: 600;
                color: #000;
                margin-bottom: 8px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .field-value {
                color: #444;
                font-size: 16px;
                line-height: 1.5;
                white-space: pre-wrap;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 12px;
                color: #999;
                text-align: center;
              }
              .badge {
                display: inline-block;
                background: #e9c08f;
                color: #000;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                margin-bottom: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="badge">New Message</div>
              <h2 style="margin: 0; color: #000;">Contact Form Submission</h2>
            </div>
            
            <div class="field">
              <div class="field-label">Name</div>
              <div class="field-value">${name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">
                <a href="mailto:${email}" style="color: #e9c08f; text-decoration: none;">${email}</a>
              </div>
            </div>
            
            <div class="field">
              <div class="field-label">Message</div>
              <div class="field-value">${message.replace(/\n/g, "<br>")}</div>
            </div>
            
            <div class="footer">
              <p>This message was sent from your website's contact form.</p>
              <p>You can reply directly to ${email} to respond to this message.</p>
            </div>
          </body>
        </html>
      `,
      text: `
        New contact form submission from ${name}
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
        
        You can reply directly to ${email} to respond to this message.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}