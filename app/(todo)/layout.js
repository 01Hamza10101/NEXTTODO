"use client";
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from "../components/Header";
import { useSelector, useDispatch } from 'react-redux';
import { GetTasksData } from "../lib/ReduxToolkit/ReduxSlice/User.Slice";
import { useSession } from 'next-auth/react';

const Layout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check if user is authenticated
    const isAuthenticated = token !== null || status !== "unauthenticated";
    console.log(isAuthenticated,token !== null,status !== "unauthenticated")
    // If not authenticated and trying to access protected routes
    if (!isAuthenticated) {
      if (!['/login', '/signup'].includes(pathname)) {
        router.push("/login");
      }
    } else {
      // If authenticated and trying to access login/signup, redirect to home
      if (['/login', '/signup'].includes(pathname)) {
        router.push("/");
      }

      // Dispatch GetTasksData if on `/` or `/profile` route
      if (['/', '/profile'].includes(pathname)) {
        dispatch(GetTasksData({accessToken:session?.user?.accessToken}));
      }
    }

    // console.log("Session status:", status);
    // console.log("Access Token:", session?.user?.accessToken);
  }, [pathname, status, dispatch]);

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
