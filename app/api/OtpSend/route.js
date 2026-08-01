import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL =
  "https://es.punjab-zameen.gov.pk/eStampCitizenPortal";

const headers = {
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Origin: "https://es.punjab-zameen.gov.pk",
  Referer:
    "https://es.punjab-zameen.gov.pk/eStampCitizenPortal/Stamp/StampRetrieval?name=stampretrieval&vCount=990",
};





export async function POST(request) {
  try {
    const { cnic, contact } = await request.json();

    // Verify CNIC + Mobile
    const verifyResponse = await axios.post(
      `${BASE_URL}/api/Proxy/ChallanForm/VerifyCNICandContactForStampRetrieval`,
      {
        CNIC: cnic,
        Contact: contact,
      },
      { headers }
    );

    const verifyData = verifyResponse.data;

    if (
      verifyData.message !== "Yes" ||
      verifyData.responseCode !== "01"
    ) {
      return NextResponse.json(verifyData);
    }

    // Send OTP
    const otpResponse = await axios.post(
      `${BASE_URL}/api/Proxy/ChallanForm/GenerateOTP?contact=${encodeURIComponent(
        contact
      )}`,
      {},
      { headers }
    );

    return NextResponse.json({
      success: true,
      verification: verifyData,
      otp: otpResponse.data,
    });

  } catch (err) {
    console.log(err.response?.data || err.message);

    return NextResponse.json(
      {
        success: false,
        message: err.response?.data || err.message,
      },
      { status: 500 }
    );
  }
}
