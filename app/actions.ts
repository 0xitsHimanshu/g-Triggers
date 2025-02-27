"use server";

import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";

// Sign-up Action
export async function signUpAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await axios.post("http:/localhost:3000/api/auth/signup", {
      email,
      password,
    });

    // WHEN USER IS SUCCESSFULLY SIGNED UP THEN IUSER GET REDIRECTED TO THE SIGN-IN PAGE AND IF NOT THEN USER GET REDIRECTED TO SIGN-UP PAGE
    if (response.status === 200) {
      redirect("/sign-in?message=Sign-up successful. Please log in.");
    } else {
      console.log(response.data)
      redirect(`/sign-up?message=${encodeURIComponent(response.data.message)}/Sign-up-failed`);
    }
  } catch (error: any) {
    redirect(`/sign-up?message=${encodeURIComponent(error.response?.data?.message || "Sign-up failed")}`);
  }
}


export async function signInAction( formData: FormData ): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // Use NextAuth's `signIn` function
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      redirect(`/sign-in?message=${encodeURIComponent(result.error)}`); // Redirect to the sign-in page with an error message
    }
    redirect("/platform"); // Redirect to the home page
  } catch (error: any) {
    redirect(`/sign-in?message=${encodeURIComponent(error.response?.data?.message || "Sign-in failed")}`);
  }
}


/**
 * Forgot Password Action
 * @param {string} email - User's email to send the reset link
 * @returns {Promise<any>}
 */
export const forgotPasswordAction = async (email: string) => {
  try {
    const response = await axios.post("/api/requestPasswordReset", { email });
    return response.data; // e.g., { message: "Password reset link sent" }
  } catch (error: any) {
    console.error("Forgot password error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Reset Password Action
 * @param {string} token - Reset token received via email
 * @param {string} newPassword - The new password to set
 * @returns {Promise<any>}
 */
export const resetPasswordAction = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post("/api/resetPassword", {
      token,
      newPassword,
    });
    return response.data; // e.g., { message: "Password reset successful" }
  } catch (error: any) {
    console.error("Reset password error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
