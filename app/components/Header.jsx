"use client";
import { useEffect, useState } from "react";
import style from "./Header.css";
import { useRouter , usePathname} from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const [isLogin, setLogin] = useState();
  const Router = useRouter();
  const pathname = usePathname(); 
  const message = useSelector(state => state.User.message);
  const dispatch = useDispatch();
  const {status} = useSession();

  useEffect(() => {
    function CheckIsLogin() {
      let token = localStorage.getItem("token");
      if (token || status === "authenticated") {
        setLogin(true); 
      }else{
        setLogin(false)
      }
    }
    console.log("working header",status)
    CheckIsLogin(); 
  }, [pathname])
  
  function handleLogout() {
    if(status === "authenticated"){
      signOut();
      Router.push("/login");
    }else{
      // setLogin(false);
      localStorage.removeItem("token");
      Router.push("/login");
    }
  }

  function handleLogin() {
    Router.push("/login");
  }

  return (
    <div className="header">
      <p>TODO.</p>
      <div>
        <button className="Btn" onClick={() => isLogin || status === "authenticated" ? Router.push("/") :  toast.error("Please Login")}>Home</button>
        <button className="Btn" onClick={() => isLogin || status === "authenticated" ? Router.push("/profile") : toast.error("Please Login")}>Profile</button>
        {isLogin || status === "authenticated" ? (
          <button className="Btn" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="Btn" onClick={handleLogin}>Login</button>
        )}
      </div>
    </div>
  );
};

export default Header;
