import React, { useEffect, useState } from "react";
import WeatherDetail from "./WeatherDetails";
import HourlyForecast from "./HourlyForecast";
import { getCurrentWeather, getAreaName } from "../Apis/weatherApi";


function WeatherDisplay({ threshold,setthreshold }) {

  // Some Basic States
  const [avgDailyTemp, setavgDailyTemp] = useState(0);
  const [maxMinTemp, setmaxMinTemp] = useState({ max: 0,min: 0});
  const [tempImgSrc, settempImgSrc] = useState("")
  const [currentWeatherData, setCurrentWeatherData] = useState(null);
  const [areaName, setareaName] = useState(null);

  // This function will calculate and return today's average temperature 
  function getdailyAverage(hourlyData) {
    let sumTemp = 0,
      numofObservations = 0;
    for (const data of hourlyData) {
      let hour = new Date(data.dt * 1000).getHours();
      if (hour === 0) {
        break;
      }
      sumTemp += data.temp;
      numofObservations++;
    }
    return Math.round(sumTemp / numofObservations);
  }

  // This function will return today's maximum and minimum temperature 
  function getmaxMinTemp(hourlyData) {
    let min = 100000000000000000,
      max = -10000000000000;
    for (const data of hourlyData) {
      let hour = new Date(data.dt * 1000).getHours();
      if (hour === 0) {
        break;
      }
      let temp = data.temp;
      if (temp > max) max = temp;
      if (temp < min) min = temp;
    }
    return { max, min };
  }

  // This Functions bind weather images with different weather conditions 
  function getweatherPicture(weatherCondition){
    if(weatherCondition.toLowerCase()==='clouds')
      return "../images/clouds.png"
    if(weatherCondition.toLowerCase()==='rain')
      return "../images/rain.png"
    if(weatherCondition.toLowerCase()==='clear')
      return "../images/sun.png"
    if(weatherCondition.toLowerCase()==='wind')
      return "../images/wind.png"
    
  }
  

  useEffect(() => {
    // This function takes user's latitude and longitude then fetch and return all the data from API 
    async function getData(latitude, longitude) {
      const response = await getCurrentWeather(latitude, longitude);
      const areaName = await getAreaName(latitude, longitude);

      if (response.current.temp > localStorage.getItem("threshold")) {
        alert("Temperature is above threshold value !!");
      }

      settempImgSrc(getweatherPicture(response.current.weather[0].main))
      setavgDailyTemp(getdailyAverage(response.hourly));
      setmaxMinTemp(getmaxMinTemp(response.hourly));
      setareaName(areaName);
      setCurrentWeatherData(response);
    }

    // It gets the user's Geo coordinates and calls the API with the following longitude and lattitude
    // It will make an API call after every 5 minutes to update the info 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getData(latitude, longitude);
          setInterval(() => {
            getData(latitude, longitude);
          }, 300000);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

  }, []);

  // This function take care value change of threshold input
  function handleThresholdChange(e) {
    localStorage.setItem("threshold",e.target.value)
    setthreshold(e.target.value);
  }

  // This will render loader till the data is not yet fetched
  if (!currentWeatherData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="main">
        <div className="weather-display">
          <header className="weather-header">
            <h1>{areaName.results[0].city}</h1>
            <p>{currentWeatherData.current.dt}</p>
          </header>
          <div>
            <label>Threshold Temperature : </label><input name={threshold} onChange={handleThresholdChange} value={threshold}></input>
          </div>
        </div>
        <div className="weather-container">
          <main className="weather-main">
            <img src={tempImgSrc} alt="weather condition"></img>
            <div id="weather-temp" className="weather-temp">
              {currentWeatherData.current.temp}°
            </div>
            <div className="weather-condition">
              {currentWeatherData.current.weather[0].main}
            </div>
          </main>

          <section className="weather-details">
            <WeatherDetail
              label="Wind"
              value={`${currentWeatherData.current.wind_speed} mps`}
            />
            <WeatherDetail
              label="Feels like"
              value={`${currentWeatherData.current.feels_like}°`}
            />
            <WeatherDetail label="Daily Avg" value={`${avgDailyTemp}°`} />
            <WeatherDetail label="Max Temp" value={`${maxMinTemp.max}°`} />
            <WeatherDetail label="Min Temp" value={`${maxMinTemp.min}°`} />
            <WeatherDetail
              label="Sunrise"
              value={currentWeatherData.current.sunrise}
            />
            <WeatherDetail
              label="Sunset"
              value={currentWeatherData.current.sunset}
            />
          </section>
        </div>

        <section className="weather-forecast">
          <hr></hr>
          <p>Today's weather</p>
          <HourlyForecast getweatherPicture={getweatherPicture} forecast={currentWeatherData.daily.slice(1)} />
        </section>
      </div>
    </>
  );
}

export default WeatherDisplay;
