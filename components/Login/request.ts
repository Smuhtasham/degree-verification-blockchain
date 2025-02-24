import instance from "@/auth/instance";

export interface LoginTypes {
  username: string;
  password: string;
}
export const AdminLoginFunction = async (data: LoginTypes) => {
  console.log(data);
  const response = await instance.post("/admin-login", data);
  return response.data;
};
export const UniversityLoginFunction = async (data: LoginTypes) => {
  const response = await instance.post("/university-login", data);
  return response.data;
};
