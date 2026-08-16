"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function FirstOTP() {
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved CNIC and phone number
  useEffect(() => {
    const savedCnic = localStorage.getItem("first_otp_cnic");
    const savedContact = localStorage.getItem("first_otp_contact");

    if (savedCnic) {
      setCnic(savedCnic);
    }

    if (savedContact) {
      setContact(savedContact);
    }
  }, []);

  // Save CNIC whenever it changes
  useEffect(() => {
    localStorage.setItem("first_otp_cnic", cnic);
  }, [cnic]);

  // Save phone whenever it changes
  useEffect(() => {
    localStorage.setItem("first_otp_contact", contact);
  }, [contact]);

  const handleVerify = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("/api/OtpSend", {
        cnic,
        contact,
      });

      if (data.success) {
        alert("OTP sent successfully.");
      } else {
        alert(data.message || "OTP sending failed.");
      }
    } catch (err) {
      console.log("Message:", err.message);
      console.log("Status:", err.response?.status);
      console.log("Data:", err.response?.data);
      console.log("Headers:", err.response?.headers);

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Clear form + localStorage
  const handleClearForm = () => {
    setCnic("");
    setContact("");

    localStorage.removeItem("first_otp_cnic");
    localStorage.removeItem("first_otp_contact");
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

      <button
        type="button"
        onClick={handleClearForm}
        className="w-full mt-3 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
      >
        Clear Form
      </button>
    </div>
  );
}
