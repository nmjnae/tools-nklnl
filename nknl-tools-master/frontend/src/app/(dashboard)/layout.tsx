"use client";

import { useState } from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import { Sidebar } from "../components/Sidebar";

const SIDEBAR_WIDTH = 240;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <ThemeProvider>
            <style>{`
                /* ── Mobile top bar: visible below md ── */
                .dash-mobile-bar { display: flex; }
                @media (min-width: 768px) { .dash-mobile-bar { display: none; } }

                /* ── Sidebar offset on desktop ── */
                .dash-main { margin-left: 0; padding-top: 60px; }
                @media (min-width: 768px) {
                    .dash-main { margin-left: ${SIDEBAR_WIDTH}px; padding-top: 0; }
                }

                /* ── Main inner padding ── */
                .dash-inner {
                    padding: 20px 16px;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    box-sizing: border-box;
                }
                @media (min-width: 640px) { .dash-inner { padding: 20px 20px; } }
                @media (min-width: 768px) { .dash-inner { padding: 24px 24px; } }
                @media (min-width: 1024px) { .dash-inner { padding: 28px 32px; } }
                @media (min-width: 1280px) { .dash-inner { padding: 32px 40px; } }
            `}</style>
            <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "Inter, -apple-system, sans-serif" }}>

                {/* Mobile Top Bar */}
                <div
                    className="dash-mobile-bar"
                    style={{
                        position: "fixed",
                        top: 0, left: 0, right: 0,
                        height: "60px",
                        backgroundColor: "var(--bg-primary)",
                        borderBottom: "1px solid var(--border)",
                        zIndex: 40,
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 20px",
                    }}
                >
                    <span style={{ fontWeight: 900, fontSize: "18px", letterSpacing: "-1px", color: "var(--text-primary)" }}>ATMSTUDIO</span>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{ color: "var(--text-secondary)", padding: "8px", background: "none", border: "none", cursor: "pointer" }}
                    >
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                <Sidebar isOpen={mobileMenuOpen} sidebarWidth={SIDEBAR_WIDTH} closeMobileMenu={() => setMobileMenuOpen(false)} />

                {/* Overlay for mobile */}
                {mobileMenuOpen && (
                    <div
                        style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 39 }}
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Main content */}
                <div className="dash-main">
                    <main className="dash-inner">
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}
