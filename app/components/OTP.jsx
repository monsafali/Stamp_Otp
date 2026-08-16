"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function OTP() {
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCnic = localStorage.getItem("first_otp_cnic");
    const savedContact = localStorage.getItem("first_otp_contact");

    if (savedCnic) {
           // eslint-disable-next-line react-hooks/set-state-in-effect
      setCnic(savedCnic);
    }

    if (savedContact) {
      setContact(savedContact);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("first_otp_cnic", cnic);
  }, [cnic]);

  useEffect(() => {
    localStorage.setItem("first_otp_contact", contact);
  }, [contact]);

  const handleVerify = async () => {
    if (!cnic || !contact) {
      alert("Please enter CNIC and mobile number.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/OTP", {
        cnic,
        contact,
      });

      console.log("OTP API:", data);

      if (data.success) {
        alert("OTP sent successfully.");
      } else {
        alert(data.message || "OTP sending failed.");
      }
    } catch (err) {
      console.error("OTP error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setCnic("");
    setContact("");

    localStorage.removeItem("first_otp_cnic");
    localStorage.removeItem("first_otp_contact");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold text-center mb-6">
        Direct OTP
      </h2>

      <input
        type="number"

        placeholder="Enter CNIC"
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
        className="w-full border rounded-lg p-3 mb-4"
      />

      <input
        type="number"

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
