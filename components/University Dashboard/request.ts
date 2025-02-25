import instance from "@/auth/instance";
import { UniverSityTypes } from "../AdminDashboard/request";
import getToken from "@/auth/getToken";
import useSession from "@/auth/useSession";

export interface StudentDataProps {
  registrationNumber: string;
  cnic: string;
  universityName: string;
  universityCode: string;
  degreeImageIPFS: string;
  status: boolean;
}

export const CreateStudentDegree = async (data: StudentDataProps) => {
  const token = await getToken();
  const res = await instance.post("/add-studetn-degree", data, {
    headers: {
      Authorization: token,
    },
  });
  return res.data;
};

export const GettingAllUniversityData = async () => {
  const token = await getToken();
  const res = await instance.get<UniverSityTypes>(
    "/getting-all-universities-data",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return res.data;
};
