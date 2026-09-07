
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SecondOTP() {
  const [cnic, setCnic] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  // Fixed email
  const email = "fortgold272@gmail.com";

  useEffect(() => {
    const savedCnic = localStorage.getItem("challan_cnic");
    const savedContact = localStorage.getItem("challan_contact");

    if (savedCnic) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCnic(savedCnic);
    }

    if (savedContact) {
      setContact(savedContact);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("challan_cnic", cnic);
  }, [cnic]);

  useEffect(() => {
    localStorage.setItem("challan_contact", contact);
  }, [contact]);

  const handleVerify = async () => {
    if (!cnic || !contact) {
      alert("Please enter CNIC and mobile number.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/ChallanOtp", {
        cnic,
        contact,
        email,
      });

      console.log("Challan OTP API:", data);

      if (data.success) {
        alert(data.message || "OTP sent successfully.");
      } else {
        alert(data.message || "OTP sending failed.");
      }
    } catch (err) {
      console.error("Challan OTP error:", err);

      alert(
        err.response?.data?.message ||
          err.response?.data?.Message ||
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

    localStorage.removeItem("challan_cnic");
    localStorage.removeItem("challan_contact");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Challan OTP Verification
      </h2>

      <input
        type="text"
        inputMode="numeric"
        className="w-full border p-3 mb-4 rounded"
        placeholder="Enter CNIC"
        value={cnic}
        onChange={(e) => setCnic(e.target.value)}
      />

      <input
        type="text"
        inputMode="numeric"
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
        {loading ? "Please wait..." : "Send OTP"}
      </button>

      <button
        onClick={handleClearForm}
        type="button"
        className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded"
      >
        Clear Form
      </button>
    </div>
  );
}
