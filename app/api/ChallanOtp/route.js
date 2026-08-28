// import axios from "axios";
// import { NextResponse } from "next/server";

// const BASE_URL =
//   "https://es.punjab-zameen.gov.pk/eStampCitizenPortal";

// const headers = {
//   "Content-Type": "application/json",
//   "X-Requested-With": "XMLHttpRequest",
//   Origin: "https://es.punjab-zameen.gov.pk",
//   Referer:
//     "https://es.punjab-zameen.gov.pk/eStampCitizenPortal/",
// };

// export async function POST(request) {
//   try {
//     const {
//       cnic,
//       contact,
//       email,
//       party2Cnic,
//       party2Contact,
//     } = await request.json();

//     const payload = [
//       {
//         cnic,
//         contact,
//         email,
//         personType: "local",
//         partyType: "Agent",
//         deedId: 180,
//       },
//       {
//         cnic,
//         contact,
//         email: null,
//         personType: "Pakistani person",
//         partyType: "Party1",
//         deedId: 180,
//       },
//       {
//         cnic: party2Cnic,
//         contact: party2Contact,
//         email,
//         personType: "Pakistani person",
//         partyType: "Party2",
//         deedId: 180,
//       },
//     ];

//     const response = await axios.post(
//       `${BASE_URL}/api/Proxy/Verification/CNICVerification`,
//       payload,
//       {
//         headers,
//       }
//     );

//     return NextResponse.json({
//       success: response.data?.Status,
//       ...response.data,
//     });
//   } catch (err) {
//     console.log("Status:", err.response?.status);
//     console.log("Data:", err.response?.data);

//     return NextResponse.json(
//       {
//         success: false,
//         message: err.response?.data || err.message,
//       },
//       {
//         status: err.response?.status || 500,
//       }
//     );
//   }
// }



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
    "https://es.punjab-zameen.gov.pk/eStampCitizenPortal/",
};

export async function POST(request) {
  try {
    const {
      cnic,
      contact,
      email,
    } = await request.json();

    // ---------------------------------------------
    // Validate
    // ---------------------------------------------

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // Clean CNIC and Contact
    // ---------------------------------------------

    let cleanContact = String(contact)
      .trim()
      .replace(/\s/g, "");

    let cleanCnic = cnic
      ? String(cnic).trim().replace(/\s/g, "")
      : "";

    // ---------------------------------------------
    // Format mobile
    // 03069091325
    // ->
    // 0306-9091325
    // ---------------------------------------------

    if (/^\d{11}$/.test(cleanContact)) {
      cleanContact =
        cleanContact.slice(0, 4) +
        "-" +
        cleanContact.slice(4);
    }

    // ---------------------------------------------
    // Format CNIC
    // 3840113292453
    // ->
    // 38401-1329245-3
    // ---------------------------------------------

    if (/^\d{13}$/.test(cleanCnic)) {
      cleanCnic =
        cleanCnic.slice(0, 5) +
        "-" +
        cleanCnic.slice(5, 12) +
        "-" +
        cleanCnic.slice(12);
    }

    console.log("Clean CNIC:", cleanCnic);
    console.log("Clean Contact:", cleanContact);

    // ---------------------------------------------
    // Build GenerateOTP URL
    // ---------------------------------------------

    const params = new URLSearchParams();

    params.set("contact", cleanContact);

    // Same behavior as your first working code
    params.set("isHighValue", "true");

    if (cleanCnic) {
      params.set("cnic", cleanCnic);
    }

    const otpUrl =
      `${BASE_URL}/api/Proxy/ChallanForm/GenerateOTP?${params.toString()}`;

    console.log("Generate OTP URL:", otpUrl);

    // ---------------------------------------------
    // DIRECT GenerateOTP request
    // ---------------------------------------------

    const response = await axios.post(
      otpUrl,
      {},
      {
        headers,
        timeout: 30000,
      }
    );

    console.log(
      "GenerateOTP response:",
      JSON.stringify(response.data, null, 2)
    );

    // ---------------------------------------------
    // Return API response
    // ---------------------------------------------

    return NextResponse.json({
      success: true,
      message: "OTP sending successfully .",
      data: response.data,
    });

  } catch (err) {
    console.error(
      "GenerateOTP error:",
      err.response?.data || err.message
    );

    return NextResponse.json(
      {
        success: false,
        message:
          err.response?.data?.message ||
          err.response?.data?.Message ||
          err.response?.data ||
          err.message ||
          "OTP request failed.",
      },
      {
        status: err.response?.status || 500,
      }
    );
  }
}
