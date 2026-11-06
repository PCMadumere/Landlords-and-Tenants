import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?mode=signin");
  const { data: profile } = await supabase.from("profiles").select("id,full_name,email,avatar_url,role").eq("id", user.id).single();
  if (!profile) redirect("/account?error=profile_missing");
  const requested = (await searchParams).role;
  const allowed = profile.role === "admin" || !requested || requested === profile.role;
  if (!allowed) redirect(`/dashboard?role=${profile.role}`);
  return <DashboardClient role={profile.role} profile={profile} />;
}
