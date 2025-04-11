"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { GettingDegreeDataForVerification } from "./request";
import { LuLoader } from "react-icons/lu";
import { TiTick } from "react-icons/ti";
import { MdClose } from "react-icons/md";

const DegreeVerification = () => {
  const params = useParams();
  const cnic = params.cnic;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["degree-verification", cnic],
    queryFn: () => {
      if (typeof cnic === "string") {
        return GettingDegreeDataForVerification(cnic);
      }
      throw new Error("Invalid CNIC");
    },
  });

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <LuLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (isError) {
    let errorMessage = "Something went wrong.";
  
    if (error.message === "Request failed with status code 404") {
      errorMessage = "Degree not found.";
    } else if (error?.message) {
      errorMessage = error.message;
    }
  
    return (
      <div className="h-screen flex justify-center items-center bg-red-50">
        <p className="text-red-600 font-medium">{errorMessage}</p>
      </div>
    );
  }
  

  const universityName = data?.data?.[1] ?? "N/A";
  const isVerified = data?.data?.[4] === true;

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-[90%] max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Degree Verification Result</h1>

        <p className="text-lg text-gray-600 mb-6">
          <span className="font-semibold">University:</span> {universityName}
        </p>

        {isVerified ? (
          <div className="flex flex-col items-center text-green-600">
            <TiTick className="text-6xl mb-2" />
            <p className="text-xl font-semibold">Your degree is verified!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-red-500">
            <MdClose className="text-6xl mb-2" />
            <p className="text-xl font-semibold">Your degree is not verified.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DegreeVerification;
