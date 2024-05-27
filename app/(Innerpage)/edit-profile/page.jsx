"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/app/(Innerpage)/(components)/FormField";
import CustomButton from "@/app/(Innerpage)/(components)/CustomButton";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { baseURL } from "@/lib/baseData";

const EditProfile = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    name: "",
    education: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/signup");
    } else {
      getUserDetails();
    }
  }, [user]);

  const getUserDetails = async () => {
    try {
      const response = await axios.post(
        `${baseURL}/getUserEditDetails.php`,
        {
          id: user?.id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.data) {
        const userData = response.data.data;
        setForm({
          name: userData.name,
          education: userData.education,
          location: userData.location,
        });
      } else {
        console.error("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const submitForm = async () => {
    // Form validation
    if (!form.name || !form.education || !form.location) {
      return alert("Please fill all fields to continue.");
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("education", form.education);
      formData.append("location", form.location);
      formData.append("id", user.id);

      const response = await axios.post(`${baseURL}/updateUser.php`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log(response);

      if (response.data.success) {
        router.replace(`/user/${user.id}`);
      } else {
        alert(response.data.error[0] || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Something went wrong while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-full w-full p-4 bg-white border">
      <div className="max-w-md mx-auto">
        <p className="text-base text-slate-700 tracking-wide mt-2 text-center">
          Enter your information below
        </p>
        <div className="space-y-4 mt-4">
          <FormField
            value={form.name}
            placeholder="Name"
            handleChangeText={(e) => setForm({ ...form, name: e })}
          />
          <FormField
            value={form.education}
            placeholder="Education"
            handleChangeText={(e) => setForm({ ...form, education: e })}
          />
          <FormField
            value={form.location}
            placeholder="Location"
            handleChangeText={(e) => setForm({ ...form, location: e })}
          />
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

export default EditProfile;
