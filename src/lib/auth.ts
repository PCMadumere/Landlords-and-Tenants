import { createClient } from "@/utils/supabase/client";

export type PublicRole = "tenant" | "landlord" | "caretaker";

export async function signInWithGoogle(role: PublicRole) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?role=${encodeURIComponent(role)}`,
    },
  });

  if (error) {
    console.error("Google sign-in error:", error.message);
    throw error;
  }
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  window.location.href = "/account";
}