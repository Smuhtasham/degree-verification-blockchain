"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GettingDegreeData, FormDataType, GettingAllUniversityData } from "./request";
import { UniverSityTypes } from "../AdminDashboard/request";
import { MediaRenderer } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const FindDegree = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<UniverSityTypes | null>(null);

  const { mutate, isPending, isError, isSuccess,data } = useMutation({
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
  const client = createThirdwebClient({
      clientId: "31f54069360e98a8069548df9aedcdfe",
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

  console.log(data)

  return (
    <div className="flex justify-center items-center bg-[#043873] h-[100vh] overflow-hidden relative">
      <img src="/Element.svg" className="absolute object-cover w-full h-[100vh] overflow-hidden z-1" alt="" />
      <img src="/globe1.svg" className="absolute z-10 -bottom-14 right-0 w-[610px]"  alt="" />
      <div className=" bg-[#ffffff5a] text-white backdrop-blur-sm pt-8 pb-4 px-12 rounded-xl w-[35%] z-50">
        <div>
          <h1 className="text-center flex gap-6 items-center text-[28px] font-bold">
           <img src="/Logo Icon.svg" alt="" /> Find Your Degree Here
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Registration Number:</label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="p-2 placeholder:text-white text-white focus:outline-none bg-transparent border-b border-solid border-white"
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
              className="p-2 placeholder:text-white text-white focus:outline-none bg-transparent border-b border-solid border-white"
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
              className="p-2 placeholder:text-white text-white focus:outline-none bg-transparent border-b border-solid border-white"
              required
            >
              <option value="">Select University</option>
              {universityData?.map((university) => (
                <option className="text-black" key={university._id} value={university._id}>
                  {`${university.name} (${university.code})`}
                </option>
              ))}
            </select>
          </div>
          {isError && (
            <p className="text-red-500">Submission failed. Please try again.</p>
          )}
          {isSuccess && (
            <p className="text-green-500">Data submitted successfully!</p>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-[#043873] font-semibold text-white rounded-md hover:bg-[#043873a1]"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>

              {data&&<MediaRenderer src={data.data[3]} client={client}/>}

              


          
        </form>
      </div>
    </div>
  );
};

export default FindDegree;
