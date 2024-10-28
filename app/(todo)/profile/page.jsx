"use client";

import React, { useContext } from "react";
// import { Context } from "../../components/Clients";
import { redirect } from "next/navigation";
import "./profile.css";
import { useSelector } from "react-redux";
const Page = () => {
  // const { user } = useContext(Context);
  const userState = useSelector(state => state.User.user);
  // if (!userState._id) return redirect("/login");
  console.log(userState)
  return (
    <div className="Profile">
      <h1>{userState.Name}</h1>
      <p>{userState.Email}</p>
    </div>
  );
};

export default Page;