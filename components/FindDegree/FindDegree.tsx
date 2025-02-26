"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GettingDegreeData, FormDataType, GettingAllUniversityData } from "./request";
import { UniverSityTypes } from "../AdminDashboard/request";

const FindDegree = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<UniverSityTypes | null>(null);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: GettingDegreeData,
    onSuccess: () => {
      alert("Data submitted successfully!");
      setRegistrationNumber("");
      setCnic("");
      setSelectedUniversity(null);
    },
    onError: () => {
      alert("An error occurred while submitting the data.");
    },
  });

  const {
    data: universityData,
    isPending: dataPending,
    isError: dataIsError,
    error,
  } = useQuery({
    queryKey: ["getting-all-universities-data"],
    queryFn: GettingAllUniversityData,
  });

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = universityData?.find((university) => university._id === e.target.value);
    setSelectedUniversity(selected || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniversity) {
      alert("Please select a university.");
      return;
    }
    const formData: FormDataType = {
      registrationNumber,
      cnic,
      universityName: selectedUniversity.name,
      universityCode: selectedUniversity.code,
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
            <label className="mb-1 font-semibold">Registration Number:</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Enter your registration number"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">CNIC:</label>
            <input
              type="text"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
              placeholder="Enter your CNIC"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">University Name:</label>
            <select
              name="universityName"
              value={selectedUniversity?._id || ""}
              onChange={handleUniversityChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select University</option>
              {universityData?.map((university) => (
                <option key={university._id} value={university._id}>
                  {`${university.name} (${university.code})`}
                </option>
              ))}
            </select>
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
