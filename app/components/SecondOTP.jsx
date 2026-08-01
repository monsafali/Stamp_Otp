
"use client";

import { useState } from "react";
import axios from "axios";

export default function SecondOTP() {
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  // Fixed email
  const email = "fortgold272@gmail.com";

  const handleVerify = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/ChallanOtp",
        {
          cnic,
          contact,
          email,
        }
      );

      console.log(data);

      if (data.success) {
        alert(data.Message || "OTP request completed successfully.");
      } else {
        alert(data.Message || data.message || "Verification failed.");
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Challan OTP Verification
      </h2>

      <input
        className="w-full border p-3 mb-4 rounded"
        placeholder="Enter CNIC"
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
      />

      <input
        className="w-full border p-3 mb-6 rounded"
        placeholder="Enter Mobile Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded disabled:bg-gray-400"
      >
        {loading ? "Please wait..." : "Verify"}
      </button>
    </div>
  );
}
