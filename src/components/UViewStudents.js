import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./UViewStudents.css";
import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const UViewStudents = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const sessionToken = localStorage.getItem("token"); // Replace with your token retrieval logic
  const typeofuser = localStorage.getItem("userType");
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [updatedAttendance, setUpdatedAttendance] = useState([]);
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  // Retrieve formattedDate from local storage
  const formattedDate = localStorage.getItem("formattedDate") || "";

  useEffect(() => {
    async function fetchStudentList() {
      try {
        const response = await axios.get(
          `${baseUrl}api/prof/getStudentListUpdation`,
          {
            headers: {
              authorization: sessionToken,
              cid: courseId,
              sdate: formattedDate,
            },
          }
        );

        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student list:", error);
      }
    }

    fetchStudentList();
  }, [courseId, sessionToken, formattedDate, baseUrl]);

  const handleCheckboxChange = (studentId) => {
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        return {
          ...student,
          attendance: student.attendance === "P" ? "A" : "P",
        };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const handleUpdateAttendance = () => {
    // Create the body based on checked and unchecked boxes
    const updatedAttendanceList = students.map((student) => ({
      stud_id: student.id,
      attendance: student.attendance,
    }));

    // Set the created body in the state
    setUpdatedAttendance(updatedAttendanceList);
    console.log(updatedAttendanceList);
    setShowSubmitButton(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}api/prof/updatesAttendance`,
        updatedAttendance,
        {
          headers: {
            authorization: sessionToken,
            ma_date: formattedDate,
            ma_courseid: courseId,
          },
        }
      );

      console.log("Attendance updated successfully:", response.data);

      // Remove formattedDate and selectedDayId1 from local storage
      localStorage.removeItem("formattedDate");
      localStorage.removeItem("selectedDayId1");
      // localStorage.removeItem("userType");

      // Navigate to home page on successful updation
      navigate("/");
    } catch (error) {
      console.error("Error updating attendance:", error);
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
    <div>
      <h2>View Students for Attendance Updation</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <label>
              <input
                type="checkbox"
                checked={student.attendance === "P"}
                onChange={() => handleCheckboxChange(student.id)}
              />
              Student ID: <span className="bold">{student.id}</span>, Student
              Name: <span className="bold">{student.name}</span>, Student Roll:{" "}
              <span className="bold">{student.roll}</span>
            </label>
          </li>
        ))}
      </ul>
      <button className="update-button" onClick={handleUpdateAttendance}>
        Update Attendance
      </button>
      {showSubmitButton && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Updated Attendance
        </button>
      )}
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default UViewStudents;
