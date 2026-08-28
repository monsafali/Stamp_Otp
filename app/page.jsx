
"use client";

import FirstOTP from "./components/FirstOTP";
import OTP from "./components/OTP";
import SecondOTP from "./components/SecondOTP";



import PDFOTP from "./components/PDFOTP";
import EmailOTP from "./components/EmailOTP";

export default function Home() {


  return (

    <>
   {/* <FirstOTP/> */}
<OTP/>

<SecondOTP/>

<EmailOTP/>

<PDFOTP/>




    </>
  );
}




