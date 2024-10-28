"use client"
import styles from "./page.module.css";
import AddTask from "../components/AddTask";
import TodoItem from "../components/TodoItem";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useSession } from "next-auth/react";
export default function Home() {
  const Tasks = useSelector(state => state.User.Tasks);
  const {data:session} = useSession();
  return (
    <div className={styles.page}>
      {<AddTask/>}
      {Tasks?.slice().reverse().map((i) => (
        <TodoItem
          title={i?.Title}
          description={i?.Description}
          id={i?._id}
          key={i?._id}
          completed={i?.IsCompleted}
          accessToken={session?.user?.accessToken}
        />
      ))}
    </div>
  );
}
