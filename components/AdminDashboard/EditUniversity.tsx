import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { createUniversityFunction, UniverSityTypes, updateUniversityFunction } from "./request";
import { GettingAllUniversityData } from "../FindDegree/request";
import { FaArrowLeft, FaUniversity } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";

const EditUniversity = () => {
  const [selectedUniversity, setSelectedUniversity] =
    useState<UniverSityTypes | null>(null);

  const {
    data: universityData,
    isPending: dataPending,
    isError: dataIsError,
    error: universityError,
  } = useQuery({
    queryKey: ["getting-all-universities-data"],
    queryFn: GettingAllUniversityData,
  });

  const [formData, setFormData] = useState({
    _id: "",
    email: "",
    name: "",
    number: 0,
    password: "",
    confirmPassword: "",
    code: "",
  });

  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (selectedUniversity) {
      setFormData({
        _id: selectedUniversity._id||"",
        email: selectedUniversity.email || "",
        name: selectedUniversity.name || "",
        number: selectedUniversity.number || 0,
        password: "",
        confirmPassword: "",
        code: selectedUniversity.code || "",
      });
    }
  }, [selectedUniversity]);

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = universityData?.find(
      (university) => university._id === e.target.value
    );
    setSelectedUniversity(selected || null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const mutation = useMutation({
    mutationFn: updateUniversityFunction,
    onSuccess: () => {
      alert("Added successful!");
      setSelectedUniversity(null)
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a special symbol."
      );
      return;
    }
    setError("");
    console.log(formData)
    mutation.mutate(formData);
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
      <div className="text-[24px] font-bold text-[#033773]">Edit University</div>

      {selectedUniversity ? (
        <div className="border border-solid border-gray-300 rounded-[10px] w-full px-6 py-4 mt-4">
          <div className="flex items-center justify-between pb-4">
            <FaArrowLeft
            className="cursor-pointer text-[20px]"
              onClick={() => {
                setSelectedUniversity(null);
              }}
            />
            <h2 className="text-[24px] font-semibold">Please Update the data</h2>
            <div></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-[18px] font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
              />
            </div>

            <div className="mb-4">
              <label className="text-[18px] font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
              />
            </div>
            {/* <div className="mb-4">
              <label>Code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div> */}
            <div className="mb-4">
              <label className="text-[18px] font-medium">Number:</label>
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
              />
            </div>
            <div className="mb-4">
              <label className="text-[18px] font-medium">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
              />
            </div>
            <div className="mb-2">
              <label className="text-[18px] font-medium">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded-[10px]"
              />
            </div>
            {error && <p className="text-red-500 pb-2">{error}</p>}
            <button
              type="submit"
              className="w-[200px] font-bold hover:bg-[#043873a1] bg-[#033773] text-white p-2 rounded-[10px]"
              >
              Submit
            </button>
          </form>
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

export default EditUniversity;
