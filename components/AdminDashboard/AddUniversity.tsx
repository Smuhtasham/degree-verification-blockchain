import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { createUniversityFunction } from "./request";

const AddUniversity = () => {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        code: "",
        number: 0,
        password: "",
        username: "",
        confirmPassword: "",
      });
    
      const [error, setError] = useState<string>("");
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({
          ...formData,
          [name]: type === "number" ? Number(value) : value,
        });
      };
    
      const validatePassword = (password: string) => {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
      };
    
      const mutation = useMutation({
        mutationFn: createUniversityFunction,
        onSuccess: (res) => {
          alert("Added successful!");
        },
        onError: (error) => {
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
        mutation.mutate(formData);
      };
  return (
    <div>
      <div className="text-[24px] font-bold">Add University</div>
      <div className="border border-solid border-gray-300 rounded-[10px] w-[90%] p-5 h-[80%] mt-5">
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
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
          <div className="mb-4">
            <label>Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
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
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUniversity;
