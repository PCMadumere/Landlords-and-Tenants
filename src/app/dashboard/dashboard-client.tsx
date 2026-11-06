"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

export default function DashboardClient({ initialRole }: { initialRole: string }) {
  const { profile, signOut } = useAuth();
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("role");
    if (requested !== initialRole) {
      history.replaceState({}, "", `/dashboard?role=${initialRole}`);
    }
    document.body.dataset.page = "dashboard";
    const script = document.createElement("script");
    script.src = "/app.js";
    script.async = false;
    script.dataset.awkaApp = "true";
    document.body.appendChild(script);
    const roleSwitch = document.getElementById("role-switch") as HTMLSelectElement | null;
    if (roleSwitch) {
      roleSwitch.value = initialRole;
      roleSwitch.disabled = initialRole !== "admin";
    }
    const signOutButton = document.getElementById("sign-out-button");
    const handleSignOut = async () => {
      try { await signOut(); }
      catch (error) { console.error("Sign out failed:", error); alert("Could not sign out. Please try again."); }
    };
    signOutButton?.addEventListener("click", handleSignOut);
    return () => {
      signOutButton?.removeEventListener("click", handleSignOut);
      script.remove();
      delete document.body.dataset.page;
    };
  }, []);

  useEffect(() => {
    const avatar = document.getElementById("top-avatar");
    if (avatar) {
      const label = profile?.full_name || profile?.email || "User";
      avatar.textContent = label.split(/\\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
      if (profile?.avatar_url) {
        const image = document.createElement("img");
        image.src = profile.avatar_url;
        image.alt = "";
        image.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%";
        avatar.replaceChildren(image);
      }
    }
  }, [profile]);

  return <div dangerouslySetInnerHTML={{ __html: "<header class=\"dash-topbar\"><a class=\"brand\" href=\"/\"><span class=\"brand-mark\">A</span><span>awka<span\r\n                    class=\"brand-light\">direct</span><small>WORKSPACE</small></span></a>\r\n        <div class=\"dash-top-actions\"><span class=\"demo-tag\">SIGNED IN</span><button type=\"button\" id=\"sign-out-button\" class=\"btn btn-light\">Sign out</button><a href=\"/\"\r\n                class=\"btn btn-light\">Marketplace</a><span id=\"top-avatar\" class=\"avatar\">AD</span></div>\r\n    </header>\r\n    <div class=\"dashboard-layout\">\r\n        <aside class=\"sidebar\"><label class=\"role-switch-label\">Preview workspace<select id=\"role-switch\">\r\n                    <option value=\"tenant\">Tenant</option>\r\n                    <option value=\"landlord\">Landlord</option>\r\n                    <option value=\"caretaker\">Caretaker</option>\r\n                    <option value=\"admin\">Admin</option>\r\n                </select></label>\r\n            <nav id=\"side-nav\" class=\"side-nav\"></nav><a class=\"sidebar-market\" href=\"/\">\u2190 Back to\r\n                marketplace</a>\r\n        </aside>\r\n        <main class=\"dash-main\">\r\n            <div class=\"dash-heading\">\r\n                <div><span id=\"dash-eyebrow\" class=\"eyebrow\">WORKSPACE</span>\r\n                    <h1 id=\"dash-title\">Dashboard</h1>\r\n                    <p id=\"dash-subtitle\">Manage your activity.</p>\r\n                </div><button id=\"primary-action\" class=\"btn btn-primary\">Continue</button>\r\n            </div>\r\n            <div id=\"screen-content\"></div>\r\n            <footer class=\"dash-footer\">Awka Direct \u00b7 Demo data is stored in this browser only.</footer>\r\n        </main>\r\n    </div>\r\n    <dialog id=\"dash-dialog\" class=\"dialog\"><button class=\"dialog-close\" data-close-dialog aria-label=\"Close\">\u00d7</button>\r\n        <div id=\"dash-dialog-content\"></div>\r\n    </dialog>\r\n    <div id=\"toast\" class=\"toast\" role=\"status\"></div>" }} />;
}
