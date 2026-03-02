"use client";
// This page is intentionally empty — the landing page is now at the root app/page.tsx
// The (dashboard) layout only wraps /atm and other dashboard routes
export default function DashboardIndex() {
  if (typeof window !== "undefined") {
    window.location.replace("/");
  }
  return null;
}
