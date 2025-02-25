"use server";
import { cookies } from "next/headers";

const getToken = async () => {
    const cookieStore = await cookies(); // Await the promise
    const sessionStatus = cookieStore.get("token");
    
    return sessionStatus ? sessionStatus.value : "";
};

export default getToken;
