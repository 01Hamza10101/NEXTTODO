import React, { useEffect, useState } from 'react';
import './TodoItem.css'; // Import your CSS file
import { useDispatch } from "react-redux";
import {DeleteTask , UpdateTask} from "../lib/ReduxToolkit/ReduxSlice/User.Slice";

const TodoItem = ({ title, description, id, completed ,accessToken}) => {
  const dispatch = useDispatch();
  const [IsCompleted,setIsCompleted] = useState("");
  
  useEffect(()=>{
    setIsCompleted(completed);
  },[])

  const handleUpdateTask = (e) => {
    setIsCompleted(prev => !prev);
    dispatch(UpdateTask({data:{ id, IsCompleted:!IsCompleted},accessToken}));
  };
  
  return (
    <div className="todo-item">
      <div className="todo-content">
        <h4 className={IsCompleted ? "todo-title completed" : "todo-title"}>{title}</h4>
        <p className="todo-description">{description}</p>
      </div>

      <div className="todo-actions">
        <input type="checkbox" className="todo-checkbox"  checked={IsCompleted}  onChange={handleUpdateTask}/>
        <button className="todo-delete-btn" onClick={()=> dispatch(DeleteTask({id,accessToken}))}>DELETE</button>
      </div>
    </div>
  );
};

export default TodoItem;
