"use client";
import React, { useState } from "react";
import AdminLeftDashboard from "./AdminLeftDashboard";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { createUniversityFunction } from "./request";
import AddUniversity from "./AddUniversity";
import EditUniversity from "./EditUniversity";
import DeleteUniversity from "./DeleteUniversity";

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(
    "add-university"
  );

  return (
    <div className="flex h-[100vh]">
      <div className="w-[20%] border-r border-solid border-gray-200 h-full overflow-auto">
        <AdminLeftDashboard
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <div className="w-[80%] h-full overflow-auto p-8">
        {selectedOption === "add-university" && <AddUniversity />}
        {selectedOption === "edit-university" && <EditUniversity />}
        {selectedOption === "delete-university" && <DeleteUniversity />}
      </div>
    </div>
  );
};

export default AdminDashboard;
