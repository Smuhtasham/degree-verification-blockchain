import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { createUniversityFunction, UniverSityTypes, updateUniversityFunction } from "./request";
import { GettingAllUniversityData } from "../FindDegree/request";
import { FaArrowLeft } from "react-icons/fa";
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
      <div className="text-[24px] font-bold">Edit University</div>

      {selectedUniversity ? (
        <div className="border border-solid border-gray-300 rounded-[10px] w-[90%] p-5 h-[80%] mt-5">
          <div className="pb-4">
            <FaArrowLeft
            className="cursor-pointer text-[20px]"
              onClick={() => {
                setSelectedUniversity(null);
              }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
              <label>Number:</label>
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">University Name:</label>
          <select
            name="universityName"
            value={selectedUniversity || ""}
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
      )}
    </div>
  );
};

export default EditUniversity;
