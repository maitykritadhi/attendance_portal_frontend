import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import axios from "axios";

import "./Home.css"; // Import the CSS file

import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const Home = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const sessionToken = localStorage.getItem("token"); // Assuming you store the session token in local storage
  const typeofuser = localStorage.getItem("userType");
  const [userType, setUserType] = useState(); // Default user type
  //   console.log('gnfgn',sessionToken);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions (e.g., clear token, user data, etc.)
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.clear();
    navigate("/login");
  };

  const handleUserTypeChange1 = () => {
    setUserType("1");
  };

  const handleUserTypeChange2 = () => {
    setUserType("2");
  };

  const handleUserTypeChange3 = () => {
    setUserType("3");
  };

  const handleSubmit = () => {
    if (userType === "1") {
      navigate("/courses"); // Navigate to the assigned courses page
    } else if (userType === "2") {
      const headers = {
        // Add your headers here
        authorization: sessionToken, // Example custom header
      };

      // Call the API using Axios
      axios
        .get(`${baseUrl}api/prof/chooseDate`, { headers })
        .then((response) => {
          console.log(response);
          const selectedDay = response.data[0]["dayid"]; // Assuming the API returns the selected day
          console.log(selectedDay);

          // Navigate to the '/chooseday/choosecourse' route with the selectedDay parameter
          navigate("/chooseday/choosecourse", { state: { selectedDay } });
        })
        .catch((error) => {
          console.error("Error while fetching data:", error);
        });

      // navigate("/chooseday"); // Navigate to the mark attendance page
    } else if (userType === "3") {
      navigate("/uchoosedate");
    }
  };

  const handleCheckEnquiryOfStudents = () => {
    navigate("/profreceiveenquiry");
  };

  if (!sessionToken) {
    // navigate("/login");
    return <Navigate to="/login" replace />;
    // return null;
  }

  if (sessionToken && typeofuser === "student") {
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <>
      <div className="welcome-message">
        <h1>Welcome to the Home Page</h1>
      </div>

      <div className="form-container">
        <div className="mb-3">
          <label>
            <h2>Select Option</h2>
          </label>
          <div>
            <label className="radio-label">
              <input
                type="radio"
                value="1"
                checked={userType === "1"}
                onChange={handleUserTypeChange1}
              />
              Assign Student Courses
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="2"
                checked={userType === "2"}
                onChange={handleUserTypeChange2}
              />
              Mark Attendance
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="3"
                checked={userType === "3"}
                onChange={handleUserTypeChange3}
              />
              Update Attendance
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary submit-button"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <div className="action-buttons">
          <button
            className="enquiry-button"
            onClick={handleCheckEnquiryOfStudents}
          >
            Check Enquiry of Students
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
