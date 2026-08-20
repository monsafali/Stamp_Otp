"use client";

import { FormEvent, useState } from "react";

export default function EmailOTP() {
  const [stampNumber, setStampNumber] = useState("");
  const [challanNumber, setChallanNumber] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!stampNumber || !challanNumber || !email) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/send-stamp-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stampNumber,
          challanNumber,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email.");
      }

      setMessage("Email sent successfully!");

      // Clear form
      // setStampNumber("");
      // setChallanNumber("");
      // setEmail("");
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

  return (
    <main className=" bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Stamp Email System
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Send stamp information to an email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Stamp Number */}
          <div>
            <label
              htmlFor="stampNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stamp Number
            </label>

            <input
              id="stampNumber"
              type="text"
              value={stampNumber}
              onChange={(e) => setStampNumber(e.target.value)}
              placeholder="4A05C799814E8ED1"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Challan Number */}
          <div>
            <label
              htmlFor="challanNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Challan Number
            </label>

            <input
              id="challanNumber"
              type="text"
              value={challanNumber}
              onChange={(e) => setChallanNumber(e.target.value)}
              placeholder="202622214763DD13"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Recipient Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending Email..." : "Send Email"}
          </button>
        </form>
      </div>
    </main>
  );
}
