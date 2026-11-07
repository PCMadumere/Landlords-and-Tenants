import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const publicRoles = ["tenant", "landlord", "caretaker"] as const;
type PublicRole = (typeof publicRoles)[number];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedRole = url.searchParams.get("role");
  const role: PublicRole = publicRoles.includes(requestedRole as PublicRole)
    ? (requestedRole as PublicRole)
    : "tenant";

  if (!code) {
    return NextResponse.redirect(new URL("/account?error=authentication_failed", url.origin));
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error("OAuth callback error:", exchangeError.message);
    return NextResponse.redirect(new URL("/account?error=authentication_failed", url.origin));
  }

  // The RPC only permits a user to set their own non-admin role.
  const { error: roleError } = await supabase.rpc("set_my_initial_role", { requested_role: role });
  if (roleError) {
    console.error("Profile role setup error:", roleError.message);
    return NextResponse.redirect(new URL("/account?error=profile_setup_failed", url.origin));
  }

  return NextResponse.redirect(new URL("/dashboard", url.origin));
}
