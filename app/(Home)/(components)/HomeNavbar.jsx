"use client";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks";

const HomeNavbar = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <nav className="w-full p-3 ">
      <ul className="w-full flex justify-between items-center">
        <li className="flex-1">
          <div className="">
            <Image
              src="/assets/images/doutya4.png"
              alt="logo"
              width={80}
              height={80}
              className=" ml-[58%] border rounded-md"
            />
          </div>
        </li>
        {!user && (
          <li>
            <Link href="/login">
              <Button variant={"ghost"} className=" text-white">
                Login/Signup
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default HomeNavbar;
