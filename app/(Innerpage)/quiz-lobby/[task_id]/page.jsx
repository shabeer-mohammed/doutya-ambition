"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/lib/baseData";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/QuizProvider";
import { useAppSelector } from "@/lib/hooks";

const LobbyScreen = ({ params }) => {
  const [quizData, setQuizData] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [countdown3, setCountdown3] = useState(-2);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const user = useAppSelector((state) => state.auth.user);
  // const user = { id: 5 };
  const task_id = params.task_id;
  const { setQuizDatas } = useGlobalContext();
  useEffect(() => {
    if (!quizData) return;

    const startTime = new Date(quizData.start_time);
    const timeDifferenceInSeconds = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000
    );

    const quizDurationInSeconds =
      quizData.duration_hours * 3600 + quizData.duration_minutes * 60;

    const calculatedProgressPercentage = Math.min(
      (timeDifferenceInSeconds / quizDurationInSeconds) * 100,
      100
    );

    setProgressPercentage(calculatedProgressPercentage);
  }, [quizData, currentTime]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getSingleQuiz.php?userId=${user?.id}&task_id=${task_id}`
          );

          if (response.status === 200) {
            setQuizData(response.data.challenges);
          } else {
            console.error("Failed to fetch quiz");
          }
        } catch (error) {
          console.error("Error while fetching quiz:", error.message);
        }
      }
    };

    fetchQuiz();
  }, [user]);

  const convertTime = () => {
    const hrs = Math.floor(countdown3 / 3600);
    const mins = Math.floor((countdown3 % 3600) / 60);
    const secs = countdown3 % 60;
    setHours(hrs);
    setMinutes(mins);
    setSeconds(secs);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    convertTime();
  }, [quizData, countdown3]);

  const handleQuiz = () => {
    if (quizData) {
      gotoQuiz(quizData.challenge_id);
    } else {
      alert("Quiz data is not available.");
    }
  };

  const gotoQuiz = async (challenge_id) => {
    try {
      const response2 = await axios.post(
        `${baseURL}/createUserQuiz.php`,
        {
          user_id: user.id,
          challenge_id: challenge_id,
          task_id:task_id
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response2.data.success) {
        const quizDatas = {
          currentIndex: 0,
          dataQuiz: quizData,
          user: user,
          live: quizData.live,
        };

        // Serialize the object into a JSON string
        const serializedQuizDatas = JSON.stringify(quizDatas);

        // Store the serialized object in LocalStorage
        await localStorage.setItem("quizDatas", serializedQuizDatas);

        // Set state with the deserialized object
        setQuizDatas(quizDatas);

        router.replace("/quiz-page");
      }
    } catch (error) {
      console.error("Error2:", error);
    }
  };

  useEffect(() => {
    if (quizData) {
      const quizStartTime = new Date();
      const [hours, minutes, seconds] = quizData.start_time.split(":");
      quizStartTime.setHours(
        parseInt(hours, 10),
        parseInt(minutes, 10),
        parseInt(seconds, 10)
      );

      const differenceInMilliseconds = currentTime - quizStartTime;
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

      if (currentTime > quizStartTime) {
        setCompleted(true);
      }

      if (quizStartTime > currentTime) {
        setCountdown(Math.abs(differenceInSeconds));
        setCountdown3(Math.abs(differenceInSeconds));
      }
    }
  }, [quizData]);

  useEffect(() => {
    if (quizData && quizData.live === "yes" && countdown3 >= 0) {
      const secondminus = setInterval(() => {
        setCountdown3((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(secondminus);
    }
  }, [quizData, countdown3]);
  useEffect(() => {
    if (countdown3 === 0) {
      handleQuiz();
    }
    console.log(countdown3);
  }, [countdown3]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {quizData ? (
        <button
          className="bg-white shadow-md rounded-lg p-6 m-4 w-80 flex flex-col items-center"
          onClick={handleQuiz}
          disabled={quizData.live === "yes" ? true : false}
        >
          <span className="text-xl font-bold mb-4">Welcome</span>
          {quizData.live === "yes" && completed && (
            <span className="text-center text-red-500 text-lg font-bold">
              Oops!..Quiz has been already started
            </span>
          )}
          {quizData.live === "yes" && !completed && (
            <div className="flex flex-row gap-4 my-4">
              <div className="text-center">
                <span className="bg-yellow-500 rounded-lg py-2 px-4 text-2xl font-bold">
                  {hours}
                </span>
                <span className="block text-sm font-medium mt-3">Hours</span>
              </div>
              <div className="text-center">
                <span className="bg-yellow-500 rounded-lg py-2 px-4 text-2xl font-bold">
                  {minutes}
                </span>
                <span className="block text-sm font-medium mt-3">Minutes</span>
              </div>
              <div className="text-center">
                <span className="bg-yellow-500 rounded-lg py-2 px-4 text-2xl font-bold">
                  {seconds}
                </span>
                <span className="block text-sm font-medium mt-3">Seconds</span>
              </div>
            </div>
          )}
          {quizData.live === "no" && (
            <button
              onClick={handleQuiz}
              className="px-5 py-3 bg-red-500 rounded-lg text-white font-bold"
            >
              Start
            </button>
          )}
        </button>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}
    </div>
  );
};

export default LobbyScreen;
