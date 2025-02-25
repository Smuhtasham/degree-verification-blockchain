import instance from "@/auth/instance";

export interface UniverSityTypes {
 _id?:string
  email: string;
  name: string;
  code: string;
  number: number;
  password: string;
}

export const createUniversityFunction = async (data: UniverSityTypes) => {
    console.log(data)
  const res= await instance.post("/add-university", data);
  return res.data
};
