"use client";
import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const menuItems = [
  {
    title: "Add University",
    value: "add-university",
    icon: <IoIosAddCircleOutline />,
  },
  {
    title: "Edit University",
    value: "edit-university",
    icon: <CiEdit />,
  },
  {
    title: "Delete University",
    value: "delete-university",
    icon: <MdDelete />,
  },
];

interface PropsType{
    selectedOption:string|null,
    setSelectedOption:React.Dispatch<React.SetStateAction<string|null>>
}

const AdminLeftDashboard= ({selectedOption,setSelectedOption}:PropsType) => {

  const handleRoute = (value: string) => {
    setSelectedOption(value);
    // Add your routing logic here, e.g., using Next.js router
    // router.push(`/admin/${value}`);
  };

  return (
    <div className="h-full py-2 ">
      <div className="flex flex-col gap-2  ">
        {menuItems.map((item) => (
          <div
            key={item.value}
            onClick={() => handleRoute(item.value)}
            className={`text-[#222] px-4 py-2 text-[20px] cursor-pointer rounded-r-[10px] flex gap-4 items-center
                            ${
                              selectedOption === item.value
                                ? "bg-[#dc8c8c51] text-[#bc2b2b] border-l-[5px] border-solid border-[#bc2b2b]"
                                : ""
                            }
                            hover:text-[#bc2b2b]`}
          >
            {item.icon} {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLeftDashboard;
