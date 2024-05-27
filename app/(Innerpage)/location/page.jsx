"use client";
import { GOOGLE_MAPS_APIKEY, baseImgURL, baseURL } from "@/lib/baseData";
import { cn } from "@/lib/utils";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import ChallengeHomeCard from "../(components)/ChallengeHomeCard";
import moment from "moment";
import Leader from "../(components)/Leader";

const page = () => {
  const [location, setLocation] = useState(null);
  const user = { id: 24 };
  const [error, setError] = useState(null);
  const [leaderData, setLeaderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [india, setIndia] = useState("no");
  const [visiblePopup2, setVisiblePopup2] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [district, setDistrict] = useState("");
  const [filterChallenges, setFilterChallenges] = useState([]);
  const [challengesNormal, setChallengesNormal] = useState([]);
  const [bootcamp, setBootcamp] = useState([]);
  const [challengeState, setChallengeState] = useState([]);
  const [streakState, setstreakState] = useState([]);
  const [referralState, setreferralState] = useState([]);
  const [treasureState, settreasureState] = useState([]);
  const [imagesNear, setImagesNear] = useState();
  const [allStates, setAllStates] = useState([]);
  const [contestData, setContestData] = useState([]);

  const [toggleNav, setToggleNav] = useState("Places");
  const handleToggle = (value) => {
    setToggleNav(value);
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);
  useEffect(() => {
    (async () => {
      if (location) {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_APIKEY}`
          );
          const addressComponents = response.data.results[0].address_components;
          const districtComponent = addressComponents.find((component) =>
            component.types.includes("administrative_area_level_3")
          );
          setDistrict(districtComponent.long_name);
        } catch (error) {
          console.error("Error fetching district:", error);
        }
      }
    })();
  }, [location]);
  useEffect(() => {
    const fetchallenge = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getFullVisit.php?userId=${user.id}&district=${district}&india=${india}&visit=yes`
          );

          if (response.status === 200) {
            setFilterChallenges(response.data.data);
            setImagesNear(response.data.image);
            // console.log(response.data.data);
          } else {
            console.error("Failed to fetch challenges");
          }
        } catch (error) {
          console.error("Error while fetching challenges:", error.message);
        }
      }
    };
    fetchallenge();
    const fetchFull = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getAllSubChallenges.php?userId=${user.id}&district=${district}&india=${india}&visit=yes`
          );

          if (response.status === 200) {
            setAllStates(response.data);
            //   console.log(response.data);
            // console.log(response.data);
          } else {
            console.error("Failed to fetch challenges");
          }
        } catch (error) {
          console.error("Error while fetching challenges:", error.message);
        }
      }
    };
    fetchFull();
    const fetchallenges = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getTrendingState.php?userId=${user.id}&district=${district}&india=${india}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            setChallengesNormal(response.data);
            // console.log(response.data.challenges);
          } else {
            console.error("Failed to fetch challenge");
          }
        } catch (error) {
          console.error("Error while fetching challenge:", error.message);
        }
      }
    };
    fetchallenges();
    const fetchBootcamp = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getBootcampVisit.php?userId=${user.id}&district=${district}&india=${india}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            setBootcamp(response.data);
            // console.log(response.data.challenges);
          } else {
            console.error("Failed to fetch challenge");
          }
        } catch (error) {
          console.error("Error while fetching challenge:", error.message);
        }
      }
    };
    fetchBootcamp();
    const fetChallengeState = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getChallengeVisit.php?userId=${user.id}&district=${district}&india=${india}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            setChallengeState(response.data);
            // console.log(response.data.challenges);
          } else {
            console.error("Failed to fetch challenge");
          }
        } catch (error) {
          console.error("Error while fetching challenge:", error.message);
        }
      }
    };
    fetChallengeState();

    const fetchStreak = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getStreakState.php?userId=${user.id}&district=${district}&india=${india}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            // setstreakState(response.data);
            // console.log(response.data.challenges);
          } else {
            console.error("Failed to fetch challenge");
          }
        } catch (error) {
          console.error("Error while fetching challenge:", error.message);
        }
      }
    };
    fetchStreak();
    const fetchTreasure = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getTreasureState.php?userId=${user.id}&district=${district}&india=${india}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            settreasureState(response.data);
            // console.log(response.data.challenges);
          } else {
            console.error("Failed to fetch challenge");
          }
        } catch (error) {
          console.error("Error while fetching challenge:", error.message);
        }
      }
    };
    fetchTreasure();
    const fetchContest = async () => {
      if (user && district) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getContestState.php?userId=${user.id}&district=${district}&india=${india}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            setContestData(response.data);
            // console.log(response.data.challenges);
          } else {
            console.error("Failed to fetch challenge");
          }
        } catch (error) {
          console.error("Error while fetching challenge:", error.message);
        }
      }
    };
    fetchContest();

    const fetchLeader = async () => {
      try {
        const response = await axios.get(`${baseURL}/getChallengeLeader.php`);

        if (response.status === 200) {
          setLeaderData(response.data.data);
          // console.log(response.data.data);
          // console.log(response.data);
        } else {
          console.error("Failed to fetch leader");
        }
      } catch (error) {
        console.error("Error while fetching leader:", error.message);
      }
    };

    fetchLeader();
  }, [district, user]);
  const PlacesRoute = () => {
    return (
      <div className=" w-full h-full mt-2 bg-white ">
        {allStates &&
          allStates?.districtsData?.length > 0 &&
          allStates?.districtsData.map((item, index) => {
            return (
              <div className="p-3 ">
                <div className="flex gap-3 items-center ">
                  <div className="relative h-10 w-8">
                    <Image
                      src={`${baseImgURL + imagesNear}`}
                      className="rounded-md"
                      fill
                    />
                  </div>
                  <p className="font-bold">{item.title}</p>
                </div>
                <div className="flex gap-2 ">
                  {item.challenges &&
                    item.challenges?.map((newItem, index) => {
                      let formattedEndDate;
                      let formattedDate;
                      formattedDate = moment(newItem.start_date).fromNow();
                      const endDate = moment(newItem.end_date);
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
                          key={index}
                          item={newItem}
                          formattedDate={formattedDate}
                          formattedEndDate={formattedEndDate}
                          inPage={true}
                          inMap={true}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}
      </div>
    );
  };
  const ChallengesRoute = () => {
    return (
      <div className=" w-full h-full mt-5 bg-white space-y-4">
        {bootcamp?.challenges && bootcamp?.challenges?.length > 0 && (
          <div className="p-2">
            <p className="text-sm font-bold">Bootcamp</p>
            <div className="flex gap-3">
              {bootcamp?.challenges.map((item, index) => {
                let formattedEndDate;
                let formattedDate;
                formattedDate = moment(item.start_date).fromNow();
                const endDate = moment(item.end_date);
                const now = moment();

                const duration = moment.duration(endDate.diff(now));

                if (duration.asDays() >= 1) {
                  formattedEndDate = Math.round(duration.asDays()) + " days";
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
                    key={index}
                    item={item}
                    formattedDate={formattedDate}
                    formattedEndDate={formattedEndDate}
                    inPage={true}
                  />
                );
              })}
            </div>
          </div>
        )}
        {challengeState?.challenges &&
          challengeState?.challenges?.length > 0 && (
            <div className="p-2">
              <p className="text-sm font-bold">Challenges</p>
              <div className="flex gap-3">
                {challengeState?.challenges.map((item, index) => {
                  let formattedEndDate;
                  let formattedDate;
                  formattedDate = moment(item.start_date).fromNow();
                  const endDate = moment(item.end_date);
                  const now = moment();

                  const duration = moment.duration(endDate.diff(now));

                  if (duration.asDays() >= 1) {
                    formattedEndDate = Math.round(duration.asDays()) + " days";
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
                      key={index}
                      item={item}
                      formattedDate={formattedDate}
                      formattedEndDate={formattedEndDate}
                      inPage={true}
                    />
                  );
                })}
              </div>
            </div>
          )}
        {streakState?.challenges && streakState?.challenges?.length > 0 && (
          <div className="p-2">
            <p className="text-sm font-bold">Streak</p>
            <div className="flex gap-3">
              {streakState?.challenges.map((item, index) => {
                let formattedEndDate;
                let formattedDate;
                formattedDate = moment(item.start_date).fromNow();
                const endDate = moment(item.end_date);
                const now = moment();

                const duration = moment.duration(endDate.diff(now));

                if (duration.asDays() >= 1) {
                  formattedEndDate = Math.round(duration.asDays()) + " days";
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
                    key={index}
                    item={item}
                    formattedDate={formattedDate}
                    formattedEndDate={formattedEndDate}
                    inPage={true}
                  />
                );
              })}
            </div>
          </div>
        )}
        {treasureState?.challenges && treasureState?.challenges?.length > 0 && (
          <div className="p-2">
            <p className="text-sm font-bold">Treasure Hunt</p>
            <div className="flex gap-3">
              {treasureState?.challenges.map((item, index) => {
                let formattedEndDate;
                let formattedDate;
                formattedDate = moment(item.start_date).fromNow();
                const endDate = moment(item.end_date);
                const now = moment();

                const duration = moment.duration(endDate.diff(now));

                if (duration.asDays() >= 1) {
                  formattedEndDate = Math.round(duration.asDays()) + " days";
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
                    key={index}
                    item={item}
                    formattedDate={formattedDate}
                    formattedEndDate={formattedEndDate}
                    inPage={true}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  const ContestRoute = () => {
    return (
      <div className=" w-full h-full mt-5 bg-white space-y-4">
        {contestData?.challenges && contestData?.challenges?.length > 0 && (
          <div className="p-2">
            <p className="text-sm font-bold">Contest</p>
            <div className="flex gap-3">
              {contestData?.challenges.map((item, index) => {
                let formattedEndDate;
                let formattedDate;
                formattedDate = moment(item.start_date).fromNow();
                const endDate = moment(item.end_date);
                const now = moment();

                const duration = moment.duration(endDate.diff(now));

                if (duration.asDays() >= 1) {
                  formattedEndDate = Math.round(duration.asDays()) + " days";
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
                    key={index}
                    item={item}
                    formattedDate={formattedDate}
                    formattedEndDate={formattedEndDate}
                    inPage={true}
                  />
                );
              })}
            </div>
          </div>
        )}
       
      </div>
    );
  };
  const LeaderboardRoute = () => {
    return <div className="w-full h-full p-3 bg-white">
    <div>
      <p className="text-slate-500 font-bold text-xs">
        Total {leaderData?.length} Participants
      </p>

      <div className="mt-3 flex justify-between items-center">
        <p className="font-bold text-slate-500">Ranking</p>
        <p className="font-bold text-slate-500">Points</p>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-3 w-full">
        {leaderData?.length > 0 &&
          leaderData?.map((item, index) => {
            return (
              <div key={index} className=" col-span-12">
                <Leader item={item} />
              </div>
            );
          })}
      </div>
    </div>
  </div>;
  };
  const RenderData = () => {
    switch (toggleNav) {
      case "Places":
        return <PlacesRoute />;
      case "Challenges":
        return <ChallengesRoute />;
      case "Contest":
        return <ContestRoute />;
      case "Leaderboard":
        return <LeaderboardRoute />;
      default:
        return <PlacesRoute />;
    }
  };
  return (
    <div className=" h-full w-full">
      {district && (
        <div className="flex font-bold   w-full my-2 justify-center items-center">
          <IoLocationSharp color="gray" /> <p>{district}</p>
        </div>
      )}
      <div className="flex justify-between items-center shadow">
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white text-sm font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Places" && "border-b border-black"
          )}
          onClick={() => handleToggle("Places")}
        >
          Places
        </p>
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white text-sm font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Challenges" && "border-b border-black"
          )}
          onClick={() => handleToggle("Challenges")}
        >
          Challenges
        </p>
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white text-sm font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Contest" && "border-b border-black"
          )}
          onClick={() => handleToggle("Contest")}
        >
          Contest
        </p>
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white text-sm font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Leaderboard" && "border-b border-black"
          )}
          onClick={() => handleToggle("Leaderboard")}
        >
          Leaderboard
        </p>
      </div>
      <div className="bg-white overflow-x-scroll">{RenderData()}</div>
    </div>
  );
};

export default page;
