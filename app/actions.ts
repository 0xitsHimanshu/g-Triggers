import axios from "axios";

/**
 * Sign Up Action
 * @param {Object} userData - Contains email, password, and other optional user details
 * @returns {Promise<any>}
 */
export const signUp = async (userData: {
  email: string;
  password: string;
  name?: string;
}) => {
  try {
    const response = await axios.post("/api/signup", userData);
    return response.data; // e.g., { message: "User registered successfully", user }
  } catch (error: any) {
    console.error("Sign-up error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Sign In Action
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<any>}
 */
export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post("/api/signin", { email, password });
    return response.data; // e.g., { message: "Sign-in successful", token }
  } catch (error: any) {
    console.error("Sign-in error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Forgot Password Action
 * @param {string} email - User's email to send the reset link
 * @returns {Promise<any>}
 */
export const forgotPassword = async (email: string) => {
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
export const resetPassword = async (token: string, newPassword: string) => {
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
