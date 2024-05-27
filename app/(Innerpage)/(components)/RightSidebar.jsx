"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseImgURL, baseURL } from "@/lib/baseData";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PiUserCircleFill } from "react-icons/pi";
import { MdPermMedia, MdLogout } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/features/authSlice";

const RightSidebar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState([]);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const fetchPeople = async () => {
      if (user) {
        // console.log(user)
        try {
          const response = await axios.get(
            `${baseURL}/getOtherUser.php?user_id=${user.id}`
          );
          if (response.status === 200) {
            setUserData(response.data);
            setCount(response.data.followers);
          } else {
            console.error("Failed to fetch other user");
          }
        } catch (error) {
          console.error("Error while fetching other user:", error.message);
        }
      }
    };

    fetchPeople();
  }, [user]);
  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/signup")
  };
  return (
    <div className="h-full w-full">
      <div className="h-72 w-full relative gap-4 flex flex-col justify-center items-center">
        <Image
          src={"/assets/images/bgLog.png"}
          fill
          className="absolute w-full h-full object-cover -z-10"
        />
        <div
          className={cn(
            " relative  h-28 w-28 ",
            userData?.user_image
              ? ""
              : " bg-[#ff8f8e] rounded-full flex justify-center items-center"
          )}
        >
          {userData?.user_image ? (
            <Image
              src={baseImgURL + userData?.user_image}
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
        <div>
          <p className="text-xl text-center font-bold">{userData?.name}</p>
        </div>
        <div className="flex justify-around w-full gap-2 ">
          <div className="flex flex-col">
            <p className=" text-center font-bold">{count}</p>
            <p className=" text-center font-bold">Followers</p>
          </div>
          <div className="flex flex-col">
            <p className=" text-center font-bold">{userData.following}</p>
            <p className=" text-center font-bold">Following</p>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full h-full flex flex-col gap-4">
        <Link
          href={`/user/${user.id}`}
          className="flex gap-3 w-full p-3 items-center"
        >
          <PiUserCircleFill color="black" size={24} /> <p>My Profile</p>
        </Link>
        <Link
          href={`/posts/add-new-post`}
          className="flex gap-3 w-full p-3 items-center"
        >
          <MdPermMedia color="black" size={24} /> <p>Add Post</p>
        </Link>
        <Link href={`/faq`} className="flex gap-3 w-full p-3 items-center">
          <FaQuestionCircle color="black" size={24} /> <p>FAQ</p>
        </Link>
        <div onClick={handleLogout} className=" cursor-pointer flex gap-3 w-full p-3 items-center">
          <MdLogout color="black" size={24} /> <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
