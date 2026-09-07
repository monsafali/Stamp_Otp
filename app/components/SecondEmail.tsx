
"use client";

import { useEffect, useState } from "react";

export default function SecondEmail() {
  // =====================================================
  // STAMP EMAIL FORM STATES
  // =====================================================

  const [stampNumber, setStampNumber] = useState("");
  const [challanNumber, setChallanNumber] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // PDF OTP FORM STATES
  // =====================================================

  const [otp, setOtp] = useState("");
  const [pdfChallanNumber, setPdfChallanNumber] =
    useState("");
  const [pdfEmail, setPdfEmail] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfMessage, setPdfMessage] = useState("");
  const [pdfError, setPdfError] = useState("");

  // =====================================================
  // LOAD SAVED STAMP DATA
  // =====================================================

  useEffect(() => {
    const savedData =
      localStorage.getItem("stampEmailData");

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        setStampNumber(data.stampNumber || "");
        setChallanNumber(data.challanNumber || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error(
          "Failed to read localStorage:",
          error
        );
      }
    }
  }, []);

  // =====================================================
  // SAVE STAMP DATA TO LOCAL STORAGE
  // =====================================================

  const saveToLocalStorage = (
    stamp: string,
    challan: string,
    emailAddress: string
  ) => {
    const data = {
      stampNumber: stamp,
      challanNumber: challan,
      email: emailAddress,
    };

    localStorage.setItem(
      "stampEmailData",
      JSON.stringify(data)
    );
  };

  // =====================================================
  // SEND STAMP EMAIL
  // API:
  // /api/send-stamp-email
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !stampNumber ||
      !challanNumber ||
      !email
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      // Save before sending
      saveToLocalStorage(
        stampNumber,
        challanNumber,
        email
      );

      const response = await fetch(
        "/api/send-stamp-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stampNumber,
            challanNumber,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send email."
        );
      }

      // Save again after successful request
      saveToLocalStorage(
        stampNumber,
        challanNumber,
        email
      );

      setMessage(
        "Email sent successfully!"
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEND PDF OTP
  // API:
  // /api/send-pdf-email
  // =====================================================

  const handlePDFOTP = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setPdfLoading(true);
    setPdfMessage("");
    setPdfError("");

    try {
      const response = await fetch(
        "/api/send-pdf-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp,
            challanNumber: pdfChallanNumber,
            email: pdfEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send OTP."
        );
      }

      setPdfMessage(
        "OTP sent successfully!"
      );

      // Clear fields
      setOtp("");
      setPdfChallanNumber("");
      setPdfEmail("");
    } catch (error) {
      console.error(
        "Email OTP error:",
        error
      );

      setPdfError(
        error instanceof Error
          ? error.message
          : "Failed to send OTP."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-6xl">

        {/* ============================================
            PAGE HEADING
        ============================================= */}

        <h1 className="mb-10 text-center text-3xl font-bold text-gray-800">
          e-Stamping Email System
        </h1>

        <div className="grid gap-8 md:grid-cols-2">

          {/* ==========================================
              FIRST FORM
              STAMP EMAIL
          =========================================== */}

          <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">

            <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
              Stamp Email System
            </h1>

            <p className="mb-8 text-center text-gray-500">
              Send stamp information to an email
              address
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Stamp Number */}

              <div>
                <label
                  htmlFor="stampNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Stamp Number
                </label>

                <input
                  id="stampNumber"
                  type="text"
                  maxLength={16}
                  value={stampNumber}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setStampNumber(value);

                    saveToLocalStorage(
                      value,
                      challanNumber,
                      email
                    );
                  }}
                  placeholder="4A05C799814E8ED1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Challan Number */}

              <div>
                <label
                  htmlFor="challanNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Challan Number
                </label>

                <input
                  id="challanNumber"
                  maxLength={16}
                  type="text"
                  value={challanNumber}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setChallanNumber(value);

                    saveToLocalStorage(
                      stampNumber,
                      value,
                      email
                    );
                  }}
                  placeholder="202622214763DD13"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Recipient Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setEmail(value);

                    saveToLocalStorage(
                      stampNumber,
                      challanNumber,
                      value
                    );
                  }}
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}

              {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {message}
                </div>
              )}

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Sending Email..."
                  : "Send Email"}
              </button>

            </form>
          </div>


          {/* ==========================================
              SECOND FORM
              PDF OTP
          =========================================== */}

          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

            {/* Heading */}

            <div className="text-center">

              <h1 className="text-2xl font-bold text-gray-900">
                Send Stamp OTP
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Send the PDF file key OTP to the
                customer's email.
              </p>

            </div>

            <form
              onSubmit={handlePDFOTP}
              className="mt-6 space-y-5"
            >

              {/* OTP */}

              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="221870"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Challan Number */}

              <div>
                <label
                  htmlFor="pdfChallanNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Challan Number
                </label>

                <input
                  id="pdfChallanNumber"
                  maxLength={16}
                  type="text"
                  value={pdfChallanNumber}
                  onChange={(e) =>
                    setPdfChallanNumber(
                      e.target.value
                    )
                  }
                  placeholder="202622214763DD13"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="pdfEmail"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="pdfEmail"
                  type="email"
                  value={pdfEmail}
                  onChange={(e) =>
                    setPdfEmail(
                      e.target.value
                    )
                  }
                  placeholder="customer@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Error */}

              {pdfError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {pdfError}
                </div>
              )}

              {/* Success */}

              {pdfMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {pdfMessage}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={pdfLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pdfLoading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>

            </form>

          </div>

        </div>
      </div>
    </main>
  );
}
