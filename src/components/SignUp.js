import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./SignUp.css"; // Import the CSS file
import { BASEURL_DEV, BASEURL_PROD, ENV } from "../config";

const SignUp = () => {
  const baseUrlDev = BASEURL_DEV;
  const baseUrlProd = BASEURL_PROD;
  let baseUrl;

  if (ENV === "DEV") {
    baseUrl = baseUrlDev;
  } else {
    baseUrl = baseUrlProd;
  }

  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event) => {
    let str = "";
    event.preventDefault();
    if (userType === "professor") {
      str = `${baseUrl}api/prof/signup`;
    } else {
      str = `${baseUrl}api/students/signup`;
    }
    const response = await axios.post(str, {
      name: name,
      phone: phoneNumber,
      roll: roll,
      mail: email,
      password: password,
    });
    console.log(response);

    if (response.status === 200) {
      // Save the auth token and redirect
      //localStorage.setItem("token", response.data.session_token);
      alert(response.data.message);
      // history.push("/");
    } else {
      alert(response.data.message);
    }

    // Reset form fields
    setUserType("");
    setName("");
    setEmail("");
    setRoll("");
    setPhoneNumber("");
    setPassword("");
  };

  const redirectToLoginPage = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="signup-form">
      <h1>Signup Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <div className="user-type-container">
          <label>
            User Type:
            <input
              type="radio"
              value="student"
              checked={userType === "student"}
              onChange={handleUserTypeChange}
              required
            />{" "}
            Student
          </label>
          <label>
            <input
              type="radio"
              value="professor"
              checked={userType === "professor"}
              onChange={handleUserTypeChange}
              required
            />{" "}
            Professor
          </label>
        </div>
        {userType === "student" && (
          <div>
            <label>
              Roll:
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        {userType === "professor" && (
          <div>
            <label>
              Phone Number:
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Sign Up</button>
        <button type="button" onClick={redirectToLoginPage}>
          Go to Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;
