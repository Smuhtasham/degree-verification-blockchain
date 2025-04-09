"use client";
import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdDeleteOutline, MdLogout, MdOutlineLibraryAdd } from "react-icons/md";
import LogoutModel from "../UI/LogoutModel";
import { TbEdit } from "react-icons/tb";

const menuItems = [
  {
    title: "Add University",
    value: "add-university",
    icon: <MdOutlineLibraryAdd className="text-[22px]" />,
  },
  {
    title: "Edit University",
    value: "edit-university",
    icon: <TbEdit className="text-[24px]"/>,
  },
  {
    title: "Delete University",
    value: "delete-university",
    icon: <MdDeleteOutline className="text-[24px]" />,
  },
];

interface PropsType {
  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdminLeftDashboard = ({
  selectedOption,
  setSelectedOption,
}: PropsType) => {
  const handleRoute = (value: string) => {
    setSelectedOption(value);
  };

  const [logoutModel,setLogoutModel]=useState(false)

  return (
    <div className="bg-[#043873] w-full h-full">
      <div className="h-full flex flex-col justify-between pb-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center mx-4 py-8 gap-4 border-b border-solid border-white pb-4">
            <img src="/Logo Icon.svg" alt="" />
            <h2 className="text-white !text-[24px] font-semibold">
              Admin Dashboard
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <div
                key={item.value}
                onClick={() => handleRoute(item.value)}
                className={`text-white mx-4 px-4 py-2 text-[20px] hover:bg-[#ffffff5a] cursor-pointer rounded-[10px] flex gap-4 items-center
                            ${
                              selectedOption === item.value
                                ? "bg-[#ffffff5a] backdrop-blur-sm text-white font-semibold "
                                : ""
                            }
                            `}
              >
                {item.icon} {item.title}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mx-4  pt-2 border-t border-white items-center text-white text-center text-[22px]">
          {" "}
          <span onClick={()=>setLogoutModel(true)} className="flex w-full pl-[20%] py-1 rounded-[10px] cursor-pointer gap-4 items-center font-semibold hover:bg-[#ffffff5a]"><MdLogout /> Logout</span>
        </div>
      </div>
      <LogoutModel ShowLogoutModel={logoutModel} setShowLogoutModel={setLogoutModel} />
    </div>
  );
};

export default AdminLeftDashboard;
