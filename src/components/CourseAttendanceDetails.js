// CourseAttendanceDetails.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

import "./CourseAttendanceDetails.css"; // Import the CSS file

const CourseAttendanceDetails = () => {
  
  const typeofuser = localStorage.getItem("userType");
  const sessionToken = localStorage.getItem("token"); // Fetch the session token
  const location = useLocation();
  const { studentData } = location.state;
  const navigate = useNavigate();
  const courseId = parseInt(location.pathname.split("/").pop(), 10);

  const course = studentData.courses.find((course) => course.id === courseId);
  const courseAttendance = studentData.attendance.filter(
    (entry) => entry.course_id === courseId
  );

  const handleLogout = () => {
    // Logic for logout (e.g., clearing token or state)
    // Redirect to the login page
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login"); // Adjust the route as needed
  };

  const handleGoBack = () => {
    // Navigate back to the previous page
    navigate("/login/studentinfo");
  };

  if (sessionToken && typeofuser === "professor") {
    // navigate("/");
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <div className="student-details">
        <h2>Student Details</h2>
        <p>Name: {studentData.name}</p>
        <p>Roll: {studentData.roll}</p>
        <p>Email: {studentData.mail}</p>
      </div>

      {course && (
        <div className="course-details">
          <h2>Course Details</h2>
          <p>Course ID: {course.id}</p>
          <p>Course Name: {course.cid}</p>
        </div>
      )}

      <div className="attendance-details">
        <h2>Attendance Details</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {courseAttendance.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td className={entry.attendance === "P" ? "present" : "absent"}>
                  {entry.attendance === "P" ? "Present" : "Absent"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons">
        <button onClick={handleGoBack}>Go Back</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default CourseAttendanceDetails;


// // CourseAttendanceDetails.js
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

// import "./CourseAttendanceDetails.css"; // Import the CSS file

// const CourseAttendanceDetails = () => {
//   const typeofuser = localStorage.getItem("userType");
//   const sessionToken = localStorage.getItem("token"); // Fetch the session token
//   const location = useLocation();
//   const { studentData } = location.state;
//   const navigate = useNavigate();
//   const courseId = parseInt(location.pathname.split("/").pop(), 10);

//   const course = studentData.courses.find((course) => course.id === courseId);
//   const courseAttendance = studentData.attendance.filter(
//     (entry) => entry.course_id === courseId
//   );

//   const handleLogout = () => {
//     // Logic for logout (e.g., clearing token or state)
//     // Redirect to the login page
//     localStorage.removeItem("token");
//     localStorage.removeItem("userType");
//     navigate("/login"); // Adjust the route as needed
//   };

//   const handleGoBack = () => {
//     // Navigate back to the previous page and pass studentData as state
//     navigate("/login/studentinfo", { state: { studentData } });
//   };

//   if (sessionToken && typeofuser === "professor") {
//     // navigate("/");
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div>
//       <div className="student-details">
//         <h2>Student Details</h2>
//         <p>Name: {studentData.name}</p>
//         <p>Roll: {studentData.roll}</p>
//         <p>Email: {studentData.mail}</p>
//       </div>

//       {course && (
//         <div className="course-details">
//           <h2>Course Details</h2>
//           <p>Course ID: {course.id}</p>
//           <p>Course Name: {course.cid}</p>
//         </div>
//       )}

//       <div className="attendance-details">
//         <h2>Attendance Details</h2>
//         <table className="attendance-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Attendance</th>
//             </tr>
//           </thead>
//           <tbody>
//             {courseAttendance.map((entry, index) => (
//               <tr key={index}>
//                 <td>{entry.date}</td>
//                 <td className={entry.attendance === "P" ? "present" : "absent"}>
//                   {entry.attendance === "P" ? "Present" : "Absent"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="buttons">
//         <button onClick={handleGoBack}>Go Back</button>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// };

// export default CourseAttendanceDetails;
