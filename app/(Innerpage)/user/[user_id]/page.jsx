"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseImgURL, baseURL } from "@/lib/baseData";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

const UserDetails = ({ params }) => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signup");
    }
  }, [user, router]);

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/getOtherUser.php?user_id=${user?.id}`);
        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error("Failed to fetch user data: ", response.statusText);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error while fetching data: ", error.message);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="max-w-[600px] h-screen overflow-x-scroll w-full mx-auto">
      <div className="w-full bg-gradient-to-r from-[#37789C] to-[#8B2C4E]">
        <div className="flex justify-between w-full p-3">
          <div className="flex gap-3">
            <div
              className={cn(
                "relative h-24 rounded-full w-24 border-[3.5px] border-[#66bad6]",
                userData?.user_image
                  ? ""
                  : "bg-[#ff8f8e] flex justify-center items-center"
              )}
            >
              {userData?.user_image ? (
                <Image
                  src={`${baseImgURL}${userData?.user_image}`}
                  fill
                  alt="Profile Image"
                  className="rounded-full object-cover"
                />
              ) : (
                <p className="text-3xl text-white font-bold">
                  {userData?.first_character}
                </p>
              )}
            </div>
            <div className="flex  justify-between items-center py-3 font-bold text-white">
              <p>{userData?.name}</p>
            </div>
          </div>
          <div className="flex flex-col py-3 justify-between">
            <div className="relative h-6 w-6">
              <Image src="/assets/images/vip.png" fill alt="VIP" />
            </div>
            {user?.id && (
              <Link href={`/edit-profile`}>
                <FaEdit size={22} color="white" />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-full flex-1 overflow-y-scroll">
        {/* Additional content can be rendered here */}
      </div>
    </div>
  );
};

export default UserDetails;
