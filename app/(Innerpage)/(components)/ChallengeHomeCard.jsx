import React from "react";
import { baseImgURL } from "@/lib/baseData";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
const ChallengeHomeCard = ({
  item,
  formattedDate,
  formattedEndDate,
  inPage = null,
  inMap = null,
  inTodo = null
}) => {
  const encodedId = btoa(item.challenge_id);
  const maxLength = 18;
  const slicedTitle = item?.title
    ? item.title.length > maxLength
      ? item.title.slice(0, maxLength) + "..."
      : item.title
    : "";
    const user = useAppSelector((state) => state.auth.user);

  return (
    <div className={cn("shadow-xl  rounded-md  ",inTodo && "bg-white")}>
      <Link
        href={inTodo ? (user ? `/rounds/${item.challenge_id}`:`/challenge/${item.challenge_id}`):`/challenge/${item.challenge_id}`}
        className="p-3 space-y-3 flex rounded border border-s-muted-foreground px-3 gap-5  min-w-72 "
      >
        <div className={" relative h-24 w-24 border rounded-md"}>
          <Image
            src={baseImgURL + item.image}
            fill
            alt="Profile Image"
            className="rounded-lg object-cover"
          />
        </div>
        <div className="">
          <p className={cn("font-bold whitespace-nowrap")}>{slicedTitle}</p>
          {<div className="h-[1px] bg-slate-300 my-1" />}
          <div>
            <p className="max-sm:text-sm font-light">Time Remaining</p>
            <p className=" font-semibold text-slate-600">{formattedEndDate}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ChallengeHomeCard;
