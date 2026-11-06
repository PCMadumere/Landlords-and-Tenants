
import { createClient } from "@/utils/supabase/client";

export type AppRole = "tenant" | "landlord" | "caretaker";

export async function signInWithGoogle(profile: {
  role: AppRole;
  fullName?: string;
  phone?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // The database trigger accepts only ordinary account roles. Admin is never accepted here.
      data: {
        requested_role: profile.role,
        full_name: profile.fullName || "",
        phone: profile.phone || "",
      },
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
}
