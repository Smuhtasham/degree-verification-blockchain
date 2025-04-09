"use server";
import { cookies } from "next/headers";

const removeSession = async (): Promise<boolean> => {
    const cookieStore = await cookies(); // Await the promise
    const sessionStatus = cookieStore.get("token");

    if (sessionStatus) {
        cookieStore.set("token", "", { 
            path: "/", 
            expires: new Date(0) // Set to past date to remove the cookie
        });
        return true; // Cookie successfully removed
    } 
    return false; // No cookie found to delete
};

export default removeSession;
