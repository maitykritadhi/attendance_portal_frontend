import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

import {
  BASEURL_DEV,
  BASEURL_PROD,
  ENV,
} from "../config";

const Login = (props) => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }
  console.log(baseUrl);

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [userType, setUserType] = useState();

  const navigate = useNavigate();
  let redirectpath = "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password || !userType) {
      alert("Please fill in all fields and select a user type.");
      return;
    }

    let str = "";

    if (userType === "professor") {
      str = `${baseUrl}api/prof/login`;
      redirectpath = "/";
    } else {
      str = `${baseUrl}api/students/login`;
      redirectpath = "/login/studentinfo";
    }

    try {
      const response = await axios.post(str, {
        mail: credentials.email,
        password: credentials.password,
      });

      if (response.status === 200) {
        // Save the auth token and redirect
        localStorage.setItem("token", response.data.session_token);
        localStorage.setItem("userType", userType); // Save user type to local storage
        alert(response.data.message);
        redirectToHomePage();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message); // Display backend error message
      } else {
        alert("An error occurred while processing your request."); // Generic error message
      }
    }
  };

  /*
  const handleSubmit = async (e) => {
    // console.log(userType);
    let str = "";

    e.preventDefault();
    if (userType === "professor") {
      str = "http://localhost:3000/api/prof/login";
      redirectpath = "/";
    } else {
      str = "http://localhost:3000/api/students/login";
      redirectpath = "/login/studentinfo";
    }
    const response = await axios.post(str, {
      mail: credentials.email,
      password: credentials.password,
    });
    console.log(response);

    if (response.status === 200) {
      // Save the auth token and redirect
      localStorage.setItem("token", response.data.session_token);
      localStorage.setItem("userType", userType); // Save user type to local storage
      alert(response.data.message);
      redirectToHomePage();
      // history.push("/");
    } else {
      alert(response.data.message);
    }
  };
  */

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const redirectToSignUpPage = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  const redirectToHomePage = () => {
    navigate(redirectpath); // Redirect to the login page
  };

  return (
    <div className="login-box">
      {" "}
      {/* Apply the box styling */}
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={credentials.email}
            onChange={onChange}
            id="email"
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email or password with anyone.
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            name="password"
            id="password"
          />
        </div>

        <div className="form-group">
          <label>User Type</label>
          <div>
            <label className="radio-inline">
              <input
                type="radio"
                value="student"
                checked={userType === "student"}
                onChange={handleUserTypeChange}
              />
              <strong>Student</strong>
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                value="professor"
                checked={userType === "professor"}
                onChange={handleUserTypeChange}
              />
              <strong>Professor</strong>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Submit
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={redirectToSignUpPage}
        >
          Go to Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
