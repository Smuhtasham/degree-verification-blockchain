"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GettingDegreeData, FormDataType } from "./request";

const FindDegree = () => {
  const [rollNo, setRollNo] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [universityName, setUniversityName] = useState("");

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: GettingDegreeData,
    onSuccess: () => {
      alert("Data submitted successfully!");
      setRollNo("");
      setRegistrationNumber("");
      setUniversityName("");
    },
    onError: () => {
      alert("An error occurred while submitting the data.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormDataType = {
      rollNo,
      registrationNumber,
      universityName,
    };
    mutate(formData);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-62px)] bg-black bg-opacity-30">
      <div className="p-6 h-[50vh] w-[40%] border border-solid border-gray-300 rounded-[10px] bg-white">
        <div>
          <h1 className="text-center text-[28px] font-bold">
            Find Your Degree Here
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Roll Number:</label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Enter your roll number"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Registration Number:</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Enter your registration number"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">University Name:</label>
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Enter university name"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
          {isError && (
            <p className="text-red-500">Submission failed. Please try again.</p>
          )}
          {isSuccess && (
            <p className="text-green-500">Data submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FindDegree;
