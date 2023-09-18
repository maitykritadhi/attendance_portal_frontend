import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";

import "./ChooseDay.css"; // Import the CSS file

import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const ChooseDay = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const navigate = useNavigate();
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");

  const sessionToken = localStorage.getItem("token"); // Fetch the session token
  const typeofuser = localStorage.getItem("userType");

  useEffect(() => {
    // Check if the user is logged in using the session token
    if (!sessionToken) {
      // If the user is not logged in, navigate to the login page
      navigate("/login");
      return;
    }

    // Define and call the fetchDays function
    async function fetchDays() {
      try {
        const response = await axios.get(
          `${baseUrl}api/prof/chooseDate`,
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );

        // You can handle the response here, such as setting the available days
        // For now, let's assume the response data is an array of available days
        setAvailableDays(response.data);
      } catch (error) {
        console.error("Error fetching available days:", error);
      }
    }

    // Call the fetchDays function
    fetchDays();
  }, [navigate, sessionToken, baseUrl]);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleContinue = () => {
    navigate("/chooseday/choosecourse", { state: { selectedDay } });
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <div className="choose-day-container">
      <h2 className="choose-day-title">Choose Attendance Day</h2>
      <select
        className="choose-day-dropdown"
        value={selectedDay}
        onChange={handleDayChange}
      >
        <option value="">Select a Day</option>
        {availableDays.map((day) => (
          <option key={day.dayid} value={day.dayid}>
            {day.dayname}
          </option>
        ))}
      </select>
      <button className="choose-day-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default ChooseDay;
