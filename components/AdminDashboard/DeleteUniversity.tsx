import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { deleteUniversityFunction, UniverSityTypes } from "./request";  // Assuming there's a delete function
import { GettingAllUniversityData } from "../FindDegree/request";
import { FaArrowLeft, FaUniversity } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

const DeleteUniversity = () => {
  const queryClient = useQueryClient();  // Assuming you have a query client set up
  const [selectedUniversity, setSelectedUniversity] =
    useState<UniverSityTypes | null>(null);

  const {
    data: universityData,
    isPending: dataPending,
    isError: dataIsError,
    error: universityError,
    refetch
  } = useQuery({
    queryKey: ["getting-all-universities-data"],
    queryFn: GettingAllUniversityData,
  });

  const mutation = useMutation({
    mutationFn: deleteUniversityFunction, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getting-all-universities-data"] });
      alert("University deleted successfully!");
      setSelectedUniversity(null);
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = universityData?.find(
      (university) => university._id === e.target.value
    );
    setSelectedUniversity(selected || null);
  };

  const handleDelete = () => {
    if (selectedUniversity) {
      mutation.mutate(selectedUniversity);  // Pass the ID for deletion
    }
  };

  if (dataPending) {
    return (
      <div className="h-[70vh] flex justify-center items-center">
        <LuLoader className="animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="text-[24px] font-bold text-[#033773]">Delete University</div>

      {selectedUniversity ? (
        <div className="border border-solid border-gray-300 rounded-[10px] w-full px-6 py-4 mt-4">
          <div className="flex items-center justify-between pb-4">
            <FaArrowLeft
              className="cursor-pointer text-[20px]"
              onClick={() => {
                setSelectedUniversity(null);
              }}
            />
            <h2 className="text-[24px] font-semibold">Are you sure you want to delete this university?</h2>
            <div></div>
          </div>

          <div className="mb-4">
            <p><strong>Name:</strong> {selectedUniversity.name}</p>
            <p><strong>Email:</strong> {selectedUniversity.email}</p>
            <p><strong>Code:</strong> {selectedUniversity.code}</p>
            <p><strong>Number:</strong> {selectedUniversity.number}</p>
          </div>

          <button
            onClick={handleDelete}
            className="w-[200px] font-bold hover:bg-red-600 bg-red-500 text-white p-2 rounded-[10px]"
          >
            Delete University
          </button>
        </div>
      ) : (
        <div className="flex flex-col py-6 gap-2">
          <label className="text-[18px] font-medium">University Name:</label>
          <div className="relative w-full">
            <select
              name="universityName"
              value={selectedUniversity || ""}
              onChange={handleUniversityChange}
              className="w-full py-2 px-4 pr-10 border border-[#0000007d] rounded-[10px] appearance-none"
              required
            >
              <option value="">Select University</option>
              {universityData?.map((university) => (
                <option key={university._id} value={university._id}>
                  {`${university.name} (${university.code})`}
                </option>
              ))}
            </select>
            <FaUniversity className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteUniversity;
