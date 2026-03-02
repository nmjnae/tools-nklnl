"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export function Navbar({ currentPage = "home" }: { currentPage?: string }) {
    const { theme, toggle } = useTheme();

    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(var(--bg-primary-rgb, 8, 11, 20), 0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
        }}>
            <Link href="/" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                    }}>
                        A
                    </div>
                    <span style={{
                        fontWeight: "700",
                        fontSize: "16px",
                        color: "var(--text-primary)",
                        letterSpacing: "-0.3px",
                    }}>
                        ATM<span style={{ color: "var(--accent)", fontWeight: "800" }}>Studio</span>
                    </span>
                </div>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link
                    href="/"
                    style={{
                        textDecoration: "none",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: currentPage === "home" ? "var(--accent)" : "var(--text-secondary)",
                        background: currentPage === "home" ? "var(--accent-light)" : "transparent",
                        transition: "all 0.2s ease",
                    }}
                >
                    Home
                </Link>
                <Link
                    href="/atm"
                    style={{
                        textDecoration: "none",
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: currentPage === "atm" ? "var(--accent)" : "var(--text-secondary)",
                        background: currentPage === "atm" ? "var(--accent-light)" : "transparent",
                        transition: "all 0.2s ease",
                    }}
                >
                    ATM
                </Link>
                <button
                    onClick={toggle}
                    style={{
                        marginLeft: "8px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--bg-card)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </nav>
    );
}
