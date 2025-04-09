"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AdminLoginFunction, LoginTypes } from "./request";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { setSession } from "@/auth/setSession";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";

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
    <div className="flex ">
      <div className="w-[50%]"><img src="/abstract.jpg" className="object-cover h-[100vh] w-full" alt="" /></div>
      <div className="w-[50%] bg-[#043873] flex justify-center items-center relative overflow-hidden">
      <div className="w-[40%] bg-[#ffffff5a] backdrop-blur-sm py-5 px-8 rounded-xl">
        <div className="flex items-center gap-2"><img src="/Logo Icon.svg" alt="" />
        <h1 className=" text-[32px] font-semibold text-white">Admin Login</h1></div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6 ">
          <div className="flex flex-col rounded-md">
            
            <input
              type="text"
              value={UserName}
              onChange={(e) => setUserName(e.target.value)}
              className="py-2 placeholder:text-white text-white focus:outline-none bg-transparent border-b border-solid border-white"
              placeholder="Username"
              required
            />
          </div>
          <div className="flex flex-col relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2 placeholder:text-white text-white  mt-3 focus:outline-none bg-transparent border-b border-solid border-white"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-white right-4 top-[60%] -translate-y-[50%]   text-[20px] "
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {isError && (
            <p className="text-red-500">Login failed. Please try again.</p>
          )}
          {isSuccess && <p className="text-green-500">Login successful!</p>}
          <button
            type="submit"
            className="w-full p-2 bg-[#043873] font-semibold mt-8 text-white rounded-md hover:bg-blue-600"
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

export default AdminLogin;
