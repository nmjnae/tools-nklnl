"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeProvider } from "../components/ThemeProvider";

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

const PLATFORMS = [
    { key: "universal", label: "Universal", emoji: "⚡" },
    { key: "veo31", label: "Veo 3.1", emoji: "🔵" },
    { key: "googleFlow", label: "Google Flow", emoji: "🌊" },
    { key: "grok", label: "Grok Aurora", emoji: "🌌" },
    { key: "runway", label: "Runway", emoji: "🎬" },
    { key: "kling", label: "Kling AI", emoji: "🎯" },
];

export default function PromptGenLandingPage() {
    const { dark, toggle } = useThemeToggle();

    return (
        <ThemeProvider>
            <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", color: "var(--text-primary)", fontFamily: "Inter, -apple-system, sans-serif" }}>
                <style>{`
                    @keyframes pg-fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                    .pg-root { animation: pg-fadeInUp 0.5s ease; }

                    /* ── Navbar ── */
                    .pg-nav { padding: 0 40px; }
                    @media (max-width: 640px) {
                        .pg-nav { padding: 0 16px; }
                        .pg-nav-label { display: none; }
                    }

                    /* ── Hero ── */
                    .pg-hero {
                        display: flex;
                        align-items: center;
                        gap: 60px;
                        padding: 64px 40px;
                        max-width: 1200px;
                        margin: 0 auto;
                        border-bottom: 1px solid var(--border);
                    }
                    .pg-hero-left { flex: 0 0 auto; max-width: 520px; }
                    .pg-hero-right { flex: 1; position: relative; min-height: 320px; display: flex; align-items: center; justify-content: center; }
                    .pg-cta-group { display: flex; gap: 12px; flex-wrap: wrap; }
                    @media (max-width: 767px) {
                        .pg-hero {
                            flex-direction: column;
                            gap: 0;
                            padding: 32px 20px 40px;
                            align-items: flex-start;
                        }
                        .pg-hero-left { max-width: 100%; }
                        .pg-hero-right { display: none; }
                        .pg-cta-group { flex-direction: column; width: 100%; }
                        .pg-cta-group a { width: 100%; justify-content: center; box-sizing: border-box; }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .pg-hero { gap: 32px; padding: 48px 32px; }
                        .pg-hero-left { max-width: 380px; }
                        .pg-hero-right { min-height: 260px; }
                    }

                    /* ── Stats ── */
                    .pg-stats {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        border-bottom: 1px solid var(--border);
                    }
                    @media (max-width: 640px) {
                        .pg-stats { grid-template-columns: 1fr; }
                        .pg-stat-item { border-right: none !important; border-bottom: 1px solid var(--border); }
                        .pg-stat-item:last-child { border-bottom: none; }
                    }

                    /* ── How It Works ── */
                    .pg-how { padding: 56px 40px; border-bottom: 1px solid var(--border); max-width: 1200px; margin: 0 auto; }
                    .pg-how-header { display: flex; gap: 48px; margin-bottom: 40px; }
                    .pg-step-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background-color: var(--border); }
                    .pg-step-inner { padding: 28px 24px; }
                    @media (max-width: 767px) {
                        .pg-how { padding: 40px 20px; }
                        .pg-how-header { flex-direction: column; gap: 10px; margin-bottom: 24px; }
                        .pg-step-grid { grid-template-columns: 1fr; }
                        .pg-step { border-bottom: 1px solid var(--border); }
                        .pg-step-inner { padding: 24px 20px; }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .pg-how { padding: 48px 32px; }
                        .pg-how-header { gap: 32px; margin-bottom: 32px; }
                        .pg-step-inner { padding: 24px 20px; }
                    }

                    /* ── Platforms ── */
                    .pg-platforms { padding: 56px 40px; border-bottom: 1px solid var(--border); }
                    .pg-plat-inner { max-width: 1200px; margin: 0 auto; }
                    .pg-plat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background-color: var(--border); margin-top: 40px; }
                    @media (max-width: 640px) {
                        .pg-platforms { padding: 40px 20px; }
                        .pg-plat-grid { grid-template-columns: repeat(2, 1fr); }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .pg-platforms { padding: 48px 32px; }
                    }

                    /* ── Final CTA ── */
                    .pg-cta-final { padding: 72px 40px; text-align: center; }
                    @media (max-width: 767px) {
                        .pg-cta-final { padding: 48px 20px; }
                        .pg-cta-final a { width: 100%; justify-content: center; box-sizing: border-box; }
                    }
                    @media (min-width: 768px) and (max-width: 1023px) {
                        .pg-cta-final { padding: 56px 32px; }
                    }
                `}</style>

                {/* ── TOP NAV ── */}
                <nav className="pg-nav" style={{
                    position: "fixed", top: 0, left: 0, right: 0, height: "64px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    backgroundColor: "var(--bg-primary)", borderBottom: "1px solid var(--border)",
                    zIndex: 50, backdropFilter: "blur(12px)",
                }}>
                    <span style={{ fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>PROMPTSTUDIO</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button onClick={toggle} style={{
                            background: "none", border: "1px solid var(--border)", padding: "6px 12px",
                            borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600,
                            color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px",
                        }}>
                            {dark
                                ? <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg><span className="pg-nav-label">Light</span></>
                                : <><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg><span className="pg-nav-label">Dark</span></>
                            }
                        </button>
                        <Link href="/prompt-gen" style={{
                            padding: "8px 16px", backgroundColor: "var(--accent)", color: "var(--bg-primary)",
                            borderRadius: "8px", fontWeight: 700, fontSize: "13px", textDecoration: "none",
                            transition: "opacity 0.15s", whiteSpace: "nowrap",
                        }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                            Buat Prompt
                        </Link>
                    </div>
                </nav>

                <div className="pg-root" style={{ paddingTop: "64px" }}>

                    {/* ── HERO ── */}
                    <section className="pg-hero">
                        {/* Left */}
                        <div className="pg-hero-left">
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "999px", marginBottom: "32px" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)", display: "inline-block" }}></span>
                                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)" }}>Beta — Free to use</span>
                            </div>
                            <h1 style={{ fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", color: "var(--text-primary)", marginBottom: "24px" }}>
                                Prompt sinematik,<br />
                                <span style={{ color: "var(--text-muted)", fontWeight: 400, fontStyle: "italic" }}>dari satu gambar.</span>
                            </h1>
                            <p style={{ fontSize: "15px", lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "420px" }}>
                                Upload gambar atau video referensi — AI langsung mengubahnya menjadi prompt sinematik terstruktur, siap pakai di semua platform video AI terkini.
                            </p>
                            <div className="pg-cta-group">
                                <Link href="/prompt-gen" style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "14px 28px", backgroundColor: "var(--accent)",
                                    color: "var(--bg-primary)", borderRadius: "10px",
                                    fontWeight: 700, fontSize: "14px", textDecoration: "none", transition: "opacity 0.15s",
                                }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                                    Buat Prompt Sekarang
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
                                    Lihat Cara Kerja
                                </a>
                            </div>
                        </div>

                        {/* Right: floating prompt preview cards */}
                        <div className="pg-hero-right">
                            <div style={{ position: "relative", width: "100%", maxWidth: "440px", aspectRatio: "4/3" }}>
                                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "32px 32px", borderRadius: "16px", opacity: 0.5 }}></div>

                                {/* Scene prompt card */}
                                <div style={{ position: "absolute", top: "6%", left: "4%", right: "4%", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "8px", textTransform: "uppercase" }}>Scene Prompt</div>
                                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "monospace" }}>
                                        Cinematic close-up, golden hour backlight,<br />shallow depth of field, film grain 35mm...
                                    </div>
                                </div>

                                {/* Platform badges card */}
                                <div style={{ position: "absolute", bottom: "22%", left: "4%", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "10px", textTransform: "uppercase" }}>Ready For</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                        {["🎬 Runway", "🎯 Kling AI", "🔵 Veo 3.1"].map((p, i) => (
                                            <div key={i} style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--success)", flexShrink: 0 }}></span>
                                                {p}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Style tags card */}
                                <div style={{ position: "absolute", bottom: "4%", right: "4%", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "10px", textTransform: "uppercase" }}>Style Tags</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", maxWidth: "150px" }}>
                                        {["Cinematic", "4K", "Golden Hour", "Film Grain"].map((tag, i) => (
                                            <span key={i} style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", border: "1px solid var(--border)", borderRadius: "999px", color: "var(--text-secondary)", background: "var(--bg-secondary)" }}>{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Center sparkle icon */}
                                <div style={{ position: "absolute", top: "48%", right: "8%", transform: "translateY(-50%)", width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg-primary)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
                                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Stats ── */}
                    <div className="pg-stats">
                        {[
                            { v: "5×", l: "Lebih Cepat Buat Prompt" },
                            { v: "AI", l: "Visual Analysis Engine" },
                            { v: "6+", l: "Platform Didukung" },
                        ].map((s, i) => (
                            <div key={i} className="pg-stat-item" style={{ padding: "36px 24px", textAlign: "center", borderRight: i < 2 ? "1px solid var(--border)" : undefined }}>
                                <div style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "-2px", color: "var(--text-primary)", marginBottom: "6px" }}>{s.v}</div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.3px" }}>{s.l}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── How It Works ── */}
                    <section id="how" className="pg-how">
                        <div className="pg-how-header">
                            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px", whiteSpace: "nowrap" }}>Cara Kerja</p>
                            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "500px" }}>
                                Tiga langkah sederhana dari referensi visual ke prompt sinematik siap pakai — tanpa perlu skill prompting khusus.
                            </p>
                        </div>
                        <div className="pg-step-grid">
                            {[
                                {
                                    n: "01", t: "Upload Referensi", icon: "⬆",
                                    d: "Unggah gambar atau video referensi yang ingin kamu jadikan inspirasi. Mendukung JPG, PNG, WebP, MP4, dan format populer lainnya.",
                                },
                                {
                                    n: "02", t: "AI Analisis Visual", icon: "✦",
                                    d: "AI membedah komposisi, pencahayaan, mood, gerakan kamera, color grading, dan gaya sinematik dari referensi kamu secara mendalam.",
                                },
                                {
                                    n: "03", t: "Prompt Siap Pakai", icon: "📋",
                                    d: "Dapatkan prompt sinematik terstruktur dalam Bahasa Indonesia atau Inggris — langsung salin ke Kling, Runway, Veo, dan semua platform AI lainnya.",
                                },
                            ].map((step, i) => (
                                <div key={i} className="pg-step" style={{ backgroundColor: "var(--bg-primary)", transition: "background 0.15s" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-primary)"; }}>
                                    <div className="pg-step-inner">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                                            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px" }}>{step.n}</span>
                                            <span style={{ fontSize: "20px" }}>{step.icon}</span>
                                        </div>
                                        <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "12px", color: "var(--text-primary)" }}>{step.t}</h3>
                                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.75 }}>{step.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Platforms ── */}
                    <section className="pg-platforms">
                        <div className="pg-plat-inner">
                            <div style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>
                                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "4px", whiteSpace: "nowrap" }}>Platform</p>
                                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "500px" }}>
                                    Prompt yang dihasilkan dioptimalkan dan siap langsung digunakan di semua platform video AI terkini.
                                </p>
                            </div>
                            <div className="pg-plat-grid">
                                {PLATFORMS.map((plat, i) => (
                                    <div key={plat.key} style={{
                                        padding: "28px 24px", backgroundColor: "var(--bg-primary)",
                                        transition: "background 0.15s", cursor: "default",
                                        borderRight: (i % 3 !== 2) ? "1px solid var(--border)" : undefined,
                                    }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-primary)"; }}>
                                        <div style={{ fontSize: "28px", marginBottom: "12px" }}>{plat.emoji}</div>
                                        <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px", color: "var(--text-primary)", marginBottom: "6px" }}>{plat.label}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "var(--success)", display: "inline-block" }}></span>
                                            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Didukung</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Final CTA ── */}
                    <section className="pg-cta-final">
                        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-primary)", marginBottom: "16px" }}>
                            Ubah referensi visual kamu<br />jadi prompt viral hari ini.
                        </h2>
                        <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "40px" }}>Gratis. Tidak perlu daftar. Prompt pertama langsung sekarang.</p>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <Link href="/prompt-gen" style={{
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
