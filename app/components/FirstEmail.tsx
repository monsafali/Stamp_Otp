
"use client";

import { useState } from "react";

export default function FirstEmailOTP() {
  // -----------------------------
  // Stamp OTP states
  // -----------------------------
  const [stampNumber, setStampNumber] =
    useState("random");

  const [stampEmail, setStampEmail] =
    useState("");

  const [stampLoading, setStampLoading] =
    useState(false);

  const [stampMessage, setStampMessage] =
    useState("");

  const [stampError, setStampError] =
    useState("");

  // -----------------------------
  // Challan OTP states
  // -----------------------------
  const [challanNumber, setChallanNumber] =
    useState("32-A");

  const [cnic, setCnic] =
    useState("");

  const [challanEmail, setChallanEmail] =
    useState("");

  const [challanLoading, setChallanLoading] =
    useState(false);

  const [challanMessage, setChallanMessage] =
    useState("");

  const [challanError, setChallanError] =
    useState("");

  // -----------------------------
  // Send Stamp OTP
  // -----------------------------
  const sendStampOTP = async (
    e
  ) => {
    e.preventDefault();

    setStampMessage("");
    setStampError("");

    if (!stampNumber || !stampEmail) {
      setStampError(
        "Please enter Stamp Number and Email."
      );
      return;
    }

    try {
      setStampLoading(true);

      const response = await fetch(
        "/api/first-email-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stampNumber,
            email: stampEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send Stamp OTP."
        );
      }

      setStampMessage(
        "OTP sent successfully to your email."
      );
    } catch (error) {
      console.error(error);

      setStampError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setStampLoading(false);
    }
  };

  // -----------------------------
  // Send Challan OTP
  // -----------------------------
  const sendChallanOTP = async (
    e
  ) => {
    e.preventDefault();

    setChallanMessage("");
    setChallanError("");

    if (
      !challanNumber ||
      !cnic ||
      !challanEmail
    ) {
      setChallanError(
        "Please fill all Challan fields."
      );
      return;
    }

    try {
      setChallanLoading(true);

      const response = await fetch(
        "/api/second-email-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challanNumber,
            cnic,
            email: challanEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to send Challan OTP."
        );
      }

      setChallanMessage(
        "Challan OTP sent successfully to your email."
      );
    } catch (error) {
      console.error(error);

      setChallanError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setChallanLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-5xl">

        <h1 className="mb-10 text-center text-3xl font-bold text-gray-800">
          e-Stamping Email OTP System
        </h1>

        <div className="grid gap-8 md:grid-cols-2">

          {/* =====================================
              STAMP OTP
          ====================================== */}

          <div className="rounded-xl bg-white p-8 shadow-lg">

            <h2 className="mb-2 text-xl font-bold text-gray-800">
              Stamp Verification OTP
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Send OTP for e-Stamping verification.
            </p>

            <form
              onSubmit={sendStampOTP}
              className="space-y-5"
            >

              {/* Stamp Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stamp Number
                </label>

                <input
                  type="text"
                  maxLength={16}
                  value={stampNumber}
                  onChange={(e) =>
                    setStampNumber(
                      e.target.value
                    )
                  }
                  placeholder="4A05C799814E8ED1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={stampEmail}
                  onChange={(e) =>
                    setStampEmail(
                      e.target.value
                    )
                  }
                  placeholder="customer@gmail.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Error */}
              {stampError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {stampError}
                </div>
              )}

              {/* Success */}
              {stampMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {stampMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={stampLoading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {stampLoading
                  ? "Sending OTP..."
                  : "Send Stamp OTP"}
              </button>

            </form>
          </div>


          {/* =====================================
              CHALLAN OTP
          ====================================== */}

          <div className="rounded-xl bg-white p-8 shadow-lg">

            <h2 className="mb-2 text-xl font-bold text-gray-800">
              Challan Verification OTP
            </h2>

            <p className="mb-6 text-sm text-gray-500">
              Send OTP using Challan Number and CNIC.
            </p>

            <form
              onSubmit={sendChallanOTP}
              className="space-y-5"
            >

              {/* Challan Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Challan Number
                </label>

                <input
                  type="text"
                  maxLength={16}
                  value={challanNumber}
                  onChange={(e) =>
                    setChallanNumber(
                      e.target.value
                    )
                  }
                  placeholder="32-A"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* CNIC */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  CNIC
                </label>

                <input
                  type="text"
                  maxLength={15}
                  value={cnic}
                  onChange={(e) => {
                    let value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (value.length > 13) {
                      value =
                        value.slice(0, 13);
                    }

                    // Format:
                    // 31103-0509328-9

                    if (
                      value.length > 12
                    ) {
                      value =
                        `${value.slice(
                          0,
                          5
                        )}-${value.slice(
                          5,
                          12
                        )}-${value.slice(12)}`;
                    } else if (
                      value.length > 5
                    ) {
                      value =
                        `${value.slice(
                          0,
                          5
                        )}-${value.slice(5)}`;
                    }

                    setCnic(value);
                  }}
                  placeholder="31103-0509328-9"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={challanEmail}
                  onChange={(e) =>
                    setChallanEmail(
                      e.target.value
                    )
                  }
                  placeholder="customer@gmail.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Error */}
              {challanError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {challanError}
                </div>
              )}

              {/* Success */}
              {challanMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {challanMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={challanLoading}
                className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {challanLoading
                  ? "Sending OTP..."
                  : "Send Challan OTP"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </main>
  );
}

