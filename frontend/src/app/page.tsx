"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";

function useThemeToggle() {
    const [dark, setDark] = useState(false);
    const toggle = () => {
        setDark((d) => {
            const next = !d;
            if (next) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
            return next;
        });
    };
    return { dark, toggle };
}

export default function LandingPage() {
    const { dark, toggle } = useThemeToggle();

    return (
        <ThemeProvider>
            <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "Inter, -apple-system, sans-serif" }}>
                <style>{`
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                    .landing-root { animation: fadeInUp 0.5s ease; }

                    /* ── Navbar ── */
                    .landing-nav { padding: 0 40px; }
                    @media (max-width: 640px) {
                        .landing-nav { padding: 0 16px; }
                        .nav-label { display: none; }
                    }

                    /* ── Hero ── */
                    .hero-section {
                        display: flex;
                        align-items: center;
                        gap: 60px;
                        padding: 64px 40px;
                        max-width: 1200px;
                        margin: 0 auto;
                        border-bottom: 1px solid var(--border);
                    }
                    .hero-left { flex: 0 0 auto; max-width: 520px; }
                    .hero-right { flex: 1; position: relative; min-height: 320px; display: flex; align-items: center; justify-content: center; }
                    .hero-cta-group { display: flex; gap: 12px; flex-wrap: wrap; }
                    @media (max-width: 767px) {
                        .hero-section {
                            flex-direction: column;
                            gap: 0;
                            padding: 32px 20px 40px;
                            align-items: flex-start;
                        }
                        .hero-left { max-width: 100%; }
                        .hero-right { display: none; }
                        .hero-cta-group { flex-direction: column; width: 100%; }
                        .hero-cta-group a { width: 100%; justify-content: center; box-sizing: border-box; }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .hero-section { gap: 32px; padding: 48px 32px; }
                        .hero-left { max-width: 380px; }
                        .hero-right { min-height: 260px; }
                    }

                    /* ── Stats ── */
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        border-bottom: 1px solid var(--border);
                    }
                    @media (max-width: 640px) {
                        .stats-grid {
                            grid-template-columns: 1fr;
                        }
                        .stats-item {
                            border-right: none !important;
                            border-bottom: 1px solid var(--border);
                        }
                        .stats-item:last-child { border-bottom: none; }
                    }

                    /* ── ATM Method ── */
                    .atm-section { padding: 56px 40px; border-bottom: 1px solid var(--border); max-width: 1200px; margin: 0 auto; }
                    .atm-header { display: flex; gap: 48px; margin-bottom: 40px; }
                    .atm-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background-color: var(--border); }
                    .atm-card-inner { padding: 28px 24px; }
                    @media (max-width: 767px) {
                        .atm-section { padding: 40px 20px; }
                        .atm-header { flex-direction: column; gap: 10px; margin-bottom: 24px; }
                        .atm-cards { grid-template-columns: 1fr; }
                        .atm-card { border-bottom: 1px solid var(--border); }
                        .atm-card-inner { padding: 24px 20px; }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .atm-section { padding: 48px 32px; }
                        .atm-header { gap: 32px; margin-bottom: 32px; }
                        .atm-cards { grid-template-columns: repeat(3, 1fr); }
                        .atm-card-inner { padding: 24px 20px; }
                    }

                    /* ── Final CTA ── */
                    .final-cta { padding: 72px 40px; text-align: center; }
                    @media (max-width: 767px) {
                        .final-cta { padding: 48px 20px; }
                        .final-cta a { width: 100%; justify-content: center; box-sizing: border-box; }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .final-cta { padding: 56px 32px; }
                    }
                `}</style>

                {/* ── TOP NAV BAR ── */}
                <nav className="landing-nav" style={{
                    position: "fixed", top: 0, left: 0, right: 0, height: "64px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    backgroundColor: "var(--bg-primary)", borderBottom: "1px solid var(--border)",
                    zIndex: 50, backdropFilter: "blur(12px)",
                }}>
                    <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>ATMSTUDIO</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button onClick={toggle} style={{
                            background: "none", border: "1px solid var(--border)", padding: "6px 12px",
                            borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                            color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px",
                        }}>
                            {dark
                                ? <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg><span className="nav-label">Light</span></>
                                : <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg><span className="nav-label">Dark</span></>
                            }
                        </button>
                        <Link href="/atm" style={{
                            padding: "8px 16px", backgroundColor: "var(--accent)", color: "var(--bg-primary)",
                            borderRadius: "8px", fontWeight: 700, fontSize: "13px", textDecoration: "none",
                            transition: "opacity 0.15s", whiteSpace: "nowrap",
                        }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                            Mulai Analisis
                        </Link>
                    </div>
                </nav>

                <div className="landing-root" style={{ paddingTop: "64px" }}>

                    {/* ── HERO ── */}
                    <section className="hero-section">
                        {/* Left */}
                        <div className="hero-left">
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "999px", marginBottom: "32px" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)", display: "inline-block" }}></span>
                                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)" }}>Beta — Free to use</span>
                            </div>
                            <h1 style={{ fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", color: "var(--text-primary)", marginBottom: "24px" }}>
                                Riset video viral,<br />
                                <span style={{ color: "var(--text-muted)", fontWeight: 400, fontStyle: "italic" }}>dalam hitungan detik.</span>
                            </h1>
                            <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "400px" }}>
                                Platform AI pertama yang membedah hook, flow, audio, dan script dari video viral mana pun — siap pakai untuk konten kamu berikutnya.
                            </p>
                            <div className="hero-cta-group">
                                <Link href="/atm" style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "14px 28px", backgroundColor: "var(--accent)",
                                    color: "var(--bg-primary)", borderRadius: "10px",
                                    fontWeight: 700, fontSize: "14px", textDecoration: "none", transition: "opacity 0.15s",
                                }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                                    Mulai Analisis Video
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </Link>
                                <a href="#how" style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "14px 28px", border: "1px solid var(--border)",
                                    borderRadius: "10px", fontWeight: 600, fontSize: "14px",
                                    textDecoration: "none", color: "var(--text-primary)",
                                    backgroundColor: "var(--bg-primary)", transition: "background 0.15s",
                                }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-primary)"; }}>
                                    Pelajari Lebih Lanjut
                                </a>
                            </div>
                        </div>

                        {/* Right: floating insight cards — hidden on mobile via CSS */}
                        <div className="hero-right">
                            <div style={{ position: "relative", width: "100%", maxWidth: "440px", aspectRatio: "4/3" }}>
                                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "32px 32px", borderRadius: "16px", opacity: 0.5 }}></div>
                                <div style={{ position: "absolute", top: "8%", left: "4%", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", minWidth: "160px" }}>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "8px", textTransform: "uppercase" }}>Hook Strength</div>
                                    <div style={{ fontSize: "30px", fontWeight: 900, letterSpacing: "-1px", color: "var(--text-primary)" }}>9.2</div>
                                    <div style={{ fontSize: "12px", color: "var(--success)", fontWeight: 700, marginTop: "4px" }}>↑ Sangat Kuat</div>
                                </div>
                                <div style={{ position: "absolute", top: "8%", right: "4%", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "8px", textTransform: "uppercase" }}>Retensi AI</div>
                                    <div style={{ fontSize: "30px", fontWeight: 900, letterSpacing: "-1px", color: "var(--text-primary)" }}>87%</div>
                                    <div style={{ fontSize: "12px", color: "var(--success)", fontWeight: 700, marginTop: "4px" }}>↑ Di atas rata-rata</div>
                                </div>
                                <div style={{ position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", width: "82%", maxWidth: "300px" }}>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "12px", textTransform: "uppercase" }}>Struktur Video</div>
                                    {["Hook (0–3s)", "Build-up (3–15s)", "CTA (15–30s)"].map((label, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i < 2 ? "8px" : 0 }}>
                                            <div style={{ flex: 1, height: "5px", backgroundColor: "var(--bg-secondary)", borderRadius: "999px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${[85, 60, 40][i]}%`, backgroundColor: "var(--text-primary)", borderRadius: "999px" }}></div>
                                            </div>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", width: "80px" }}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg-primary)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Stats ── */}
                    <div className="stats-grid">
                        {[{ v: "3×", l: "Lebih Cepat Riset" }, { v: "AI", l: "Powered Analysis" }, { v: "100%", l: "Script Siap Pakai" }].map((s, i) => (
                            <div key={i} className="stats-item" style={{ padding: "36px 24px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--border)" : undefined }}>
                                <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px", color: "var(--text-primary)", marginBottom: "6px" }}>{s.v}</div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.3px" }}>{s.l}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Metode ATM ── */}
                    <section id="how" className="atm-section">
                        <div className="atm-header">
                            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px", whiteSpace: "nowrap" }}>Metode ATM</p>
                            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "500px" }}>Formula <em>Amati, Tiru, Modifikasi</em> — sistem riset konten terbukti kini dilengkapi kecerdasan buatan untuk mempercepat proses kreatifmu.</p>
                        </div>
                        <div className="atm-cards">
                            {[
                                { n: "01", t: "Amati", d: "AI membedah hook, pacing, visual style, dan structure dari video viral secara mendalam.", icon: "👁" },
                                { n: "02", t: "Tiru", d: "Dapatkan production flow script lengkap — shot by shot, panduan audio dan visual siap pakai.", icon: "📋" },
                                { n: "03", t: "Modifikasi", d: "Gunakan AI prompts untuk image generation, voiceover, dan music mood — jadikan milikmu.", icon: "✦" },
                            ].map((f, i) => (
                                <div key={i} className="atm-card" style={{ backgroundColor: "var(--bg-primary)", transition: "background 0.15s" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-primary)"; }}>
                                    <div className="atm-card-inner">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                                            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px" }}>{f.n}</span>
                                            <span style={{ fontSize: "20px" }}>{f.icon}</span>
                                        </div>
                                        <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "12px", color: "var(--text-primary)" }}>{f.t}</h3>
                                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.75 }}>{f.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Final CTA ── */}
                    <section className="final-cta">
                        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-primary)", marginBottom: "16px" }}>
                            Siap bongkar rahasia<br />video viral berikutnya?
                        </h2>
                        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "40px" }}>Gratis. Tidak perlu daftar. Analisis pertama langsung sekarang.</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Link href="/atm" style={{
                                display: "inline-flex", alignItems: "center", gap: "10px",
                                padding: "16px 36px", backgroundColor: "var(--accent)", color: "var(--bg-primary)",
                                borderRadius: "10px", fontWeight: 700, fontSize: "15px",
                                textDecoration: "none", transition: "opacity 0.15s", maxWidth: "420px", width: "100%", justifyContent: "center",
                            }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                                Mulai Sekarang — Gratis
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </ThemeProvider>
    );
}
