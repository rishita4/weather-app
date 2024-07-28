import React from 'react';

function WeatherDetails({label, value}){
    return (
        <div className="weather-detail">
            <span className="detail-label">{value}</span>
            <span className="detail-value">{label}</span>
        </div>
    )
}

export default WeatherDetails;