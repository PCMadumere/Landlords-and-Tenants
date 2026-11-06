import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/dashboard";

  // Prevent external redirects
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/dashboard";
  }

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }

    console.error("OAuth callback error:", error.message);
  }

  return NextResponse.redirect(
    new URL("/account?error=authentication_failed", origin)
  );
}