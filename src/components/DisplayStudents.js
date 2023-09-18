import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./DisplayStudents.css"; // Import the CSS file

import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const DisplayStudents = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const sessionToken = localStorage.getItem("token");
  const typeofuser = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axios.get(`${baseUrl}api/prof/getStudentList`, {
          headers: {
            authorization: sessionToken,
            cid: courseId,
          },
        });

        setStudents(response.data);
      } catch (error) {
        // alert("Already marked attendance");
        console.error("Error fetching student list:", error);
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
  };

  //   const handleSubmitAttendance = async () => {
  //     try {
  //       const attendList = selectedStudents.map((studentId) =>
  //         selectedStudents.includes(studentId) ? "P" : "A"
  //       );

  //       const response = await axios.post(
  //         "http://localhost:3000/api/prof/markAttendance",
  //         {
  //           stud_id: selectedStudents,
  //           attend_list: attendList,
  //         },
  //         {
  //           headers: {
  //             authorization: sessionToken,
  //             courseid: courseId,
  //           },
  //         }
  //       );

  //       console.log("Attendance marked successfully:", response.data);
  //       // You can perform any necessary actions after marking attendance, such as reloading data or displaying a success message.
  //     } catch (error) {
  //       console.error("Error marking attendance:", error);
  //     }
  //   };
  const handleSubmitAttendance = async () => {
    const studIdList = students.map((student) => student.id);
    const attendList = students.map((student) =>
      selectedStudents.includes(student.id) ? "P" : "A"
    );

    const attendanceData = {
      stud_id: studIdList,
      attend_list: attendList,
    };
    try {
      // const attendanceData = students.map((student) => ({
      //   stud_id: student.id,
      //   attend_list: selectedStudents.includes(student.id) ? "P" : "A",
      // }));
      // console.log(attendanceData);
      const response = await axios.post(
        `${baseUrl}api/prof/markAttendance`,
        attendanceData,
        {
          headers: {
            authorization: sessionToken,
            courseid: courseId,
          },
        }
      );

      console.log("Attendance marked successfully:", response.data);
      navigate("/");
      // You can perform further actions here, such as updating the UI or reloading data
    } catch (error) {
      alert("Already marked attendance. Please go to Update attendance!!!!");
      console.error("Error marking attendance:", error);
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
      <h2>Mark Attendance for Course ID : {courseId}</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleCheckboxChange(student.id)}
              />
              Student ID: <span className="bold">{student.id}</span>, Student
              Name: <span className="bold">{student.name}</span>, Student Roll:{" "}
              <span className="bold">{student.roll}</span>
            </label>
          </li>
        ))}
      </ul>
      <button className="submit-button" onClick={handleSubmitAttendance}>
        Submit Attendance
      </button>
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default DisplayStudents;
