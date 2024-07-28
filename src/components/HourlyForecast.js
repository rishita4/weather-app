import React from 'react';
// import WeatherIcons from './WeatherIcons';

function HourlyForecast({forecast,getweatherPicture}){
    return(
        <div className="forecast-hourly">
            {forecast.map((day,index)=>{
                if(index>3) return (<></>)
                return(
                    <div key = {day.dt} className="forecast-hour">
                        <div className="forecast-time">{new Date(day.dt * 1000).getDate()}/ {new Date(day.dt * 1000).getMonth()}</div>
                        <img src={getweatherPicture(day.weather[0].main)} alt="weather condition"></img>
                        <div className="forecast-temp">{day.temp.day}°</div>
                    </div>
                )
            })}
        </div>
    );
}

export default HourlyForecast;