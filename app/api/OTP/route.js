import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL =
  "https://es.punjab-zameen.gov.pk/eStampCitizenPortal";

const headers = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Origin: "https://es.punjab-zameen.gov.pk",
  Referer:
    "https://es.punjab-zameen.gov.pk/eStampCitizenPortal/Stamp/StampRetrieval?name=stampretrieval&vCount=990",
};

export async function POST(request) {
  try {
    const {
      cnic,
      contact,
      isHighValue = false,
    } = await request.json();

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required.",
        },
        { status: 400 }
      );
    }

    // Clean values
    let cleanContact = contact
      .trim()
      .replace(/\s/g, "");

    let cleanCnic = cnic
      ? cnic.trim().replace(/\s/g, "")
      : "";

    // 03069091325 → 0306-9091325
    if (/^\d{11}$/.test(cleanContact)) {
      cleanContact =
        cleanContact.slice(0, 4) +
        "-" +
        cleanContact.slice(4);
    }

    // 3840113292453 → 38401-1329245-3
    if (/^\d{13}$/.test(cleanCnic)) {
      cleanCnic =
        cleanCnic.slice(0, 5) +
        "-" +
        cleanCnic.slice(5, 12) +
        "-" +
        cleanCnic.slice(12);
    }

    // ------------------------------------------------
    // Build OTP URL exactly like their JavaScript
    // ------------------------------------------------

    const params = new URLSearchParams();

    params.set("contact", cleanContact);

    if (isHighValue === true) {
      params.set("isHighValue", "true");

      if (cleanCnic) {
        params.set("cnic", cleanCnic);
      }
    }

    const otpUrl =
      `${BASE_URL}/api/Proxy/ChallanForm/GenerateOTP?${params.toString()}`;

    console.log("OTP URL:", otpUrl);

    // ------------------------------------------------
    // POST GenerateOTP
    // ------------------------------------------------

    const otpResponse = await axios.post(
      otpUrl,
      {},
      {
        headers,
        timeout: 30000,
      }
    );

    console.log(
      "OTP response:",
      JSON.stringify(otpResponse.data, null, 2)
    );

    // ------------------------------------------------
    // Return response to frontend
    // ------------------------------------------------

    return NextResponse.json({
      success: true,
      message: "OTP request completed.",
      data: otpResponse.data,
    });

  } catch (error) {
    console.error(
      "GenerateOTP error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "OTP request failed.",
      },
      {
        status: error.response?.status || 500,
      }
    );
  }
}



