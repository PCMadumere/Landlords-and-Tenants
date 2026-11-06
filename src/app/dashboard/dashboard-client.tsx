"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

export default function DashboardClient({ role, profile }: { role: string; profile: { full_name: string | null; email: string | null; avatar_url: string | null } }) {
  const { signOut } = useAuth();

  useEffect(() => {
    document.body.dataset.page = "dashboard";
    const script = document.createElement("script");
    script.src = "/app.js";
    script.async = false;
    script.dataset.awkaApp = "true";
    document.body.appendChild(script);
    const roleSelect = document.getElementById("role-switch") as HTMLSelectElement | null;
    if (roleSelect) { roleSelect.value = role; roleSelect.disabled = true; }
    const topActions = document.querySelector(".dash-top-actions");
    if (topActions && !document.getElementById("auth-signout")) {
      const who = document.createElement("span"); who.textContent = profile.full_name || profile.email || "Account"; who.className = "demo-tag"; topActions.prepend(who);
      const button = document.createElement("button"); button.id = "auth-signout"; button.type = "button"; button.className = "btn btn-light"; button.textContent = "Sign out"; button.addEventListener("click", () => void signOut()); topActions.appendChild(button);
    }
    return () => {
      script.remove();
      delete document.body.dataset.page;
    };
  }, [role, profile.full_name, profile.email, signOut]);

  return <div dangerouslySetInnerHTML={{ __html: "<header class=\"dash-topbar\"><a class=\"brand\" href=\"/\"><span class=\"brand-mark\">A</span><span>awka<span\r\n                    class=\"brand-light\">direct</span><small>WORKSPACE</small></span></a>\r\n        <div class=\"dash-top-actions\"><span class=\"demo-tag\">AUTHENTICATED</span><a href=\"/\"\r\n                class=\"btn btn-light\">Marketplace</a><span id=\"top-avatar\" class=\"avatar\">AD</span></div>\r\n    </header>\r\n    <div class=\"dashboard-layout\">\r\n        <aside class=\"sidebar\"><label class=\"role-switch-label\">Preview workspace<select id=\"role-switch\">\r\n                    <option value=\"tenant\">Tenant</option>\r\n                    <option value=\"landlord\">Landlord</option>\r\n                    <option value=\"caretaker\">Caretaker</option>\r\n                    <option value=\"admin\">Admin</option>\r\n                </select></label>\r\n            <nav id=\"side-nav\" class=\"side-nav\"></nav><a class=\"sidebar-market\" href=\"/\">\u2190 Back to\r\n                marketplace</a>\r\n        </aside>\r\n        <main class=\"dash-main\">\r\n            <div class=\"dash-heading\">\r\n                <div><span id=\"dash-eyebrow\" class=\"eyebrow\">WORKSPACE</span>\r\n                    <h1 id=\"dash-title\">Dashboard</h1>\r\n                    <p id=\"dash-subtitle\">Manage your activity.</p>\r\n                </div><button id=\"primary-action\" class=\"btn btn-primary\">Continue</button>\r\n            </div>\r\n            <div id=\"screen-content\"></div>\r\n            <footer class=\"dash-footer\">Awka Direct \u00b7 Demo data is stored in this browser only.</footer>\r\n        </main>\r\n    </div>\r\n    <dialog id=\"dash-dialog\" class=\"dialog\"><button class=\"dialog-close\" data-close-dialog aria-label=\"Close\">\u00d7</button>\r\n        <div id=\"dash-dialog-content\"></div>\r\n    </dialog>\r\n    <div id=\"toast\" class=\"toast\" role=\"status\"></div>" }} />;
}
