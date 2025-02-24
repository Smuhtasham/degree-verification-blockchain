// mutations.ts

import instance from "@/auth/instance";
import axios from "axios";

export interface FormDataType {
  rollNo: string;
  registrationNumber: string;
  universityName: string;
}

export const GettingDegreeData = async (data: FormDataType) => {
console.log(data)
    const response = await instance.post("/degree-data", data);
  return response.data;
};
