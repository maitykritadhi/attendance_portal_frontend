import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loader from "./Loader"; // Import the Loader component
import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";


const ChooseCourse = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const [isFetching, setIsFetching] = useState(true); // State to track data fetching

  const location = useLocation();
  const navigate = useNavigate();
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [courses, setCourses] = useState([]);
  const selectedDayId = location?.state?.selectedDay;

  useEffect(() => {
    async function fetchCourseList() {
      try {
        setIsFetching(true); // Start fetching, show the loader
        const response = await axios.get(`${baseUrl}api/prof/chooseCourse`, {
          headers: {
            authorization: sessionToken,
            dayid: selectedDayId,
          },
        });

        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course list:", error);
      } finally {
        setIsFetching(false); // Stop fetching, hide the loader
      }
    }

    if (selectedDayId) {
      fetchCourseList();
    }
  }, [sessionToken, selectedDayId, baseUrl]); // Include selectedDayId in the dependency array

  const handleGoBackToHomePage = () => {
    navigate("/");
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <>
      <div className="course-list-container">
        <h2>Choose a Course</h2>
        {isFetching ? (
          <Loader /> // Show the loader while fetching
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course.id} className="course-list-item">
                Course ID: {course.id}, Course Name: {course.cname}
                {"   =>  "}
                <Link
                  to={`/chooseday/choosecourse/${course.id}/${course.cname}`}
                  className="course-link"
                >
                  View Students
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="back-button" onClick={handleGoBackToHomePage}>
        Go Back To Home Page
      </button>
    </>
  );
};

export default ChooseCourse;
