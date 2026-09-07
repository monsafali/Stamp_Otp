
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      email,
      challanNumber,
      cnic,
    } = body;

    // -----------------------------
    // Validate input
    // -----------------------------
    if (!email || !challanNumber || !cnic) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email, Challan Number and CNIC are required.",
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
    // Validate CNIC
    // -----------------------------
    const cleanCNIC = cnic.replace(/-/g, "");

    if (!/^\d{13}$/.test(cleanCNIC)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "CNIC must contain exactly 13 digits.",
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
          message:
            "SMTP configuration is missing on the server.",
        },
        { status: 500 }
      );
    }

    // -----------------------------
    // Generate OTP
    // -----------------------------
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // -----------------------------
    // Format CNIC
    // -----------------------------
    const formattedCNIC =
      `${cleanCNIC.slice(0, 5)}-` +
      `${cleanCNIC.slice(5, 12)}-` +
      `${cleanCNIC.slice(12)}`;

    // -----------------------------
    // SMTP transporter
    // -----------------------------
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),

      secure:
        Number(process.env.SMTP_PORT) === 465,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    // -----------------------------
    // Send email
    // -----------------------------
    const info = await transporter.sendMail({
      from: `"estamp" <${process.env.SMTP_FROM}>`,
      to: email,

      subject: `OTP for Challan ${challanNumber}`,

      text: `
Dear customer,

Please use the OTP (${otp}) sent for challan 32-A  verification on CNIC (${formattedCNIC}).

Please use this code to complete your verification.
      `.trim(),

      html: `
        <div

        >
Dear customer, please use the OTP (${otp}) sent for challan 32-A verification on CNIC  (${formattedCNIC}).

        </div>
      `,
    });

    console.log(
      "Challan OTP email sent:",
      info.messageId
    );

    // Do NOT return OTP to frontend
    return NextResponse.json({
      success: true,
      message:
        "Challan verification OTP sent successfully.",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error(
      "Challan OTP email error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send challan OTP email.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown SMTP error",
      },
      { status: 500 }
    );
  }
}

