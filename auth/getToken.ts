"use server";
import { cookies } from "next/headers";

const getToken = () => {
  const cookieStore = cookies();
  const sessionStatus = cookieStore.get("token");
  if (sessionStatus) {
    return sessionStatus.value;
  } else {
    return "";
  }
};

export default getToken;
