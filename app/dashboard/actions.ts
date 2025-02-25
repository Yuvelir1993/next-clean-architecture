"use server";

import { cookies } from "next/headers";

import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { redirect } from "next/navigation";

export async function signOutAction() {
  console.log("Signing out...");

  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("AwsCognitoSession")?.value;

    if (!sessionToken) {
      console.warn("No session token found.");
      return;
    }

    const authController = getInjection<IAuthenticationController>(
      DI_SYMBOLS.IAuthenticationController
    );
    const sessionCookie = await authController.signOut(sessionToken);

    console.log(
      `Obtained session after signing out: ${JSON.stringify(sessionCookie)}`
    );

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    redirect("/");
  } catch {}
}
