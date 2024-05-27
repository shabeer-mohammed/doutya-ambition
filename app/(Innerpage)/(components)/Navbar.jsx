"use client";
import Image from "next/image";
import { IoSettingsSharp } from "react-icons/io5";
import { AlignJustify, Clipboard, Home, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RightSidebar from "./RightSidebar";
import { MdHome } from "react-icons/md";
import { FaRunning } from "react-icons/fa";
import { LuSwords } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";
import { HiPlusCircle } from "react-icons/hi2";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoLocationSharp } from "react-icons/io5";
import { FaPenNib } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  // useEffect(() => {
  //   if (!user && !pathname.includes("login") && !pathname.includes("signup")) {
  //     router.replace("/login");
  //   }
  // }, [user, pathname, router]);

  return (
    <nav className="w-full p-4 bg-white">
      <ul className="w-full flex justify-between items-center">
        
        <li>
          <Image
            src="/assets/images/doutya4.png"
            alt="logo"
            width={80}
            height={80}
            className="border rounded-md"
          />
        </li>
        <li>
          {!user &&(
            <Button>
              <Link href="/signup">Login</Link>
            </Button>
          )}
        </li>
      </ul>
      <div className="  fixed   w-full left-0 bottom-0 z-50 py-2 px-3">
        <div className=" max-w-[600px] bg-white border mx-auto relative flex w-full justify-between items-center">
          <Link
            href={"/home"}
            className=" w-1/5 text-sm flex flex-col items-center justify-center"
          >
            <MdHome
              color={pathname.includes("home") ? "red" : "gray"}
              size={24}
            />
            <p
              className={
                pathname.includes("home") ? "text-red-500" : "text-gray-500"
              }
            >
              Home
            </p>
          </Link>
          <Link
            href={"/results"}
            className="w-1/5 text-sm flex-wrap flex flex-col items-center justify-center"
          >
            <Clipboard
              color={pathname.includes("results") ? "red" : "gray"}
              size={24}
            />
            <p
              className={
                pathname.includes("results")
                  ? "text-red-500"
                  : "text-gray-500"
              }
            >
              Result
            </p>
          </Link>
         
              <Link
            href={user ? `/user/${user.id}` : '/signup'}
            className="w-1/5 text-sm flex-wrap flex flex-col items-center justify-center"
          >
            <User
              color={pathname.includes("user/") ? "red" : "gray"}
              size={24}
            />
            <p
              className={
                pathname.includes("user/")
                  ? "text-red-500"
                  : "text-gray-500"
              }
            >
              Profile
            </p>
          </Link>
           
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
