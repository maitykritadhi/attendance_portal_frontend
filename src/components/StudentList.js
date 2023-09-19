import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loader from "./Loader"; // Import the Loader component
import "./StudentList.css"; // Import the CSS file
import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const StudentList = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const [isFetching, setIsFetching] = useState(true); // State to track data fetching
  const [isEnrolling, setIsEnrolling] = useState(false); // State to track enrolling

  const { courseId, courseName } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudents() {
      try {
        setIsFetching(true); // Start fetching, show the loader
        console.log(courseId);
        const response = await axios.get(`${baseUrl}api/prof/getStudents`, {
          headers: {
            authorization: sessionToken,
            course_id: courseId,
          },
        }); // Replace with your backend API endpoint
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student list:", error);
      } finally {
        setIsFetching(false); // Stop fetching, hide the loader
      }
    }

    fetchStudents();
  }, [courseId, sessionToken, baseUrl]);

  const handleCheckboxChange = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
    console.log(selectedStudents);
  };

  const handleSubmit = async () => {
    try {
      setIsEnrolling(true); // Start enrolling, show the loader
      const response = await axios.post(
        `${baseUrl}api/prof/assignStudents`,
        {
          cid: courseId,
          sid: selectedStudents,
        },
        {
          headers: {
            authorization: sessionToken,
          },
        }
      );
      console.log("Enrollment successful:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error enrolling students:", error);
    } finally {
      setIsEnrolling(false); // Stop enrolling, hide the loader
    }
  };

  const handleGoBackToHomePage = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/courses");
  };

  if (sessionToken && typeofuser === "student") {
    // navigate("/");
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <div className="student-list-container">
      <h2>Students Not Enrolled in Course ID : {courseName}</h2>
      <div className="student-list">
        {/* Conditional rendering for the loader while fetching */}
        {isFetching ? (
          <Loader />
        ) : (
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleCheckboxChange(student.id)}
                  />
                  Student ID: <span className="bold">{student.id}</span>,
                  Student Name: <span className="bold">{student.name}</span>,
                  Student Roll: <span className="bold">{student.roll}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="button-container">
        {/* Conditional rendering for the loader while enrolling */}
        {isEnrolling ? (
          <Loader />
        ) : (
          <button className="enroll-button" onClick={handleSubmit}>
            Enroll Selected Students
          </button>
        )}
        <button className="goback-button" onClick={handleGoBack}>
          Go Back
        </button>
        <button className="back-button" onClick={handleGoBackToHomePage}>
          Go Back To Home Page
        </button>
      </div>
    </div>
  );
};

export default StudentList;
