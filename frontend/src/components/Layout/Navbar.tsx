import Link from "next/link";
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ImCross } from 'react-icons/im';

type Props = {
  setToggle:Function;
  toggle:boolean;
};

const Navbar = (props: Props) => {
  const router = useRouter();

  function handleLogout() {
    Cookies.remove('token')
    router.replace('/login')
  }


  return (
    <>
      {/* <nav className="navbar w-full h-[--nav-height] fixed top-0 left-0 right-0 z-100 bg-[--background-white]"> */}
      <nav className="navbar w-full h-[--nav-height] sticky top-0 left-0 z-50 bg-[--background-white]">
        <div className="navbar-start ml-5 leading-[2.7rem] font-normal">
          <div  className="md:hidden dropdown text-3xl" onClick={() => props.setToggle((toggle:boolean)=>!toggle)}>
            <label tabIndex={0}  className="btn btn-ghost btn-circle">
          
        {props.toggle ? <ImCross/>: <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>}
              
            </label>
          </div>

          <Link href="/" className="btn btn-ghost hover:bg-transparent normal-case text-[2.2rem]">
            {process.env.appname}
          </Link>
        </div>
        {/* //TODO: need to do logout here  */}
        <div className="navbar-end mr-5 gap-10">
          <img src="images/bell.svg" alt="bell" />
          <div className="avatar dropdown dropdown-end">
            <div className="w-20 rounded-full object-fill">
              <label tabIndex={0} className="cursor-pointer">
                <img src="/images/default.png" />
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border-2 border-[#9155FD]">
                {/* TODO: add profile etc. links here */}
                <li className="text-xl text-center py-2 cursor-pointer" onClick={handleLogout}>Logout</li>
                {/* <li><a>Item 2</a></li> */}
              </ul>
            </div>



          </div>
        </div>
      </nav>

      {/* <div className="h-[--nav-height] w-full" /> */}
    </>
  );
};

export default Navbar;
