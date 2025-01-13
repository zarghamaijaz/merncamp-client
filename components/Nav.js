import React, {useEffect, useState, useContext} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import { Avatar } from "antd";

const Nav = () => {
  const [current, setCurrent] = useState("");
  const [state, setState] = useContext(UserContext);
  const router = useRouter()
  useEffect(()=>{
    process.browser && setCurrent(window.location.pathname)
  },[process.browser && window.location.pathname])
  console.log(current)
  const logout = () => {
    window.localStorage.removeItem('auth');
    setState(null);
    router.push('/login')
  }
  return (
    <nav className="nav bg-primary d-flex justify-content-between">
      <Link aria-current="page" href="/">
        <a className={`nav-link text-light logo ${current === "/" && "active"}`}><Avatar src="/images/logo.png" /> MERNCAMP</a>
      </Link>
      {state !== null ? (
        <div className="dropdown">
          <button className="btn dropdown-toggle text-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {state && state.user && state.user.name}
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link href="/user/dashboard">
                <a className={`dropdown-item nav-link ${current === "/user/dashboard" && "active"}`}>Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/user/profile/update">
                <a className={`dropdown-item nav-link ${current === "/user/profile/update" && "active"}`}>Profile</a>
              </Link>
            </li>
            {state.user.role === "Admin" && (
              <li>
                <Link href="/admin">
                  <a className={`dropdown-item nav-link ${current === "/admin" && "active"}`}>Admin</a>
                </Link>
              </li>
            )}
            <li><a onClick={logout} className="nav-link">Logout</a></li>
          </ul>
        </div>
      ):(
        <>
        <Link aria-current="page" href="/login">
          <a className={`nav-link text-light ${current === "/login" && "active"}`}>Login</a>
        </Link>
        <Link aria-current="page" href="/register">
          <a className={`nav-link text-light ${current === "/register" && "active"}`}>Register</a>
        </Link>
        </>

      )}
    </nav>
  );
};

export default Nav;
