"use client";

import { useState } from "react";

export default function PDFOTP() {
  const [otp, setOtp] = useState("");
  const [challanNumber, setChallanNumber] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/send-pdf-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          challanNumber,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP.");
      }

      setMessage("OTP sent successfully!");

      // Clear fields
      setOtp("");
      setChallanNumber("");
      setEmail("");
    } catch (error) {
      console.error("Email OTP error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
<div className=" bg-gray-100 flex items-center justify-center px-4 ">
      <div className=" max-w-md rounded-2xl bg-white  shadow-lg sm:p-8">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Send Stamp OTP
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Send the PDF file key OTP to the customer's email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

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
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="221870"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
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
              type="text"
              value={challanNumber}
              onChange={(e) => setChallanNumber(e.target.value)}
              placeholder="202622214763DD13"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

      </div>
    </div>
  );
}
