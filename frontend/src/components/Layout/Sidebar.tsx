import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { GoTriangleDown, GoTriangleLeft } from 'react-icons/go';
import { TbCoins } from 'react-icons/tb';
import { HiOutlineHome } from 'react-icons/hi';
import { BiHistory, BiDollar, BiTask } from 'react-icons/bi';
import { AiOutlineMedicineBox } from 'react-icons/ai';
import { MdOutlineDynamicFeed } from 'react-icons/md';
import { jwtUser } from "@/types/auth";

type Props = {
  user?: jwtUser;
  toggle:boolean;
};


// const dropType = { batch: "batch", medicine: 'medicine', feed: 'feed' }
const initialState = { batch: false, medicine: false, feed: false }


const Sidebar = (props: Props) => {
  const [toggle, setToggle] = useState(initialState)

  const router = useRouter();

  const activeRoute = (path: string) => router.pathname === path;
  const activeParentRoute = (path: string[]) => path.includes(router.pathname);


  function toggleDropdown(type: keyof typeof initialState) {
    setToggle(val => ({ ...initialState, [type]: !val[type] }))
  }


  const sidebarCss = ` w-[--sidebarWidthFull] h-full mr-5`  // transition-transform -translate-x-full sm:translate-x-0
  const ancortagClass = `flex items-center w-full gap-1`;
  const svgWrapper = `flex w-8 justify-start items-start py-2`;

  return (
    <>
      {/* <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className={ancortagClass}
      >
        <span className="sr-only ">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button> */}
      {/* <div className={` ${sidebarCss}`}> */}
      {props.toggle &&<aside
        id="sidebar-multi-level-sidebar"
        className={` z-50 bg-white absolute md:z-0 md:sticky top-[--nav-height] left-0 
        `} //fixed top-[--nav-height] left-0
        aria-label="Sidebar"
      >
        <div className="h-full pr-3 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="font-medium flex flex-col gap-6">
            {/* Dashboard */}
            <li className={` pl-6 ${activeRoute('/') ? `sidebarElementActive` : ""}`}>
              <Link href={{ pathname: "/" }}>
                <div className={ancortagClass}>
                  {/* dashboard image */}
                  <div className={svgWrapper}>
                    <HiOutlineHome className={`h-full w-full ${activeRoute('/') ? "text-white" : "text-black"}`} />

                  </div>

                  <span className={`ml-3 sideText ${activeRoute('/') ? `text-[#fff]` : ""}`}>Dashboard</span>
                </div>
              </Link>
            </li>

            {/* Add Batch */}

            {props.user?.isAdmin && <li className={` pl-6 ${activeRoute('/add-batch') ? `sidebarElementActive` : ""}`}>
              <Link href={{ pathname: "/add-batch" }}>
                <div className={ancortagClass}>
                  {/* dashboard image */}
                  <div className={svgWrapper}>
                    <svg
                      width="23"
                      height="21"
                      viewBox="0 0 23 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.27845 2.89986C6.56622 3.19217 6.8157 3.52042 7.0208 3.87662C8.35602 3.03474 9.8996 2.58959 11.4743 2.59227C13.126 2.59227 14.6663 3.07192 15.9657 3.90045C16.1757 3.53462 16.4308 3.19262 16.7217 2.89986C18.0452 1.56786 20.3683 0.98127 21.4419 2.0618C22.5155 3.1418 21.9323 5.47969 20.6088 6.81169C20.2057 7.21154 19.7371 7.53822 19.2238 7.77733C19.6549 8.81232 19.8763 9.92386 19.8748 11.0465C19.8748 15.7153 16.1137 19.5001 11.4749 19.5001C6.83442 19.5001 3.07387 15.7148 3.07387 11.0465C3.07387 9.87963 3.30855 8.76786 3.73327 7.75669C3.23663 7.51972 2.78301 7.20027 2.39138 6.81169C1.06733 5.47969 0.484589 3.1418 1.55821 2.0618C2.63182 0.981799 4.95546 1.56786 6.27845 2.89986Z"
                        stroke={activeRoute('/add-batch') ? `white` : "#262526"}
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.5 16.853C13.8196 16.853 15.7 15.1938 15.7 13.1471C15.7 11.1004 13.8196 9.44122 11.5 9.44122C9.18044 9.44122 7.30005 11.1004 7.30005 13.1471C7.30005 15.1938 9.18044 16.853 11.5 16.853Z"
                        stroke={activeRoute('/add-batch') ? `white` : "#262526"}
                        stroke-width="1.5"
                      />
                      <path
                        d="M7.82514 8.38242C8.40503 8.38242 8.87513 7.90837 8.87513 7.32359C8.87513 6.73882 8.40503 6.26477 7.82514 6.26477C7.24524 6.26477 6.77515 6.73882 6.77515 7.32359C6.77515 7.90837 7.24524 8.38242 7.82514 8.38242Z"
                        fill={activeRoute('/add-batch') ? `white` : "#262526"}
                      />
                      <path
                        d="M9.92499 14.206C10.5049 14.206 10.975 13.7319 10.975 13.1471C10.975 12.5624 10.5049 12.0883 9.92499 12.0883C9.3451 12.0883 8.875 12.5624 8.875 13.1471C8.875 13.7319 9.3451 14.206 9.92499 14.206Z"
                        fill={activeRoute('/add-batch') ? `white` : "#262526"}
                      />
                      <path
                        d="M15.175 8.38242C15.7549 8.38242 16.225 7.90837 16.225 7.32359C16.225 6.73882 15.7549 6.26477 15.175 6.26477C14.5951 6.26477 14.125 6.73882 14.125 7.32359C14.125 7.90837 14.5951 8.38242 15.175 8.38242Z"
                        fill={activeRoute('/add-batch') ? `white` : "#262526"}
                      />
                      <path
                        d="M13.075 14.206C13.6549 14.206 14.125 13.7319 14.125 13.1471C14.125 12.5624 13.6549 12.0883 13.075 12.0883C12.4951 12.0883 12.025 12.5624 12.025 13.1471C12.025 13.7319 12.4951 14.206 13.075 14.206Z"
                        fill={activeRoute('/add-batch') ? `white` : "#262526"}
                      />
                    </svg>
                  </div>

                  <span className={`ml-3 sideText ${activeRoute('/add-batch') ? `text-[#fff]` : ""}`}>Add Batch</span>
                </div>
              </Link>
            </li>}



            {/* Product History */}
            <li className={`pl-6 ${activeRoute('/product-history') ? `sidebarElementActive` : ""}`}>
              <Link href={{ pathname: "/product-history" }}>
                <div className={ancortagClass}>
                  {/* product-history image */}
                  <div className={svgWrapper}>
                    <BiHistory className={`h-full w-full ${activeRoute('/product-history') ? "text-white" : "text-black"}`} />

                  </div>
                  <span className={`ml-3 sideText whitespace-nowrap ${activeRoute('/product-history') ? `text-[#fff]` : ""}`}>Product History</span>
                </div>
              </Link>
            </li>

            {/* Medicines & vaccination */}
            <button
              type="button"
              className={`pl-6 ${ancortagClass} ${activeParentRoute(['/vaccination', '/emergency-medicines', '/medicine-inventory']) ? `sidebarElementActive` : ""}`}
              aria-controls="dropdown-batch"
              data-collapse-toggle="dropdown-batch"
              onClick={() => toggleDropdown('medicine')}
            >
              <div className={svgWrapper}>
                <AiOutlineMedicineBox className={`h-full w-full ${activeParentRoute(['/vaccination', '/emergency-medicines', '/medicine-inventory']) ? `text-[#fff]` : "text-[#262526]"}`} />

              </div>
              <span
                className={`flex-1 ml-3 text-left whitespace-nowrap sideText ${activeParentRoute(['/vaccination', '/emergency-medicines', '/medicine-inventory']) ? `text-white` : ""}`}
                sidebar-toggle-item
              >
                Medicines & vaccination
              </span>

              <div className={svgWrapper}>
                {toggle.medicine ?
                  <GoTriangleLeft className={`${activeParentRoute(['/vaccination', '/emergency-medicines', '/medicine-inventory']) ? "text-white" : "text-primary"}`} />
                  :
                  <GoTriangleDown className={activeParentRoute(['/vaccination', '/emergency-medicines', '/medicine-inventory']) ? "text-white" : "text-primary"} />
                }
              </div>
            </button>
            <ul id="dropdown-medicine" className={`${toggle.medicine ? "" : `hidden`} py-2 space-y-2`}>
              <li>
                <Link
                  href="/vaccination"
                  className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]  ${activeRoute('/vaccination') ? 'text-primary' : ''}`}
                >
                  Vaccination
                </Link>
              </li>
              <li>
                <Link
                  href="/emergency-medicines"
                  className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]  ${activeRoute('/emergency-medicines') ? 'text-primary' : ''}`}
                >
                  Emergency medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/medicine-inventory"
                  className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]  ${activeRoute('/medicine-inventory') ? 'text-primary' : ''}`}
                >
                  Inventory
                </Link>
              </li>
            </ul>

            {/*Feed */}
            <button
              type="button"
              className={`pl-6 ${ancortagClass} ${activeParentRoute(['/feed-planer', '/feed-inventory']) ? `sidebarElementActive` : ""}`}
              aria-controls="dropdown-feed"
              data-collapse-toggle="dropdown-feed"
              onClick={() => toggleDropdown('feed')}
            >
              <div className={svgWrapper}>
                <MdOutlineDynamicFeed className={`h-full w-full ${activeParentRoute(['/feed-planer', '/feed-inventory']) ? `text-[#fff]` : "text-[#262526]"}`} />
              </div>

              <span
                className={`ml-3 text-left whitespace-nowrap sideText ${activeParentRoute(['/feed-planer', '/feed-inventory']) ? `text-white` : ""}`}
                sidebar-toggle-item
              >
                Feed
              </span>

              <div className={svgWrapper}>
                {toggle.feed ?
                  <GoTriangleLeft className={`${activeParentRoute(['/feed-planer', '/feed-inventory']) ? "text-white" : "text-primary"}`} />
                  :
                  <GoTriangleDown className={`${activeParentRoute(['/feed-planer', '/feed-inventory']) ? "text-white" : "text-primary"}`} />
                }
              </div>
            </button>
            <ul id="dropdown-feed" className={`${toggle.feed ? "" : `hidden`} py-2 space-y-2`}>

              <li>
                <Link
                  href="/feed-planer"
                  className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]  ${activeRoute('/feed-planer') ? 'text-primary' : ''}`}
                >
                  Feed Planer
                </Link>
              </li>
              <li>
                <Link
                  href="/feed-inventory"
                  className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]  ${activeRoute('/feed-inventory') ? 'text-primary' : ''}`}
                >
                  Feed Inventory
                </Link>
              </li>
            </ul>

            {/* Infrastructural & Crew cost  */}
            {props.user?.isAdmin && <li className={`pl-6 py-2s ${activeRoute('/infrastructural') ? `sidebarElementActive` : ""}`}>
              <Link href={{ pathname: "/infrastructural" }}>
                <div className={ancortagClass}>
                  {/* Infrastructural & Crew cost image */}
                  <div className={svgWrapper}>
                    <BiDollar className={`h-full w-full ${activeRoute('/infrastructural') ? "text-white" : "text-black"}`} />

                  </div>

                  <span className={`ml-3 sideText whitespace-nowrap ${activeRoute('/infrastructural') ? 'text-[#fff]' : ""}`}>
                    Infrastructural & Crew cost
                  </span>
                </div>
              </Link>
            </li>}

            {/* Profit & loss  */}
            {props.user?.isAdmin && <li className={`pl-6 ${activeRoute('/profit-loss') ? `sidebarElementActive` : ""}`}>
              <Link href={{ pathname: "/profit-loss" }}>
                <div className={ancortagClass} >

                  {/* Profit & loss image */}
                  <div className={svgWrapper}>
                    <TbCoins className={` w-8 h-10 ${activeRoute('/profit-loss') ? "text-white" : "text-black"}`} />

                  </div>

                  <span className={`ml-3 sideText ${activeRoute('/profit-loss') ? 'text-[#fff]' : ""}`}>Profit & loss </span>
                </div>
              </Link>
            </li>}

            {/* Job card  */}
            <li className={`pl-6 ${activeRoute('/job-card') ? `sidebarElementActive` : ""}`}>
              <Link href={{ pathname: "/job-card" }}>
                <div className={ancortagClass}>

                  {/* Job card image */}
                  <div className={svgWrapper}>
                    <BiTask className={`h-full w-full ${activeRoute('/job-card') ? "text-white" : "text-black"}`} />
                  </div>

                  <span className={`ml-3 sideText ${activeRoute('/job-card') ? 'text-[#fff]' : ""}`}>Job card</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </aside>}
      {/* <div className={`${sidebarCss} `} /> */}
      {/* </div> */}

    </>
  );
};

export default Sidebar;


{/* <li>
              <button
                type="button"
                className={`pl-6 ${ancortagClass} ${activeParentRoute(['/vaccination', '/emergency-medicines', '/medicine-inventory']) ? `sidebarElementActive` : ""}`}
                aria-controls="dropdown-batch"
                data-collapse-toggle="dropdown-batch"
                onClick={() => toggleDropdown('batch')}
              >
                <div className={svgWrapper}>
                  <svg
                    width="23"
                    height="21"
                    viewBox="0 0 23 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.27845 2.89986C6.56622 3.19217 6.8157 3.52042 7.0208 3.87662C8.35602 3.03474 9.8996 2.58959 11.4743 2.59227C13.126 2.59227 14.6663 3.07192 15.9657 3.90045C16.1757 3.53462 16.4308 3.19262 16.7217 2.89986C18.0452 1.56786 20.3683 0.98127 21.4419 2.0618C22.5155 3.1418 21.9323 5.47969 20.6088 6.81169C20.2057 7.21154 19.7371 7.53822 19.2238 7.77733C19.6549 8.81232 19.8763 9.92386 19.8748 11.0465C19.8748 15.7153 16.1137 19.5001 11.4749 19.5001C6.83442 19.5001 3.07387 15.7148 3.07387 11.0465C3.07387 9.87963 3.30855 8.76786 3.73327 7.75669C3.23663 7.51972 2.78301 7.20027 2.39138 6.81169C1.06733 5.47969 0.484589 3.1418 1.55821 2.0618C2.63182 0.981799 4.95546 1.56786 6.27845 2.89986Z"
                      stroke="#262526"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.5 16.853C13.8196 16.853 15.7 15.1938 15.7 13.1471C15.7 11.1004 13.8196 9.44122 11.5 9.44122C9.18044 9.44122 7.30005 11.1004 7.30005 13.1471C7.30005 15.1938 9.18044 16.853 11.5 16.853Z"
                      stroke="#262526"
                      stroke-width="1.5"
                    />
                    <path
                      d="M7.82514 8.38242C8.40503 8.38242 8.87513 7.90837 8.87513 7.32359C8.87513 6.73882 8.40503 6.26477 7.82514 6.26477C7.24524 6.26477 6.77515 6.73882 6.77515 7.32359C6.77515 7.90837 7.24524 8.38242 7.82514 8.38242Z"
                      fill="#262526"
                    />
                    <path
                      d="M9.92499 14.206C10.5049 14.206 10.975 13.7319 10.975 13.1471C10.975 12.5624 10.5049 12.0883 9.92499 12.0883C9.3451 12.0883 8.875 12.5624 8.875 13.1471C8.875 13.7319 9.3451 14.206 9.92499 14.206Z"
                      fill="#262526"
                    />
                    <path
                      d="M15.175 8.38242C15.7549 8.38242 16.225 7.90837 16.225 7.32359C16.225 6.73882 15.7549 6.26477 15.175 6.26477C14.5951 6.26477 14.125 6.73882 14.125 7.32359C14.125 7.90837 14.5951 8.38242 15.175 8.38242Z"
                      fill="#262526"
                    />
                    <path
                      d="M13.075 14.206C13.6549 14.206 14.125 13.7319 14.125 13.1471C14.125 12.5624 13.6549 12.0883 13.075 12.0883C12.4951 12.0883 12.025 12.5624 12.025 13.1471C12.025 13.7319 12.4951 14.206 13.075 14.206Z"
                      fill="#262526"
                    />
                  </svg>
                </div>

                <span
                  className=" ml-4 sideText"
                  sidebar-toggle-item
                >
                  Add Batch
                </span>

                <div className={svgWrapper}>
                  {toggle.batch ?
                    <GoTriangleLeft className="text-primary" />
                    :
                    <GoTriangleDown className="text-primary-deep" />
                  }
                </div>
              </button>
              <ul id="dropdown-batch" className={`${toggle.batch ? "" : `hidden`} py-2 space-y-2`}>
                <li>
                  <Link
                    href="#"
                    className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]`}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`flex itemscenter w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]`}
                  >
                    Billing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className={`flex items-center w-fit m-auto p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white dark:hover:bg-gray-700 text-[1.4rem]`}
                  >
                    Invoice
                  </Link>
                </li>
              </ul>
            </li> */}