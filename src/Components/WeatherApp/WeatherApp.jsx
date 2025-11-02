import React, { useState } from "react";
import "../WeatherApp/WeatherApp.css";
import search_icon from "../Assets/search.png";
import clear_icon from "../Assets/clear.png";
import cloud_icon from "../Assets/cloud.png";
import drizzle_icon from "../Assets/drizzle.png";
import rain_icon from "../Assets/rain.png";
import snow_icon from "../Assets/snow.png";
import wind_icon from "../Assets/wind.png";
import humidity_icon from "../Assets/humidity.png";
import Clock from "react-live-clock";

const WeatherApp = () => {

  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const search = async() =>{
    if(!city.trim()) return;

    setError("");
    setData(null);

    // 1) geocoding API (open-meteo)
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
    const gdata = await geo.json();

    if(!gdata.results){
      setError("City not found");
      return;
    }

    const lat = gdata.results[0].latitude;
    const lon = gdata.results[0].longitude;
    const name = gdata.results[0].name + ", " + gdata.results[0].country;

    // 2) real weather API (open-meteo)
    const w = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`);
    const wdata = await w.json();

    const temp = wdata.current.temperature_2m;
    const wind = wdata.current.wind_speed_10m;

    setData({
      location: name,
      temperature: temp,
      wind: wind
    })
  }

  return(
    <div className="container">
      <h1 className="app-heading">Weather App</h1>

      <div className="topbar">
        <input
          className="search-input"
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e)=>setCity(e.target.value)}
        />
        <div className="search-btn" onClick={search}>
            <img src={search_icon} alt=""/>
        </div>
      </div>

      <div className="datetime">
        <Clock format="HH:mm:ss" interval={1000} ticking={true} />
        <div>{new Date().toLocaleDateString()}</div>
      </div>

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="weather-box">
          <h2>{data.location}</h2>
          <h1>{data.temperature}°C</h1>
          <h3>Wind: {data.wind} Km/h</h3>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
          textAlign:"center",
          marginTop:"50px",
          paddingBottom:"30px",
          color:"#cfcfcf",
          fontSize:"14px",
          opacity:"0.7"
      }}>
          Created by: <b>Kartik Tyagi</b><br/>
          Guided by: <b>Dr. R.K Nadesh</b>
      </div>

    </div>
  )
}

export default WeatherApp;




