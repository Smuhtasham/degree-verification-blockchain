"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { LoginTypes, UniversityLoginFunction } from "./request";
import { useRouter } from "next/navigation";
import { setSession } from "@/auth/setSession";


const UniversityLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router=useRouter()

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: UniversityLoginFunction,
    onSuccess: (res) => {
      setSession(res.data.token)
      setEmail("");
      setPassword("");
      router.push("/university-dashboard")
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: LoginTypes = {
      username:email,
      password,
    };
    mutate(formData);
  };

  return (
    <div className="flex">
<div className="w-[50%]"><img src="/abstract.jpg" className="w-full h-[100vh] object-cover" alt="" /></div>
<div className="w-[50%] flex justify-center items-center h-[100vh] bg-[#043873]">
      <div className="w-[40%] bg-[#ffffff5a] backdrop-blur-sm py-5 px-8 rounded-xl">
        <div>
          <h1 className="flex items-center gap-2 text-center text-[28px] text-white font-semibold">
            <img src="/Logo Icon.svg" alt="" />
            University Login</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="flex flex-col">
            <label className=" text-white font-semibold">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 placeholder:text-white text-white focus:outline-none bg-transparent border-b border-solid border-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex flex-col relative">
            <label className=" text-white font-semibold">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2 placeholder:text-white text-white focus:outline-none bg-transparent border-b border-solid border-white"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-white right-4 top-[62%] -translate-y-[50%]   text-[20px]"
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {isError && (
            <p className="text-red-500">Login failed. Please try again.</p>
          )}
          {isSuccess && (
            <p className="text-green-500">Login successful!</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-[#043873] text-white rounded-md hover:bg-[#043873be]"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
          
        </form>
      </div>
    </div>
    </div>
  );
};

export default UniversityLogin;
