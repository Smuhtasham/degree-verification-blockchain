import instance from "@/auth/instance";

export const GettingDegreeDataForVerification = async (data: String) => {
  console.log(data);
  const response = await instance.post(`/degree-data-for-verification/${data}`, );
  return response.data;
};
