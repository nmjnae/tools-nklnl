"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

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
const VideoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
);
const PromptIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
);
const UserIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export function Sidebar({ isOpen = false, closeMobileMenu, sidebarWidth = 240 }: { isOpen?: boolean; closeMobileMenu?: () => void; sidebarWidth?: number }) {
    const pathname = usePathname();
    const { theme, toggle } = useTheme();

    // Sidebar nav items
    const navItems = [
        { name: "ATM Video", href: "/atm", icon: <VideoIcon /> },
        { name: "Prompt Gen", href: "/prompt-gen", icon: <PromptIcon /> },
    ];

    const sidebarStyle: React.CSSProperties = {
        position: "fixed",
        left: 0,
        top: 0,
        width: `${sidebarWidth}px`,
        height: "100vh",
        backgroundColor: "var(--bg-primary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
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
                {/* Logo */}
                <div style={{ height: "72px", display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                    <Link href="/" onClick={closeMobileMenu} style={{ textDecoration: "none", color: "var(--text-primary)" }}>
                        <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px" }}>ATMSTUDIO</span>
                    </Link>
                    <button className="md:hidden" onClick={closeMobileMenu} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
                    {navItems.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                    fontWeight: isActive ? 600 : 500,
                                    backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
                                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; } }}
                                onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; } }}
                            >
                                <span style={{ color: isActive ? "var(--text-primary)" : "var(--text-muted)" }}>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div style={{ borderTop: "1px solid var(--border)" }}>
                    <button
                        onClick={toggle}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 26px", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", textAlign: "left", transition: "color 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                    >
                        <span style={{ color: "var(--text-muted)" }}>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 26px", borderTop: "1px solid var(--border)" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--text-muted)" }}>
                            <UserIcon />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>Namja</div>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Creator</div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
