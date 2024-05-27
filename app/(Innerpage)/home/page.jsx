"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { baseImgURL, baseURL } from "@/lib/baseData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaEdit } from "react-icons/fa";
import Posts from "@/app/(Innerpage)/(components)/Posts";
import moment from "moment";
import ChallengeHomeCard from "@/app/(Innerpage)/(components)/ChallengeHomeCard";

import { useAppSelector } from "@/lib/hooks";

const PageDetails = () => {
  const user = useAppSelector((state) => state.auth.user);
  // const user = { id: 1 };

  const page_id = 1;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [postData, setPostData] = useState([]);
  const [quizState, setQuizState] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [activeRouteIndex, setActiveRouteIndex] = useState("sixth");
  const [subActiveRouteIndex, setSubActiveRouteIndex] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // if (!user || !user?.id) {
      //   // If user or user?.id doesn't exist, skip the fetch
      //   return;
      // }
      setIsLoading(true);
      const [postsResponse, movieResponse, departmentResponse] =
        await Promise.all([
          axios.get(
            `${baseURL}/getPagePosts.php?page_id=${page_id}&userId=${
              user?.id ? user.id : null
            }`
          ),

          axios.get(
            `${baseURL}/getDetailsInnerpage.php?id=${page_id}&userId=${
              user?.id ? user.id : null
            }`
          ),
          axios.get(`${baseURL}/getAlldepartment.php?id=${page_id}`),
        ]);
      // Update state in batch
      setPostData(postsResponse.data);
      setSelectedMovie(movieResponse.data);
      setDepartments(departmentResponse.data);
      setSubActiveRouteIndex(
        departmentResponse?.data[0]?.id ? departmentResponse?.data[0]?.id : null
      );
    } catch (error) {
      console.error("Error while fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, page_id]);
  useEffect(() => {
    console.log(activeRouteIndex);
    const fetchQuiz = async () => {
      if (activeRouteIndex == "fourth" || activeRouteIndex == "third") {
        if (setActiveRouteIndex) {
          try {
            const response = await axios.get(
              `${baseURL}/getEachQuiz.php?userId=${
                user?.id ? user.id : null
              }&page_id=${page_id}&dep_id=${subActiveRouteIndex}&page_type=${activeRouteIndex}`
            );
            console.log(response.data)
            if (response.data) {
              setQuizState(response.data);
            }
          } catch (error) {
            console.error("Error while fetching quiz");
          }
        }
      }
    };
    fetchQuiz();
  }, [subActiveRouteIndex, activeRouteIndex]);
  useEffect(() => {
    fetchData();
  }, []);

  const [routes] = useState([
    { key: "sixth", title: "Community" },
    { key: "third", title: "Jobs" },
    { key: "fourth", title: "Internship" },
  ]);

  const ThirdRoute = () => {
    return (
      <div className="w-full  h-full  p-1 flex-col flex gap-2">
        {quizState?.challenges_by_district &&
          Object.keys(quizState.challenges_by_district).length > 0 &&
          Object.keys(quizState.challenges_by_district).map(
            (districtName, index) => (
              <div className="bg-white w-full p-2" key={index}>
                <p className="font-bold mb-2">{districtName}</p>
                <div className="flex gap-3 w-full overflow-x-scroll">
                  {quizState.challenges_by_district[districtName] &&
                    quizState.challenges_by_district[districtName].length > 0 &&
                    quizState.challenges_by_district[districtName].map(
                      (item, itemIndex) => {
                        let formattedEndDate;
                        let formattedDate;
                        formattedDate = moment(item.start_date).fromNow();
                        const endDate = moment(item.end_date);
                        const now = moment();

                        const duration = moment.duration(endDate.diff(now));

                        if (duration.asDays() >= 1) {
                          formattedEndDate =
                            Math.round(duration.asDays()) + " days";
                        } else if (duration.asHours() >= 1) {
                          formattedEndDate =
                            Math.floor(duration.asHours()) +
                            ":" +
                            (duration.minutes() < 10 ? "0" : "") +
                            duration.minutes() +
                            " hrs";
                        } else {
                          formattedEndDate = duration.minutes() + " minutes";
                        }

                        return (
                          <ChallengeHomeCard
                            key={itemIndex}
                            item={item}
                            formattedDate={formattedDate}
                            formattedEndDate={formattedEndDate}
                            inPage={true}
                          />
                        );
                      }
                    )}
                </div>
              </div>
            )
          )}
      </div>
    );
  };

  const SixthRoute = () => {
    return (
      <div className="w-full h-full grid grid-cols-12 gap-3 p-3">
        {postData?.length > 0 &&
          postData?.map((item, index) => {
            return (
              <Posts
                key={index}
                item={item}
                user_id={user?.id ? user?.id : null}
              />
            );
          })}
      </div>
    );
  };
  const renderContent = () => {
    switch (activeRouteIndex) {
      case "third":
        return <ThirdRoute />;
      case "fourth":
        return <ThirdRoute />;

      case "sixth":
        return <SixthRoute />;

      default:
        return <ThirdRoute />;
    }
  };
  return (
    <div className="max-w-[600px] h-screen bg-white border  w-full mx-auto ">
      {isLoading ? (
        <div className=" w-full h-full flex flex-1 justify-center items-center ">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className=" relative  ">
            <Image
              src={baseImgURL + selectedMovie?.banner}
              fill
              className=" -z-[10] absolute "
              objectFit="cover"
            />
            <div className=" -z-[10] absolute w-full h-full bg-black/60 " />
            <div className="flex justify-between w-full p-3">
              <div className="flex gap-3">
                <div
                  className={cn(
                    " relative  h-24 rounded-full w-24 border-[3.5px] bg-white border-orange-400"
                  )}
                >
                  {selectedMovie?.image?.length > 0 && (
                    <Image
                      src={baseImgURL + selectedMovie?.image}
                      fill
                      alt="Profile Image"
                      className="rounded-full object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-2 py-3 font-bold text-white">
                  <p>{selectedMovie?.title}</p>
                  <p className="text-sm">Company</p>
                </div>
              </div>
            </div>

            <div className=" flex justify-around w-full  p-3 bg-black/30 items-center mt-3">
              {routes.map((route, index) => {
                return (
                  <div
                    onClick={() => setActiveRouteIndex(route.key)}
                    key={index}
                    className={cn(
                      " cursor-pointer  text-white whitespace-nowrap",
                      activeRouteIndex === route.key ? "font-bold" : ""
                    )}
                  >
                    {route.title}
                  </div>
                );
              })}
            </div>
            {(activeRouteIndex == "third" || activeRouteIndex == "fourth") && (
              <div className=" flex p-3 bg-black/30 items-center gap-10 border-t overflow-x-scroll">
                {departments.map((department, index) => {
                  return (
                    <div
                      onClick={() => setSubActiveRouteIndex(department.id)}
                      key={department.id}
                      className={cn(
                        " cursor-pointer text-white whitespace-nowrap",
                        subActiveRouteIndex === department.id ? "font-bold" : ""
                      )}
                    >
                      {department.department}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default PageDetails;
