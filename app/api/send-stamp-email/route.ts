import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { stampNumber, challanNumber, email } = body;

    // Validate input
    if (!stampNumber || !challanNumber || !email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stamp Number, Challan Number and Email Address are required.",
        },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
        },
        { status: 400 }
      );
    }

    // Check SMTP configuration
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.SMTP_FROM
    ) {
      console.error("SMTP environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "SMTP configuration is missing on the server.",
        },
        { status: 500 }
      );
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    // Send plain-text email
    const info = await transporter.sendMail({
      from: `"estamp" <${process.env.SMTP_FROM}>`,
      to: email,

      subject: `Stamp Number ${stampNumber} - Challan ${challanNumber}`,

      text: `Your Stamp number is ${stampNumber} against Challan Number ${challanNumber}`,
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown SMTP error",
      },
      { status: 500 }
    );
  }
}
