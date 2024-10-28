"use client";

import React, { useState, useEffect } from "react";
import "./login.css"; // Import the CSS file
import { useDispatch } from "react-redux";
import { LoginUser } from "../../lib/ReduxToolkit/ReduxSlice/User.Slice";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signIn, signOut, useSession } from 'next-auth/react'

const Login = () => {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const Router = useRouter();
  const session = useSession();

  // useEffect(() => {
  //   function CheckIsLogin() {
  //     let token = localStorage.getItem("token");
  //     if (token) {
  //       Router.push("/");
  //     }
  //   }

  //   CheckIsLogin(); 
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log(session);
    if (Email && Password) {
      try {
        // Dispatch the LoginUser action with the Email and Password and unwrap the result
        let res = await dispatch(LoginUser({ Email, Password })).unwrap();
        console.log("Login successful:", res); // Success handling
        if (res.message == "Login successful") Router.push("/");
      } catch (error) {
        console.error("Login failed:", error); // Error handling
      }
    } else {
      console.log("Please fill in both fields.");
    }
  };



  // console.log(session);
  // if (session.status === "loading") {
  //   return <p>Loading....</p>
  // }
  // if (session.status === "authenticated") {
  //   return <button onClick={() => signOut("google")}>Logout</button>
  // }
  // if (session.status === "unauthenticated") {
  //   return <p>user un  authenticated</p>
  // }


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="Email">Email</label>
          <input
            type="Email"
            id="Email"
            placeholder="Enter your Email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="Password">Password</label>
          <input
            type="Password"
            id="Password"
            placeholder="Enter your Password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
        <button className="submit-btn" onClick={()=> signIn("google")}>Login with google</button>
        <Link className="Link" href="/signup">Sign up</Link>
      </form>
      
      <div>

      </div>
    </div>
  );
};

export default Login;
