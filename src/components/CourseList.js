import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./CourseList.css"; // Import the CSS file

import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const CourseList = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourseList() {
      try {
        const response = await axios.get(`${baseUrl}api/prof/getCourses`, {
          headers: {
            authorization: sessionToken,
          },
        });

        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course list:", error);
      }
    }

    fetchCourseList();
  }, [sessionToken, baseUrl]);

  const handleGoBackToHomePage = () => {
    navigate("/");
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <div className="course-list-container">
      <h2>Course List</h2>
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id} className="course-list-item">
            Course ID: {course.id}, Course Name: {course.cname}
            {"   =>  "}
            <Link
              to={`/courses/${course.id}/${course.cname}`}
              className="course-link"
            >
              View Students
            </Link>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={handleGoBackToHomePage}>
        Go Back To Home Page
      </button>
    </div>
  );
};

export default CourseList;
