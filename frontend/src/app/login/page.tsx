"use client";

import { ThemeProvider, useTheme } from "../components/ThemeProvider";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

function LoginContent() {
    const { theme, toggle } = useTheme();
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)", padding: "20px" }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } } .login-card { animation: fadeUp 0.4s ease; }`}</style>

            <div style={{ position: "fixed", top: "16px", right: "16px" }}>
                <button onClick={toggle} style={{ background: "none", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>
                    {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>

            <div className="login-card" style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontWeight: 900, fontSize: "22px", letterSpacing: "-0.5px", color: "var(--text-primary)", marginBottom: "8px" }}>MimicAI</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", border: "1px solid var(--border)", borderRadius: "999px", marginBottom: "24px" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
                        <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)" }}>Beta — Free to use</span>
                    </div>
                    <h1 style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", marginBottom: "10px" }}>Masuk ke MimicAI</h1>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        Analisis video viral dan temukan formula konten yang bisa kamu replikasi.
                    </p>
                </div>

                <div style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "28px", backgroundColor: "var(--bg-primary)" }}>
                    <a href={`${API}/auth/google`}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", width: "100%", padding: "14px 20px", border: "1px solid var(--border)", borderRadius: "10px", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", textDecoration: "none", fontSize: "14px", fontWeight: 600, boxSizing: "border-box", transition: "background 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-primary)"; }}>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Masuk dengan Google
                    </a>

                    <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                        {["🔥 Viral Score", "🧬 Content DNA", "🎯 ATM Framework"].map((tag) => (
                            <span key={tag} style={{ padding: "4px 10px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>{tag}</span>
                        ))}
                    </div>
                </div>

                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "20px", lineHeight: 1.6 }}>
                    Dengan masuk, kamu menyetujui Syarat Layanan kami.<br />
                    Data analisis video disimpan khusus untuk akunmu.
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <ThemeProvider>
            <LoginContent />
        </ThemeProvider>
    );
}
