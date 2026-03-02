"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useEffect, useState } from "react";

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);
const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

interface User { name: string; email: string; avatar?: string; }

const navItems = [
    { name: "ATM Video", href: "/atm", emoji: "🎬" },
    { name: "Trend Explorer", href: "/trending", emoji: "🔥" },
    { name: "My Library", href: "/library", emoji: "📚" },
];

export function Sidebar({ isOpen = false, closeMobileMenu, sidebarWidth = 240 }: { isOpen?: boolean; closeMobileMenu?: () => void; sidebarWidth?: number }) {
    const pathname = usePathname();
    const { theme, toggle } = useTheme();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const API = process.env.NEXT_PUBLIC_API_URL || "/api";
        fetch(`${API}/auth/me`, { credentials: "include" })
            .then((r) => r.json())
            .then((j) => { if (j.success) setUser(j.data); })
            .catch(() => {});
    }, []);

    const sidebarStyle: React.CSSProperties = {
        position: "fixed", left: 0, top: 0, width: `${sidebarWidth}px`, height: "100vh",
        backgroundColor: "var(--bg-primary)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", zIndex: 50,
    };

    const logout = async () => {
        const API = process.env.NEXT_PUBLIC_API_URL || "/api";
        await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
        window.location.href = "/login";
    };

    return (
        <>
            <style>{`
                .atm-sidebar { transition: transform 0.3s ease; }
                @media (max-width: 767px) {
                    .atm-sidebar { transform: ${isOpen ? "translateX(0)" : "translateX(-100%)"}; }
                }
                @media (min-width: 768px) {
                    .atm-sidebar { transform: translateX(0) !important; }
                }
            `}</style>
            <aside className="atm-sidebar" style={sidebarStyle}>
                <div style={{ height: "72px", display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                    <Link href="/" onClick={closeMobileMenu} style={{ textDecoration: "none", color: "var(--text-primary)" }}>
                        <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px" }}>MimicAI</span>
                    </Link>
                    <button onClick={closeMobileMenu} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "none" }} className="mobile-close">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
                    {navItems.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href} onClick={closeMobileMenu}
                                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? "var(--bg-secondary)" : "transparent", color: isActive ? "var(--text-primary)" : "var(--text-secondary)", transition: "all 0.15s" }}
                                onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; } }}
                                onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; } }}>
                                <span style={{ fontSize: "16px" }}>{item.emoji}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ borderTop: "1px solid var(--border)" }}>
                    <button onClick={toggle}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 26px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", textAlign: "left", transition: "all 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}>
                        <span style={{ color: "var(--text-muted)" }}>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>

                    <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
                        {user ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} style={{ width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0 }} />
                                ) : (
                                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                                    <button onClick={logout} style={{ fontSize: "11px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                                        Keluar →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>Creator</div>
                                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>MimicAI</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
