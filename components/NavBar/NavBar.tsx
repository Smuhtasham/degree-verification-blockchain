"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const NavBar: React.FC = () => {
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
    <div className="border border-solid">
      <div className="w-[85%] mx-auto flex justify-between items-center py-3">
        <div className="text-[24px] font-bold cursor-pointer"
        onClick={()=>router.push("/")}
        >Find Your Degree</div>
        <div className="flex gap-3 items-center">
          <div>
            <button className="bg-[#bc2b2b] py-1 px-2 text-white rounded-[10px] "
            onClick={()=>router.push("/find-degree")}
            >
              Search You Degree
            </button>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="bg-blue-600 text-white rounded-[5px] text-[18px] py-1 px-2"
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
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => router.push("/admin-login")}
                  >
                    Login as Admin
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => router.push("/university-login")}
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

export default NavBar;
