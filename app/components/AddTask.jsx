"use client"; // Ensure this component is a client component
import React, { useState } from 'react';
import styles from './AddTask.module.css'; // Import the CSS module
import { useDispatch } from 'react-redux';
import { AddTask } from '../lib/ReduxToolkit/ReduxSlice/User.Slice';
import { useSession } from "next-auth/react";

const AddTasks = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('1235cc');
    const [description, setDescription] = useState('13513tdd');
    const { data: session } = useSession();

    function submitHandler(e) {
        e.preventDefault();
        // const data = { title, description };
        // console.log(session);
        if(title && description){
            dispatch(AddTask({data:{Title:title,Description:description},accessToken:session?.user?.accessToken}));
        }
        setTitle('');
        setDescription('');
    }

    return (
        <div className={styles.container}>
            <form onSubmit={submitHandler} className={styles.form}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="Task Title"
                    className={styles.input}
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    placeholder="Task Description"
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Add Task</button>
            </form>
        </div>
    );
};

export default AddTasks;
