
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "@/app/dashboard/dashboard-client";

const allowedRoles = ["tenant", "landlord", "caretaker", "admin"] as const;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/account?error=profile_not_found");
  }

  const params = await searchParams;
  const requestedRole = params.role;
  const actualRole = profile.role as (typeof allowedRoles)[number];

  // Only an admin can switch between role workspaces. Query-string values never grant access.
  if (actualRole !== "admin" && requestedRole && requestedRole !== actualRole) {
    redirect(`/dashboard?role=${actualRole}`);
  }

  const displayRole =
    actualRole === "admin" && requestedRole && allowedRoles.includes(requestedRole as any)
      ? requestedRole
      : actualRole;

  return <DashboardClient initialRole={displayRole} />;
}
