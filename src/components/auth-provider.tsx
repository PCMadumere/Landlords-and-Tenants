"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type Profile = { id: string; full_name: string | null; email: string | null; avatar_url: string | null; phone: string | null; role: "tenant" | "landlord" | "caretaker" | "admin" };
type AuthState = { user: User | null; profile: Profile | null; loading: boolean; signOut: () => Promise<void> };
const AuthContext = createContext<AuthState>({ user: null, profile: null, loading: true, signOut: async () => {} });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => {
    let active = true;
    const load = async (id?: string) => {
      const { data: { user: current } } = await supabase.auth.getUser();
      if (!active) return;
      setUser(current);
      if (current) {
        const { data } = await supabase.from("profiles").select("id,full_name,email,avatar_url,phone,role").eq("id", id || current.id).maybeSingle();
        if (active) setProfile(data as Profile | null);
      } else setProfile(null);
      if (active) setLoading(false);
    };
    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void load(session?.user.id);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  const signOut = async () => { const { error } = await supabase.auth.signOut(); if (error) throw error; setUser(null); setProfile(null); window.location.assign("/account"); };
  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
