// mutations.ts

import getToken from "@/auth/getToken";
import instance from "@/auth/instance";
import axios from "axios";
import { UniverSityTypes } from "../AdminDashboard/request";

export type FormDataType = {
  registrationNumber: string;
  cnic: string;
  universityName: string;
  universityCode: string;
};



export const GettingAllUniversityData=async()=>{
  const token = await getToken();
  const res = await instance.get<UniverSityTypes[]>(
    "/getting-all-universities-data",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;

}

export const GettingDegreeData = async (data: FormDataType) => {
console.log(data)
    const response = await instance.post("/degree-data", data);
  return response.data;
};
