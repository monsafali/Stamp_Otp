"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/verify-and-send-otp",
        {
          cnic,
          contact,
        }
      );

      if (data.success) {
        alert("OTP sent successfully.");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold text-center mb-6">
        Verify CNIC
      </h2>

      <input
        type="text"
        placeholder="Enter CNIC"
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full border rounded-lg p-3 mb-6"
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Please wait..." : "Verify & Send OTP"}
      </button>
    </div>
  );
}
