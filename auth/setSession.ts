"use server";

import { cookies } from "next/headers";

export const setSession = async (token: string) => {
  console.log({ token });
  (await cookies()).set("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // set to true if using https
  });
};
