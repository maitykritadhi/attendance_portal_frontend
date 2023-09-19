import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Loader from "./Loader"; // Import the Loader component
import "./ProfReceiveEnquiry.css"; // Import the CSS file

import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const ProfReceiveEnquiry = () => {
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
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Loading state for the component
  const [loadingRequestId, setLoadingRequestId] = useState(null); // ID of the request being updated

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}api/prof/getprofRequestReceive`,
          {
            headers: {
              authorization: sessionToken,
            },
          }
        );
        setEnquiries(response.data);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched
      }
    };

    fetchEnquiries();
  }, [sessionToken, baseUrl]);

  const [profMssgInputs, setProfMssgInputs] = useState({}); // State for the professor's message inputs

  const handleUpdateRequest = async (id, newState) => {
    try {
      let prof_mssg = "";

      if (newState === 1 || newState === 2) {
        prof_mssg = profMssgInputs[id] || ""; // Use the input from state
      }

      setLoadingRequestId(id); // Set loading state to true when a button is clicked

      await axios.put(
        `${baseUrl}api/prof/profRequestUpdate`,
        {
          id: id,
          prof_mssg: prof_mssg,
          state: newState,
        },
        {
          headers: {
            authorization: sessionToken,
          },
        }
      );

      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry.id === id
            ? {
                ...enquiry,
                state: newState,
                prof_mssg: prof_mssg,
              }
            : enquiry
        )
      );

      setProfMssgInputs((prevInputs) => ({
        ...prevInputs,
        [id]: "", // Clear the input after update
      }));
    } catch (error) {
      console.error("Error updating request:", error);
    } finally {
      setLoadingRequestId(null); // Reset loading state after the operation is complete
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (sessionToken && typeofuser === "student") {
    return <Navigate to="/login/studentinfo" replace />;
  }

  return (
    <>
      <div>
        <h1>Student Enquiries</h1>
        {isLoading ? (
          <Loader /> // Display loader while fetching data
        ) : (
          <table className="custom-table">
            <tr>
              <th>Request ID</th>
              <th>Student Name</th>
              <th>Student Roll</th>
              <th>Student Mail</th>
              <th>Student ID</th>
              <th>Student Message</th>
              <th>Status</th>
              <th>Course Name</th>
            </tr>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>{enquiry.id}</td>
                  <td>{enquiry.name}</td>
                  <td>{enquiry.roll}</td>
                  <td>{enquiry.mail}</td>
                  <td>{enquiry.stud_id}</td>
                  <td>{enquiry.stud_mssg}</td>
                  <td>
                    {enquiry.state === 0
                      ? "Pending"
                      : enquiry.state === 1
                      ? "Accepted"
                      : "Rejected"}
                  </td>
                  <td>{enquiry.cname}</td>
                  <td>
                    {enquiry.state === 0 ? (
                      <div>
                        <textarea
                          value={profMssgInputs[enquiry.id] || ""}
                          onChange={(e) =>
                            setProfMssgInputs((prevInputs) => ({
                              ...prevInputs,
                              [enquiry.id]: e.target.value,
                            }))
                          }
                          placeholder="Enter your response..."
                        />
                        {loadingRequestId === enquiry.id ? (
                          <Loader />
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdateRequest(enquiry.id, 1)}
                              className="accept-button"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateRequest(enquiry.id, 2)}
                              className="reject-button"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      "Handled"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <button className="go-back-button" onClick={handleBackToHome}>
          Go Back To Home Page
        </button>
      </div>
    </>
  );
};

export default ProfReceiveEnquiry;

