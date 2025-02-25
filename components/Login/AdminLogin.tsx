"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AdminLoginFunction, LoginTypes } from "./request";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { setSession } from "@/auth/setSession";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: AdminLoginFunction,
    onSuccess: (res) => {
      console.log(res);
      setSession(res.token);
      alert("Login successful!");
      setUserName("");
      setPassword("");
      router.push("/admin-dashboard");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: LoginTypes = {
      username: UserName,
      password,
    };
    console.log(formData);
    mutate(formData);
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-62px)] bg-black bg-opacity-30">
      <div className="p-6 h-[50vh] w-[40%] border border-solid border-gray-300 rounded-[10px] bg-white">
        <div>
          <h1 className="text-center text-[28px] font-bold">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Username:</label>
            <input
              type="text"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              className="py-2    focus:outline-none border-b border-solid border-gray-300"
              placeholder="Enter your Username"
              required
            />
          </div>
          <div className="flex flex-col relative">
            <label className="mb-2 font-semibold">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2    focus:outline-none border-b border-solid border-gray-300"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[60%] -translate-y-[50%]   text-[20px]"
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          {isError && (
            <p className="text-red-500">Login failed. Please try again.</p>
          )}
          {isSuccess && <p className="text-green-500">Login successful!</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
