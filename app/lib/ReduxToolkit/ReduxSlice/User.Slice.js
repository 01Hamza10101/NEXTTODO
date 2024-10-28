"use client"
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

import axios from 'axios';

export const SignupUser = createAsyncThunk("user/signup", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post("/api/users/signup", data);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message }); // Use rejectWithValue to pass error message to rejected state
    }
    return rejectWithValue({ message: "An error occurred during Signup." });
  }
});

export const LoginUser = createAsyncThunk("user/login", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post("/api/users/login", data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message }); // Use rejectWithValue to pass error message to rejected state
    }
    return rejectWithValue({ message: "An error occurred during login." });
  }
});

export const AddTask = createAsyncThunk("user/AddTask", async ({data,accessToken}, { rejectWithValue }) => {
  try {
  
  const token = localStorage.getItem('token') || accessToken;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };
    console.log(data)
    const res = await axios.post("/api/users/tasks", data, config);

    return res.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message });
    }
    return rejectWithValue({ message: "An error occurred during Add Task." });
  }
});

export const DeleteTask = createAsyncThunk("user/DeleteTask", async ({id,accessToken}, { rejectWithValue }) => {
  try {
    
    const token = localStorage.getItem('token') || accessToken;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const res = await axios.delete(`/api/users/tasks?taskId=${id}`, config);
    console.log(res);

    return res.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message });
    }
    return rejectWithValue({ message: "An error occurred while deleting the task." });
  }
});

export const UpdateTask = createAsyncThunk("user/UpdateTask", async ({ data ,accessToken}, { rejectWithValue }) => {
  try {
  
  const token = localStorage.getItem('token') || accessToken;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    console.log(data.id,data.IsCompleted)
    const res = await axios.put(`/api/users/tasks`, { id:data.id, IsCompleted:data.IsCompleted }, config);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message });
    }
    return rejectWithValue({ message: "An error occurred while updating task completion." });
  }
});


export const GetTasksData = createAsyncThunk("user/GetTasksData", async ({accessToken}, { rejectWithValue }) => {
  try {
    
    const token = localStorage.getItem('token') || accessToken;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };

    const res = await axios.get("/api/users/tasks", config);

    return res.data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      return rejectWithValue({ message: error.response.data.message });
    }
    return rejectWithValue({ message: "An error occurred while fetching tasks." });
  }
});


const initialState = {
  message: "",
  user: {
  },
  Tasks: []
}

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    increment(state, action) {
      console.log(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      console.log(action.payload.user)
      toast.success(action.payload.message);
    })
      .addCase(LoginUser.rejected, (state, action) => {
        state.message = action.payload.message;
        toast.error(action.payload.message);
      })
    builder.addCase(SignupUser.fulfilled, (state, action) => {
      state.message = action.payload.message;
      toast.success(action.payload.message);
    })
      .addCase(SignupUser.rejected, (state, action) => {
        state.message = action.payload.message;
        toast.error(action.payload.message);
      })
    builder.addCase(GetTasksData.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.Tasks = action.payload.Tasks;
      // toast.success(action.payload.message);
    })
      .addCase(GetTasksData.rejected, (state, action) => {
        // state.message = action.payload.message;
        toast.error(action.payload.message);
      })
    builder.addCase(AddTask.fulfilled, (state, action) => {
      // state.user = action.payload.user;
      state.Tasks = action.payload.Tasks;
      toast.success(action.payload.message);
    })
      .addCase(AddTask.rejected, (state, action) => {
        // state.message = action.payload.message;
        toast.error(action.payload.message);
      });
    builder.addCase(DeleteTask.fulfilled, (state, action) => {
      // state.user = action.payload.user;
      state.Tasks = action.payload.Tasks;
      toast.success(action.payload.message);
    })
      .addCase(DeleteTask.rejected, (state, action) => {
        // state.message = action.payload.message;
        toast.error(action.payload.message);
      })
      
    builder.addCase(UpdateTask.fulfilled, (state, action) => {
      // state.user = action.payload.user;
      // state.Tasks = action.payload.Tasks;
      toast.success(action.payload.message);
    })
      .addCase(UpdateTask.rejected, (state, action) => {
        // state.message = action.payload.message;
        toast.error(action.payload.message);
      })

  }
})

export const { increment } = UserSlice.actions;

export default UserSlice.reducer;