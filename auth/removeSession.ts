"use server";
import { cookies } from "next/headers";

const removeSession = (): boolean => {
    const cookieStore = cookies();
    const sessionStatus = cookieStore.get("accessToken");

    if (sessionStatus) {
        cookieStore.set("accessToken", "", { 
            path: "/", 
            expires: new Date(0) // Set to past date to remove the cookie
        });
        return true; // Cookie successfully removed
    } else {
        return false; // No cookie found to delete
    }
};

export default removeSession;7
