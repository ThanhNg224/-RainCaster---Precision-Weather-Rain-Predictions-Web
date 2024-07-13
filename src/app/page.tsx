"use client";
import { ILocation, IWeather } from "@/interface/interface";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const styling1 = {
  backgroundImage: `url('/weatherCard.jpg')`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "cover",
};

const recentSearch = [
  "Hai Phong",
  "Ha Noi",
  "Ho Chi Minh City",
  "Da Nang",
  "Bac Ninh",
  "Cao Bang",
  "Ha Nam",
  "Nghe An",
];

export default function Home() {
  const [searchedText, setSearchedText] = useState<string>("");
  const [weatherDetails, setWeatherDetails] = useState<IWeather>({} as IWeather);
  const [locationDetails, setLocationDetails] = useState<ILocation>({} as ILocation);
  const [rainPrediction, setRainPrediction] = useState<string>("Loading...");

  const searchFieldInputHandler = (e: HTMLInputElement | any) => {
    e.preventDefault();
    setSearchedText(e.target.value);
  };

  const initial = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=25910174a87a4c63a6c141019230506&q=Haiphong&aqi=nos`
      );
      if (response.data) {
        setLocationDetails(response.data.location);
        setWeatherDetails(response.data.current);
        setSearchedText("");
        predictRain(response.data.current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  const search = async () => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=25910174a87a4c63a6c141019230506&q=${searchedText}&aqi=no`
      );
      if (response.data) {
        setLocationDetails(response.data.location);
        setWeatherDetails(response.data.current);
        setSearchedText("");
        predictRain(response.data.current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchWith = async (name: string | any) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=25910174a87a4c63a6c141019230506&q=${name}&aqi=no`
      );
      if (response.data) {
        setLocationDetails(response.data.location);
        setWeatherDetails(response.data.current);
        setSearchedText("");
        predictRain(response.data.current);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/current.json?key=25910174a87a4c63a6c141019230506&q=${latitude},${longitude}&aqi=no`
          );
          if (response.data) {
            setLocationDetails(response.data.location);
            setWeatherDetails(response.data.current);
            setSearchedText("");
            predictRain(response.data.current);
          }
        } catch (error) {
          console.log("An error occurred while fetching the city name!", error);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Geolocation request denied. Please reset location permission to grant access again.");
        } else {
          alert("Geolocation request error. Please reset location permission.");
        }
      }
    );
  };

  const predictRain = async (weatherData: IWeather) => {
    const API_URL = 'http://127.0.0.1:5000/predict'; 
  
    const data = {
      min_temp: weatherData.temp_c - 5,  // Adjust as needed
      max_temp: weatherData.temp_c + 5,  // Adjust as needed
      humidity: weatherData.humidity,
      pressure: weatherData.pressure_mb,
      wind: weatherData.wind_kph
    };
  
    try {
      const response = await axios.post(API_URL, data);
      console.log("API Response:", response.data);  // Log the response data for debugging
      if (response.data) {
        setRainPrediction(response.data.prediction);
      } else {
        setRainPrediction("Error: No prediction data");
      }
    } catch (error) {
      console.error('Error predicting rain:', error);
      setRainPrediction("Error predicting rain");
    }
  };
  

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center relative bg-gradient-to-tl bg-opacity-80 bg-orange-600 from-gray-500">
      {weatherDetails?.condition && (
        <div
          className="flex lg:w-7/8 w-11/12 mx-auto rounded-tl-2xl lg:flex-row flex-col rounded-br-2xl"
          style={styling1}
        >
          <div className="lg:w-4/6 w-4/5 lg:relative bg-opacity-50 mx-auto lg:h-[560px] h-300px lg:p-0 p-3">
            <div className=" p-1 lg:my-7 my-4 ml-16">
              <Image
                src={`https:${weatherDetails?.condition?.icon}`}
                width={150}
                height={150}
                alt="Weather icon"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:absolute lg:bottom-10 lg:left-0 lg:right-0 text-center flex lg:flex-row flex-col lg:justify-center justify-between items-center lg:gap-10 gap-3"
            >
              <p className="lg:text-8xl text-5xl font-sans font-semibold text-gray-100 flex items-center">
                {Math.round(weatherDetails.temp_c)}{" "}
                <sup className="lg:text-5xl text-2xl">o </sup>
                <span className="lg:text-7xl text-4xl"> C</span>
              </p>
              <div className="lg:w-[30%] w-full">
                <p className="lg:text-4xl text-xl text-gray-100">
                  {locationDetails.country}
                </p>
                <p className="text-gray-100 lg:text-sm text-xs">
                  <span className="font-semibold text-md">
                    {locationDetails.name}{" "}
                  </span>
                  {locationDetails.localtime}
                </p>
              </div>
              <div className="text-md text-gray-200 lg:block hidden">
                <p className="lg:text-lg text-sm text-gray-100">
                  {weatherDetails?.condition?.text}
                </p>
                <small className="flex flex-col">
                  <span>Humidity: {weatherDetails.humidity}%</span>
                  <span>Wind:{weatherDetails.wind_kph} km/h</span>
                </small>
                <p id="prediction" className="text-gray-100 lg:text-lg text-sm">
                  Rain Prediction: <span id="result">{rainPrediction}</span>
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex-grow bg-opacity-70 bg-slate-600 rounded-br-2xl p-4 relative">
            <div className="w-full p-2 flex items-center">
              <input
                value={searchedText}
                type="text"
                onChange={searchFieldInputHandler}
                className="text-gray-100 flex-grow bg-transparent border rounded-md px-2 py-1 border-gray-100"
                placeholder="Search here"
              />
              <button
                onClick={search}
                className="py-1 px-4 ml-2 bg-white text-amber-600 rounded"
              >
                Search
              </button>
              <button
                onClick={getUserCoordinates}
                className="py-1 px-4 ml-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300"
              >
                Location
              </button>
            </div>

            <div className="my-4 p-2">
              <p className="font-light text-white">Recent search</p>
              <hr />
              <div className="my-3  flex flex-col gap-2">
                {recentSearch.map((place: string) => (
                  <p
                    onClick={() => searchWith(`${place}`)}
                    key={place}
                    className="cursor-pointer text-gray-100 bg-gray-700 bg-opacity-40 px-3 py-1 rounded hover:bg-gray-200 hover:text-amber-700 hover:scale-105 duration-300"
                  >
                    {place}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
