"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import UniversityLeftDashboard from "./UniversityLeftDashboard";
import {
  CreateStudentDegree,
  GettingAllUniversityData,
  StudentDataProps,
} from "./request";
import { LuLoader } from "react-icons/lu";
import { UniverSityTypes } from "../AdminDashboard/request";
import { upload } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { data } from "framer-motion/client";
// import { UniverSityTypes } from "./request";

const UniversityDashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    "add-degree"
  );
  const [formData, setFormData] = useState<StudentDataProps>({
    registrationNumber: "",
    universityName: "",
    universityCode: "",
    degreeImageIPFS: "",
    status: false,
    cnic: "",
  });

  const [error, setError] = useState<string>("");

  const {
    data: universityData,
    isPending,
    isError,
    error: universityError,
  } = useQuery({
    queryKey: ["getting-all-universities-data"],
    queryFn: GettingAllUniversityData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "cnic") {
      // Allow only digits and dashes in the CNIC format
      const formattedValue = value.replace(/[^0-9-]/g, "");

      // Ensure it follows the `xxxxx-xxxxxxx-x` format
      if (
        !/^\d{5}-\d{7}-\d{1}$/.test(formattedValue) &&
        formattedValue !== ""
      ) {
        setError("CNIC format must be xxxxx-xxxxxxx-x");
      } else {
        setError("");
      }

      setFormData({ ...formData, cnic: formattedValue });
      return;
    }

    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const client = createThirdwebClient({
    clientId: "31f54069360e98a8069548df9aedcdfe",
  });
  const mutation = useMutation({
    mutationFn: CreateStudentDegree,
    onSuccess: () => {
      alert("Added successfully!");
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    console.log(formData);
    mutation.mutate(formData);
  };

  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    console.log({ file });
  
    try {
      const uploadedFile = await upload({
        client,
        files: [file],
        uploadWithoutDirectory: true,
      });
  
      console.log({ uploadedFile });
  
      if (uploadedFile && uploadedFile[0]) {
        setFormData((prev) => ({
          ...prev,
          degreeImageIPFS: uploadedFile, // Extract the correct URL or CID
        }));
      } else {
        console.error("Upload failed or returned an empty response.");
      }
    } catch (error) {
      console.error("File upload error:", error);
    }
  };
  
  useEffect(() => {
    if (universityData)
      setFormData((prev) => ({
        ...prev,
        universityName: universityData.name,
        universityCode: universityData.code,
      }));
  }, [universityData]);

  if (isPending) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <LuLoader className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div>Error: {universityError?.message}</div>;
  }
  console.log(universityData);

  return (
    <div className="flex h-[calc(100vh-62px)]">
      <div className="w-[20%] border-r border-solid border-gray-200 h-full overflow-auto p-5">
        <UniversityLeftDashboard
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <div className="w-[80%] h-full overflow-auto p-5">
        <div className="text-[24px] font-bold">Add Student Degree</div>
        <div className="border border-solid border-gray-300 rounded-[10px] w-[90%] p-5 h-[80%] mt-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>Registration Number:</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label>CNIC:</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label>Degree Image IPFS:</label>
              <input
                type="file"
                name="degreeImageIPFS"
                onChange={handleChangeFile}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4 flex items-center">
              <label>Status:</label>
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="ml-2"
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-500 text-white p-2 rounded flex gap-2 items-center justify-center"
            >
              {mutation.isPending && <LuLoader className="animate-spin" />}
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
