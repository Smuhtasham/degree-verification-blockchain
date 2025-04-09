"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { Globe } from "../UI/Globe";
const HomeMain = () => {

  const router = useRouter();

  return (
    <section className="bg-[#043873] h-[calc(100vh-75px)] relative">
      <img
        src="/Element.svg"
        className="absolute top-[-80px] left-0 z-0"
        alt=""
      />
      <div className="w-[80%] justify-center items-center mx-auto flex relative !z-20">
        <div className="w-[50%] pt-32">
          <div className=" text-white pb-8">
            <p className="text-[45px] font-bold z-10">
              Blockchain-Powered Degree Verification
            </p>
            <p className="pt-4 text-[20px] font-normal z-10">
              Verify academic degrees with blockchain security—fast, reliable,
              and fraud-proof. Say goodbye to fake credentials and lengthy
              verification processes. Secure your trust in education with our
              decentralized system.
            </p>
          </div>

          <button
            className="cursor-pointer bg-[#4F9CF9] hover:bg-[#347bd1] z-10 text-white py-2 px-4 text-[18px] font-semibold rounded-[10px] "
            onClick={() => router.push("/find-degree")}
          >
            Search Your Degree
          </button>
        </div>

        <div className="w-[50%] flex justify-center items-center">
          {/* <img
            src="/globe1.svg"
            className="absolute w-[45%] top-[-20px] right-0 z-0"
          /> */}
          <div className="absolute w-[45%] top-[0px] -right-[30px] z-0">
          <Globe />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeMain;
