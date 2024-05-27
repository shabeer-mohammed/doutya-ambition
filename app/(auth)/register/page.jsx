"use client";
// pages/signup.js
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import FormField from "@/app/(Innerpage)/(components)/FormField";
import CustomButton from "@/app/(Innerpage)/(components)/CustomButton";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { File } from "lucide-react";
import { baseURL } from "@/lib/baseData";
import { loginSuccess } from "@/lib/features/authSlice";
// import FormField from "../components/FormField";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import CustomButton from "../components/CustomButton";

const SignUp = () => {
  const router = useRouter();
  const mobile = useAppSelector((state) => state.auth.mobile);
console.log(mobile)
//   useEffect(()=>{
// if(!mobile)
//   {
//     return redirect("/signup")
//   }
//   },[])
  const [form, setForm] = useState({
    email: "",
    name: "",
    education: "",
    location: "",
    date: new Date(),
    resume: null,
    // mobile: mobile.phone,
    mobile: "987655",
  });
  const [isLoading, setIsLoading] = useState(false);

  const dataPicker = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setForm({ ...form, resume: file });
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  const dispatch = useAppDispatch();
  const submitForm = async () => {
    if (
      !form.email ||
      !form.name ||
      !form.education ||
      !form.location ||
      !form.date ||
      !form.resume ||
      !form.mobile
    ) {
      return alert("Please fill all fields to continue.");
    }

    try {
      setIsLoading(true);

      const formattedDate = formatDate(form.date);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("education", form.education);
      formData.append("location", form.location);
      formData.append("dob", formattedDate);
      formData.append("mobile", form.mobile);
      formData.append("resume", form.resume, form.resume.name);

      const response = await fetch(`${baseURL}/sign-up`, {
        method: "POST",
        body: formData,
        
      });

      const result = await response.json();
      console.log("result",result);
      if (result.success) {
        // const newDataJSON = JSON.stringify(result.user);
        dispatch(loginSuccess(result.user));  // Ensure this line dispatches the user object directly

        router.replace("/home");
      } else {
        console.log(result.error);
        alert(result.error[0] || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Something went wrong while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full  p-4">
      <div className="max-w-md mx-auto">
        {/* <img src={images.logo} className="w-24 h-24 mt-5 mx-auto" alt="Logo" /> */}
        <h1 className="text-xl font-bold  tracking-wide mt-3 text-center">
          Register Now!
        </h1>
        <p className="text-base text-slate-700  tracking-wide mt-2 text-center">
          Enter your information below
        </p>
        <div className="space-y-4 mt-4">
          <FormField
            value={form.name}
            placeholder="Name"
            handleChangeText={(e) =>
              setForm({
                ...form,
                name: e,
              })
            }
          />
          <FormField
            value={form.email}
            placeholder="Email Address"
            handleChangeText={(e) =>
              setForm({
                ...form,
                email: e,
              })
            }
            keyboardType="email"
          />
          <FormField
            value={form.education}
            placeholder="Education"
            handleChangeText={(e) =>
              setForm({
                ...form,
                education: e,
              })
            }
          />
          <FormField
            value={form.location}
            placeholder="Location"
            handleChangeText={(e) =>
              setForm({
                ...form,
                location: e,
              })
            }
          />
          {/* <div>
            <label className="block text-white mb-1">Date of Birth</label>
            <DatePicker
              selected={form.date}
              onChange={(date) => setForm({ ...form, date })}
              className="w-full p-2 border border-primary-dark bg-dark-50 rounded-lg"
            />
          </div> */}
          {form.resume && (
            <div className="border border-primary-dark w-full rounded-md p-4 mt-3 flex flex-col items-center">
              <File className="text-orange-500 text-4xl" />{" "}
              <span className="text-sm  mt-3">{form.resume.name}</span>
            </div>
          )}
          <div className="flex items-center mt-2">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="file-upload"
              onChange={dataPicker}
            />
            <label
              htmlFor="file-upload"
              className="p-3 py-4 bg-orange-500 rounded-md flex-1 text-center text-white cursor-pointer"
            >
              Upload your resume
            </label>
          </div>
          <CustomButton
            isLoading={isLoading}
            handlePress={submitForm}
            containerStyle="mt-4 w-full"
            title="Submit"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
