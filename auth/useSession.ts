"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
// cool
interface Session {
  sessionStatus: string;
  userId: string;
}

const useSession = () => {
  const cookieStore = cookies();
  const sessionStatus = cookieStore.get("accessToken");
  //
  if (sessionStatus) {
    try {
      const decoded: JwtPayload | null = jwt.decode(
        sessionStatus.value
      ) as JwtPayload;

      if (decoded && typeof decoded.userId === "string") {
        return {
          sessionStatus: sessionStatus.value,
          userId: decoded.userId,
        };
      } else {
        return { sessionStatus: "", userId: "" };
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      return {
        sessionStatus: "",
        userId: "",
      };
    }
  } else {
    return { sessionStatus: "", userId: "" }; // No token found
  }
};

export default useSession;
