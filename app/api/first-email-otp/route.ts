
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, stampNumber } = body;

    // -----------------------------
    // Validate input
    // -----------------------------
    if (!email || !stampNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and Stamp Number are required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate email
    // -----------------------------
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

    // -----------------------------
    // Check SMTP configuration
    // -----------------------------
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

    // -----------------------------
    // Generate 6 digit OTP
    // -----------------------------
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // -----------------------------
    // SMTP transporter
    // -----------------------------
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),

      // 465 = SSL
      // 587 = STARTTLS
      secure: Number(process.env.SMTP_PORT) === 465,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    // -----------------------------
    // Email
    // -----------------------------
    const info = await transporter.sendMail({
      from: `"estamp" <${process.env.SMTP_FROM}>`,
      to: email,

      subject: "e-Stamping OTP Verification",

      text: `Your OTP code for verification on e-Stamping is ${otp}. Please use this code to complete your verification.`,

      html: `
        <div>

         Your OTP code for verification on e-Stamping is ${otp} Please use this code to complete your verification.

        </div>
      `,
    });

    console.log("Stamp OTP email sent:", info.messageId);

    // IMPORTANT:
    // Do NOT send OTP back to frontend in production.
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to the email address.",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Stamp OTP email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send OTP email.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown SMTP error",
      },
      { status: 500 }
    );
  }
}

