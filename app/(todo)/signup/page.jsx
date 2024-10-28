"use client";
import React, { useState , useEffect} from "react";
import "./Signup.css";
import { useDispatch } from "react-redux";
import { SignupUser } from "../../lib/ReduxToolkit/ReduxSlice/User.Slice";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirmPassword: "",
  });
  const Router = useRouter();

  // useEffect(() => {
  //   function CheckIsLogin() {
  //     let token = localStorage.getItem("token");
  //     if (token) {
  //       Router.push("/");
  //     }
  //   }

  //   CheckIsLogin(); 
  // }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SignupUser({Name:formData.Name,Email:formData.Email,Password:formData.Password}))
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="Name"
            placeholder="Enter your name"
            value={formData.Name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="Email"
            placeholder="Enter your email"
            value={formData.Email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="Password"
            placeholder="Enter your password"
            value={formData.Password}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
        <Link className="Link" href="/login">Already have an account? Log in</Link>
      </form>
    </div>
  );
};

export default Signup;
