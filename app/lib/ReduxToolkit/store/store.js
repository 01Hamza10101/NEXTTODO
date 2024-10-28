"use client"
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../ReduxSlice/User.Slice";

const store = configureStore({
    reducer:{
        User:UserReducer
    }
})

export default store;