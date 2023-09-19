import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"; // Import the Loader component
import "./StudentDashboard.css";

import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const StudentDashboard = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const [studentData, setStudentData] = useState(null);
  const [rows, setRows] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // State to track data fetching
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        setIsFetching(true); // Start fetching, show the loader
        const response = await axios.get(
          `${baseUrl}api/students/getStudentInfo`,
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );
        console.log(response.data);
        setStudentData(response.data);

        const maxCoursesPerDay = Math.max(
          ...daysOfWeek.map(
            (_, colIndex) =>
              response.data.timetable.filter(
                (entry) => entry.dayid === colIndex
              ).length
          )
        );

        const extra = Array.from({ length: maxCoursesPerDay }).map(
          (_, rowIndex) => (
            <tr key={rowIndex}>
              {daysOfWeek.map((_, colIndex) => (
                <td key={colIndex}>
                  {
                    response.data.timetable
                      .filter((entry) => entry.dayid === colIndex)
                      .map((entry, courseIndex) => {
                        const course = response.data.courses.find(
                          (c) => c.id === entry.cid
                        );
                        return course ? (
                          <span className="course-cell" key={course.id}>
                            {course.cid}
                          </span>
                        ) : null;
                      })[rowIndex]
                  }
                </td>
              ))}
            </tr>
          )
        );
        setRows(extra);
      } catch (error) {
        console.error("Error fetching student information:", error);
      } finally {
        setIsFetching(false); // Stop fetching, hide the loader
      }
    };

    fetchStudentInfo();
  }, [sessionToken, baseUrl]);

  if (sessionToken && typeofuser === "professor") {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="student-dashboard">
      {isFetching ? (
        <Loader /> // Show the loader while fetching
      ) : studentData ? (
        <>
          <div className="student-info">
            <h2>Student Information</h2>
            <h3>Name: {studentData.name}</h3>
            <h3>Roll: {studentData.roll}</h3>
            <h3>Email: {studentData.mail}</h3>
          </div>

          <div className="timetable">
            <h2>Timetable</h2>
            <table className="timetable-table">
              <thead>
                <tr>
                  {daysOfWeek.map((day, dayId) => (
                    <th key={dayId}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>

          <div className="course-list">
            <h2>List of Courses</h2>
            <ul>
              {studentData.courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/login/studentinfo/${course.id}`}
                    state={{
                      course: course.id,
                      studentData: studentData,
                    }}
                    className="course-link"
                  >
                    {course.cid}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
      <div className="enquiry-button">
        <button
          className="enquiry-btn"
          onClick={() =>
            navigate("/login/studentinfo/studentenquiry", {
              state: { studentData: studentData },
            })
          }
        >
          Student Enquiry
        </button>
        <button id="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
