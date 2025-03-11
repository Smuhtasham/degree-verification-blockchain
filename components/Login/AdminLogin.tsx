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
    <div className="flex justify-center items-center h-[100vh] bg-[#27262C] ">
      <div className=" w-[40%]   text-white">
        <div>
          <img src="Ellips 1.png" alt="" />
        </div>
        <div>
          <h1 className=" text-[32px] font-bold">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col">
            
            <input
              type="text"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              className="py-2    focus:outline-none bg-transparent border-b border-solid border-white"
              placeholder="Username"
              required
            />
          </div>
          <div className="flex flex-col relative">
        
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2   mt-3 focus:outline-none bg-transparent border-b border-solid border-white"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[60%] -translate-y-[50%]   text-[20px] "
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-[#4044ED] mt-4 text-white rounded-md hover:bg-blue-600"
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
