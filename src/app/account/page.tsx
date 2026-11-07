"use client";
import { useEffect } from "react";
import { signInWithGoogle } from "@/lib/auth";

export default function Page() {
 useEffect(() => {
  document.body.dataset.page = "account";

  const script = document.createElement("script");
  script.src = "/app.js";
  script.async = false;
  script.dataset.awkaApp = "true";

  script.onload = () => {
    const form = document.getElementById("account-form");
    form?.addEventListener("submit", (event) => { event.preventDefault(); document.getElementById("account-message")!.textContent = "Please continue with Google to create or access your verified account."; document.getElementById("account-message")!.classList.remove("hidden"); });
    const demoLinks = document.getElementById("demo-links");
    if (demoLinks) demoLinks.classList.add("hidden");
    const googleButton = document.getElementById("google-signin");

    googleButton?.addEventListener("click", async () => {
      try {
        const selectedRole = (document.getElementById("account-role") as HTMLSelectElement | null)?.value as "tenant" | "landlord" | "caretaker" | undefined;
        await signInWithGoogle(selectedRole || "tenant");
      } catch (error) {
        console.error("Google sign-in failed:", error);
      }
    });
  };

  document.body.appendChild(script);

  return () => {
    script.remove();
    delete document.body.dataset.page;
  };
}, []);

  return <div dangerouslySetInnerHTML={{ __html: "<header class=\"topbar\"><a class=\"brand\" href=\"/\"><span class=\"brand-mark\">A</span><span>awka<span\r\n                    class=\"brand-light\">direct</span><small>RENTALS IN AWKA</small></span></a><a class=\"btn btn-light\"\r\n            href=\"/\">\u2190 Marketplace</a></header>\r\n    <main class=\"account-layout\">\r\n        <section class=\"account-side\"><span class=\"eyebrow\">AWKA, MADE EASIER</span>\r\n            <h1>Your next place<br>starts here.</h1>\r\n            <p>Find accommodation or list the rooms and properties you manage.</p>\r\n            <div class=\"account-side-list\"><span>\u2713 Browse Awka listings</span><span>\u2713 Add rooms and lodge\r\n                    options</span><span>\u2713 Manage your listings</span></div>\r\n        </section>\r\n        <section class=\"account-card\">\r\n            <div class=\"account-tabs\"><button type=\"button\" class=\"account-tab active\" data-mode=\"signup\">Create\r\n                    account</button><button type=\"button\" class=\"account-tab\" data-mode=\"signin\">Sign in</button></div>\r\n            <h2 id=\"account-title\">Create your account</h2>\r\n            <p id=\"account-description\" class=\"muted\">Choose how you will use Awka Direct.</p>\r\n            <form id=\"account-form\">\r\n                <div id=\"signin-fields\" class=\"hidden\"><label>Email address<input id=\"signin-email\" type=\"email\"\r\n                            autocomplete=\"email\" placeholder=\"you@example.com\"></label></div>\r\n                <div id=\"signup-fields\"><label>Full name<input id=\"account-name\" name=\"name\" autocomplete=\"name\"\r\n                            placeholder=\"Your full name\" required></label><label>Email address<input id=\"account-email\"\r\n                            name=\"email\" type=\"email\" autocomplete=\"email\" placeholder=\"you@example.com\"\r\n                            required></label><label>Phone number <span class=\"optional\">(optional)</span><input\r\n                            id=\"account-phone\" name=\"phone\" type=\"tel\" autocomplete=\"tel\"\r\n                            placeholder=\"08012345678\"></label><label>I am joining as<select id=\"account-role\"\r\n                            name=\"role\">\r\n                            <option value=\"tenant\">Tenant \u2014 find accommodation</option>\r\n                            <option value=\"landlord\">Landlord \u2014 list my property</option>\r\n                            <option value=\"caretaker\">Caretaker \u2014 manage rooms or a lodge</option>\r\n                        </select></label>\r\n                    <div id=\"role-guidance\" class=\"role-guidance\"></div>\r\n                </div><button type=\"submit\" class=\"btn btn-primary btn-wide\" id=\"account-submit\">Continue without\r\n                    verification</button>\r\n            </form>\r\n            <div class=\"divider\"><span>or</span></div><button type=\"button\" id=\"google-signin\"\r\n                class=\"google-button\"><span class=\"google-mark\">G</span> Continue with Google</button>\r\n            <p class=\"fine-print\">Google sign-in is the only verification option in this MVP. You can skip it, but some\r\n                actions stay locked until verified.</p>\r\n            <div id=\"account-message\" class=\"account-message hidden\" aria-live=\"polite\"></div>\r\n            <div id=\"demo-links\" class=\"demo-links\"><span>Preview dashboard:</span><a\r\n                    href=\"/dashboard?role=tenant\">Tenant</a><a href=\"/dashboard?role=landlord\">Landlord</a><a\r\n                    href=\"/dashboard?role=caretaker\">Caretaker</a><a href=\"/dashboard?role=admin\">Admin</a>\r\n            </div>\r\n        </section>\r\n    </main>\r\n    <div id=\"toast\" class=\"toast\" role=\"status\"></div>" }} />;
}
