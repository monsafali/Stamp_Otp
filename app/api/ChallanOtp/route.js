import axios from "axios";
import { NextResponse } from "next/server";

const BASE_URL =
  "https://es.punjab-zameen.gov.pk/eStampCitizenPortal";

const headers = {
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Origin: "https://es.punjab-zameen.gov.pk",
  Referer:
    "https://es.punjab-zameen.gov.pk/eStampCitizenPortal/",
};

export async function POST(request) {
  try {
    const {
      cnic,
      contact,
      email,
      party2Cnic,
      party2Contact,
    } = await request.json();

    const payload = [
      {
        cnic,
        contact,
        email,
        personType: "local",
        partyType: "Agent",
        deedId: 180,
      },
      {
        cnic,
        contact,
        email: null,
        personType: "Pakistani person",
        partyType: "Party1",
        deedId: 180,
      },
      {
        cnic: party2Cnic,
        contact: party2Contact,
        email,
        personType: "Pakistani person",
        partyType: "Party2",
        deedId: 180,
      },
    ];

    const response = await axios.post(
      `${BASE_URL}/api/Proxy/Verification/CNICVerification`,
      payload,
      {
        headers,
      }
    );

    return NextResponse.json({
      success: response.data?.Status,
      ...response.data,
    });
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);

    return NextResponse.json(
      {
        success: false,
        message: err.response?.data || err.message,
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}
