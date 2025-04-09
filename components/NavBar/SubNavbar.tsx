"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const SubNavBar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); 
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className=" bg-[#043873] !z-50 shadow-xl">
      <div className="w-[90%] mx-auto flex  justify-between items-center py-4">
        <div
          className=" cursor-pointer flex gap-4 items-center"
          onClick={() => router.push("/")}
        >
          <img src="/Logo Icon.svg" className="" alt="" />
         <span className="text-[24px] font-bold text-white"> Degree Find Out</span>
        </div>

        <div className="flex items-center">
            
          <div className="relative" ref={dropdownRef}>
            <button
              className="bg-[#4F9CF9] relative hover:bg-[#347bd1] !z-50 text-white rounded-[10px] text-[18px] font-semibold py-2 px-3"
              onClick={toggleDropdown}
            >
              Login
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <button
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 rounded-[10px]"
                    onClick={() => {
                      router.push("/admin-login");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Login as Admin
                  </button>
                  <button
                    className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-100 rounded-[10px]"
                    onClick={() => {
                      router.push("/university-login");
                      setIsDropdownOpen(false);
                    }}
                  >
                    Login as University
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubNavBar;
