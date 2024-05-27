"use client";
import React, { useState } from "react";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "../(components)/firebase";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { loginSuccess, storeMobile } from "@/lib/features/authSlice";
import axios from "axios";
import { baseURL } from "@/lib/baseData";

const Signup = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [contryCode, setCountryCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
          console.log(response);
        },
      });
    }
  }

  function onSignInSubmit() {
    setloading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+91" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setloading(false);
        setShowOTP(true);
        // alert("OTP sent successfully");
      })
      .catch((error) => {
        console.log(error);
        setloading(false);
      });
  }

  const onOTPVerify = async () => {
    setloading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        // Assuming auth and user.accessToken are available in your Firebase setup
        setUser(res.user);
        setloading(false);
        const formatPh = "+91" + ph;
        // console.log(res.user.uid)
        dispatch(storeMobile({ phone: formatPh, uid: res.user.uid }));

        try {
          const response = await axios.get(
            `${baseURL}/checkAlreadyUser.php?phone=${formatPh}`
          );
          console.log(response.data);
          if (response.data.success) {
            dispatch(loginSuccess(response.data.user));
            router.push("/home");
          } else {
            router.push("/register");
          }
        } catch (error) {
          console.error("error", error);
        }
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
      });
  };

  function onPasswordSubmit() {
    // Handle password submission logic here
    console.log("Password:", password);
    // Navigate or perform other actions as needed
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src={"/assets/images/welcome_bg.png"}
        fill
        className="w-full h-full absolute"
        alt="Welcome"
      />
      <div className="mt-5 w-full flex justify-center ">
        <div className=" relative w-32 h-32 ">
          <Image src={"/assets/images/doutya4.png"} fill alt="logo" />
        </div>
      </div>
      <div className="px-4 md:px-10 flex justify-center mt-24 h-full w-full">
        <div className=" bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 w-full h-72 space-y-5">
          <h3 className="text-xl text-white text-center font-bold mt-5">
            WELCOME
          </h3>
          <p className="text-white text-center font-bold">
            Enter your mobile number
          </p>
          <div className="mt-3 p-3 space-y-5 w-full flex items-center gap-3">
            {!showOTP && (
              <>
                <input
                  type="text"
                  className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                  placeholder="number"
                  onChange={(e) => setPh(e.target.value)}
                />
              </>
            )}
            {showOTP && (
              <>
                <input
                  type="text"
                  className="focus:outline-none p-3 bg-white border w-full rounded-lg"
                  placeholder="otp"
                  onChange={(e) => setOtp(e.target.value)}
                />
              </>
            )}
          </div>
          <div className="mx-auto  justify-center flex w-full">
            {!showOTP && (
              <Button onClick={onSignInSubmit} className="bg-[#20bb59]">
                Send otp
              </Button>
            )}
            {showOTP && (
              <Button onClick={onOTPVerify} className="bg-[#20bb59]">
                Verify otp
              </Button>
            )}
          </div>
        </div>
        <div id="sign-in-button"></div>
      </div>
    </div>
  );
};

export default Signup;
