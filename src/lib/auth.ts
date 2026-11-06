import { createClient } from "@/utils/supabase/client";

export async function signInWithGoogle(requestedRole: string = "tenant") {
  const supabase = createClient();

  // Store the requested role locally for the OAuth callback.
  const allowedRoles = ["tenant", "landlord", "caretaker"];

  const role = allowedRoles.includes(requestedRole)
    ? requestedRole
    : "tenant";

  sessionStorage.setItem("requested_role", role);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    sessionStorage.removeItem("requested_role");
    console.error("Google sign-in error:", error.message);
    throw error;
  }
}