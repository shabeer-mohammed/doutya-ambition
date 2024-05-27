"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User, Lock, Computer, Eye, Globe, Earth } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { baseURL } from "@/lib/baseData";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { editUser } from "@/lib/features/authSlice";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const Register2 = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if user is not logged in and not on login or signup pages
    if (!user) {
      router.push("/signup");
    }
    // if (user && (pathname.includes("login") || pathname.includes("signup"))) {
    //   if (user.steps >= 2) {
    //     router.push("/home");
    //   }
    // }
  }, [user, router]);
  const [date, setDate] = useState(() => {
    const elevenYearsAgo = new Date();
    elevenYearsAgo.setFullYear(elevenYearsAgo.getFullYear() - 11);
    return elevenYearsAgo;
  });
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 11,
    today.getMonth(),
    today.getDate()
  );
  const [formDataCheck, setFormDataCheck] = useState({
    gender: "",
    birth_date: date,
    country: 101,
    state: "",
    referral_user_id: "",
    user_id: user.id,
  });

  const showToast = (errorData) => {
    toast({
      variant: "danger",
      title: "Oops",
      description: errorData,
    });
  };
  const [items, setItems] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [stateValues, setStateValues] = useState("");
  const [genderValues, setGenderValues] = useState("");

  useEffect(() => {
    // handleChange("country", values);
    const fetchState = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/state.php?country_id=${formDataCheck.country}`
        );

        if (response.status === 200) {
          setStateList(response.data);
        } else {
          console.error("Failed to fetch states");
        }
      } catch (error) {
        console.error("Error while fetching states:", error.message);
      }
    };

    fetchState();
  }, [formDataCheck.country]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/country.php`);

        if (response.status === 200) {
          setItems(response.data);
          //   console.log(response.data);
        } else {
          console.error("Failed to fetch countries");
        }
      } catch (error) {
        console.error("Error while fetching countries:", error.message);
      }
    };

    fetchData();
  }, []);
  const handleLogin = async () => {
    const today = new Date();
    const birthDate = formDataCheck.birth_date;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    // console.log("hello")
    // Check if age is at least 11
    if (age < 11) {
      showToast("You must be at least 11 years old to sign up.");
      return;
    }
    for (const key in formDataCheck) {
      if (
        key !== "referral_user_id" &&
        (formDataCheck[key] === "" || formDataCheck[key] === null)
      ) {
        let key2 = key;
        if (key == "birth_date") {
          key2 = "Date of Birth";
        }
        if (key == "gender") {
          key2 = "Gender";
        }
        if (key == "country") {
          key2 = "Country";
        }
        if (key == "state") {
          key2 = "State";
        }
        showToast(`${key2} is required`);
        return;
      }
    }

    if (user) {
      try {
        const response = await axios.post(
          `${baseURL}/signup2.php`,
          formDataCheck,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data)
        if (response.data.success) {
          const newDataJSON = JSON.stringify(response.data.user);

          dispatch(editUser(response.data.user));
          router.push("/home");
        } else {
          console.error("Error:", response.data.error);
          showToast(response.data.error);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };
  return (
    <div className=" flex flex-col gap-4">
      <div className="h-48 relative">
        <Image src={"/assets/images/wave.png"} alt="Wave" fill />
      </div>
      <div className=" h-full w-full space-y-3">
        <p className="text-center text-[#20bb59] text-2xl">Signup</p>
        <p className="text-center text-slate-500">Complete your profile</p>
        <div className="mt-2 p-3 space-y-6">
          <div className="flex  border-[#20bb59] border rounded-xl items-center p-1">
            <p className="ml-3">
              <User color="gray" />
            </p>
            {/* <Select>
              <SelectTrigger className="ml-2">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select> */}
            <select
              onChange={(e) =>
                setFormDataCheck((prevFormData) => ({
                  ...prevFormData,
                  gender: e.target.value,
                }))
              }
              className="w-full p-3 bg-white"
              defaultValue="Male"
            >
              <option disabled>Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex  border-[#20bb59] border rounded-xl items-center p-1">
            
          <DatePicker className="p-2 w-full" selected={date} onChange={(date) => setDate(date)} />
          </div>
          <div className="flex  border-[#20bb59] border rounded-xl items-center p-1">
            <p className="ml-3">
              <Earth color="gray" />
            </p>
            {/* <Select> */}
            {/* <SelectTrigger className="ml-2">
                <SelectValue placeholder="Select your Country" />
              </SelectTrigger>
              <SelectContent>
                {items?.length > 0 &&
                  items?.map((item, index) => {
                    return (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select> */}
            <select
              onChange={(e) =>
                setFormDataCheck((prevFormData) => ({
                  ...prevFormData,
                  country: e.target.value,
                }))
              }
              className="w-full p-3 bg-white"
              defaultValue={101}
            >
              <option disabled>Country</option>
              {items?.length > 0 &&
                items?.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="flex  border-[#20bb59] border rounded-xl items-center p-1">
            <p className="ml-3">
              <Globe color="gray" />
            </p>
            {/* <Select>
              <SelectTrigger className="ml-2">
                <SelectValue placeholder="Select your State" />
              </SelectTrigger>
              <SelectContent>
                {items?.length > 0 &&
                  items?.map((item, index) => {
                    return (
                      <SelectItem key={index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select> */}
            <select
              onChange={(e) =>
                setFormDataCheck((prevFormData) => ({
                  ...prevFormData,
                  state: e.target.value,
                }))
              }
              className="w-full p-3 bg-white"
              defaultValue=""
            >
              <option disabled>State</option>
              {stateList?.length > 0 &&
                stateList?.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="flex  border-[#20bb59] border rounded-xl items-center p-1">
            <p className="ml-3">
              <Lock color="gray" />
            </p>
            <input
              onChange={(e) =>
                setFormDataCheck((prevFormData) => ({
                  ...prevFormData,
                  referral_user_id: e.target.value,
                }))
              }
              type="text"
              placeholder="Enter referral code"
              className="flex-1 p-3 focus:outline-none rounded-xl"
            />
          </div>

          <div className="mt-3 flex justify-center flex-col items-center gap-3">
            <Button
              className="bg-[#20bb59] px-10 rounded-full py-6 text-lg"
              onClick={handleLogin} // Add this line
            >
              Create account
            </Button>
            <span className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href={"/login"}>
                <span className="text-[#20bb59]">Login</span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register2;
