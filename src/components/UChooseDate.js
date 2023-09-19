import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./UChooseDate.css";
import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const UChooseDate = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const [selectedDate, setSelectedDate] = useState(new Date());
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate(); // Add this line to get the navigate function

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleUpdateDate = async () => {
    try {
      const selectedDateWithOffset = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const formattedDate = selectedDateWithOffset.toISOString().split("T")[0];
      //   const formattedDate = "2023-08-01";
      console.log(formattedDate);
      console.log(typeof formattedDate);

      // Store formattedDate in local storage
      localStorage.setItem("formattedDate", formattedDate);

      const response = await axios.get(
        `${baseUrl}api/prof/getChosenDateUpdation`,
        {
          headers: {
            authorization: sessionToken,
            sdate: formattedDate,
          },
        }
      );
      console.log(response);
      // Get the dayid from the response or calculate it based on your requirement
      const dayid = response.data.dayid; // Assuming the response contains dayid
      console.log(dayid);

      // Store dayid in localStorage
      localStorage.setItem("selectedDayId1", dayid);

      // Navigate to the next page along with dayid as state
      // You can replace "nextPagePath" with the actual path of your next page
      navigate("/uchoosedate/uchoosecourse");

      // You can perform further actions here, such as displaying a success message
    } catch (error) {
      console.error("Error updating date:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }
  
  return (
    <div className="choose-date-container">
      <h2 className="choose-date-title">Choose Date</h2>
      <DatePicker
        className="react-datepicker-wrapper"
        selected={selectedDate}
        onChange={handleDateChange}
        calendarClassName="react-datepicker__calendar"
      />
      <button className="submit-button" onClick={handleUpdateDate}>
        Submit Date
      </button>
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default UChooseDate;
