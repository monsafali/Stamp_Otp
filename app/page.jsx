"use client";

import FirstOTP from "./components/FirstOTP";
import OTP from "./components/OTP";
import SecondOTP from "./components/SecondOTP";

import FirstEmailOTP from "./components/FirstEmail";
import SecondEmail from "./components/SecondEmail";

export default function Home() {
  return (
    <>
      <FirstOTP />

      <OTP />

      <SecondOTP />

      <FirstEmailOTP />
      <SecondEmail />
    </>
  );
}
