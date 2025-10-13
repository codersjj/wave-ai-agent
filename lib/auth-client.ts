import { createAuthClient } from "better-auth/react";
import { useAuthToken } from "@/hooks/use-auth-token";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
      // Store the token securely (e.g., in localStorage)
      if (authToken) {
        // localStorage.setItem("bearer_token", authToken);
        useAuthToken.getState().setBearerToken(authToken);
      }
    },
    auth: {
      type: "Bearer",
      // token: () => localStorage.getItem("bearer_token") || "", // get the token from localStorage
      token: () => useAuthToken.getState().bearerToken || "", // get the token from localStorage
    },
  },
});
