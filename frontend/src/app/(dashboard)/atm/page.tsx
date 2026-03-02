"use client";

import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ViralScore {
    overall: number; hook: number; retention: number;
    shareability: number; emotionalImpact: number;
}
interface ContentDNA {
    triggerEmotion: string; curiosityGap: string;
    relatabilityFactor: string; noveltyElement: string; socialCurrency: string;
}
interface Hook { seconds: string; type: string; technique: string; whyItWorks: string; }
interface RetentionMechanics { openLoop: string; peakMoment: string; replayFactor: string; }
interface ATMFramework { amati: string[]; tiru: string[]; modifikasi: string[]; }
interface ContentIdea { angle: string; hook: string; twist: string; }
interface ProductionRecipe {
    visualStyle: string; editingPace: string; audioStrategy: string;
    captionStrategy: string; duration: string; bestPlatform: string;
}
interface Distribution { bestPostingTime: string; hashtagStrategy: string; captionFormula: string; }

interface ViralAnalysis {
    title: string; summary: string;
    viralScore: ViralScore;
    viralFormula: string;
    contentDNA: ContentDNA;
    hook: Hook;
    retentionMechanics: RetentionMechanics;
    atmFramework: ATMFramework;
    contentIdeas: ContentIdea[];
    productionRecipe: ProductionRecipe;
    distribution: Distribution;
    tags: string[];
}

interface AnalysisResponse {
    id: string; originalName: string; title: string; summary: string;
    analysis: ViralAnalysis; flowText: string; flowJson: object;
    tags: string[]; createdAt: string; fileSize?: number;
}

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ size = 18 }: { size?: number }) {
    return <div style={{ width: size, height: size, border: "2px solid var(--border)", borderTop: "2px solid var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />;
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
    const pct = Math.min(Math.max((value / 10) * 100, 0), 100);
    return (
        <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: 800, color }}>{value.toFixed(1)}</span>
            </div>
            <div style={{ height: "6px", borderRadius: "99px", background: "var(--bg-secondary)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: "99px", background: color, transition: "width 1s ease" }} />
            </div>
        </div>
    );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ onUpload, loading }: { onUpload: (f: File) => void; loading: boolean }) {
    const [drag, setDrag] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const ref = useRef<HTMLInputElement>(null);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files[0];
        if (f?.type.startsWith("video/")) setFile(f);
    }, []);

    return (
        <div style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
            <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => !loading && ref.current?.click()}
                style={{
                    border: `2px dashed ${drag ? "var(--text-primary)" : file ? "var(--success)" : "var(--border)"}`,
                    borderRadius: "16px", padding: "clamp(32px, 6vw, 64px) clamp(16px, 4vw, 40px)",
                    textAlign: "center", cursor: loading ? "not-allowed" : "pointer",
                    backgroundColor: drag ? "var(--bg-secondary)" : "var(--bg-primary)",
                    transition: "all 0.2s ease", opacity: loading ? 0.6 : 1, boxSizing: "border-box",
                }}
            >
                <input ref={ref} type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} style={{ display: "none" }} />
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--text-muted)" }}>
                    {file
                        ? <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        : <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    }
                </div>
                {file ? (
                    <><p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "6px" }}>{file.name}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{(file.size / 1024 / 1024).toFixed(1)} MB · Klik untuk ganti</p></>
                ) : (
                    <><p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "8px" }}>Seret & lepas video di sini</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>MP4 atau MOV · Maks 50MB</p>
                        <span style={{ display: "inline-block", padding: "8px 20px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", backgroundColor: "var(--bg-primary)" }}>Pilih File</span></>
                )}
            </div>
            {file && (
                <button onClick={() => onUpload(file)} disabled={loading} style={{ marginTop: "16px", width: "100%", padding: "15px", backgroundColor: loading ? "var(--bg-secondary)" : "var(--accent)", color: loading ? "var(--text-muted)" : "var(--bg-primary)", border: loading ? "1px solid var(--border)" : "none", borderRadius: "10px", fontWeight: 700, fontSize: "15px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "opacity 0.15s", boxSizing: "border-box" }}>
                    {loading ? <><Spinner /> Menganalisis DNA viral video...</> : <>Analisis Sekarang <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
                </button>
            )}
        </div>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children, accent }: { title: string; children: React.ReactNode; accent?: string }) {
    return (
        <div style={{ border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden", background: "var(--bg-primary)" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", background: accent ? `${accent}08` : "var(--bg-secondary)", display: "flex", alignItems: "center", gap: "10px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>{title}</h3>
            </div>
            <div style={{ padding: "20px" }}>{children}</div>
        </div>
    );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "4px" }}>{label}</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{value}</div>
        </div>
    );
}

// ─── Analysis Display ─────────────────────────────────────────────────────────
function AnalysisDisplay({ data }: { data: AnalysisResponse }) {
    const a = data.analysis;
    if (!a) return <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Data analisis tidak ditemukan.</div>;

    const scoreColor = (v: number) => v >= 8 ? "#10b981" : v >= 6 ? "#f59e0b" : "#ef4444";
    const overall = a.viralScore?.overall ?? 0;

    const atmColors = { amati: "#3b82f6", tiru: "#8b5cf6", modifikasi: "#f59e0b" };

    return (
        <div style={{ marginTop: "48px", animation: "fadeInUp 0.4s ease" }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: "32px", paddingBottom: "28px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                    {data.tags?.map((t) => (
                        <span key={t} style={{ padding: "4px 10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "999px", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>#{t}</span>
                    ))}
                </div>
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, letterSpacing: "-1px", color: "var(--text-primary)", marginBottom: "8px" }}>{a.title || data.title}</h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "680px" }}>{a.summary || data.summary}</p>
                <div style={{ marginTop: "14px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>{data.originalName}</span>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* ── Row 1: Viral Score + Viral Formula ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "20px" }}>

                    {/* Viral Score */}
                    <SectionCard title="🔥 Viral Score" accent="#ef4444">
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "16px", background: "var(--bg-secondary)", borderRadius: "12px" }}>
                            <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `4px solid ${scoreColor(overall)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: "22px", fontWeight: 900, color: scoreColor(overall) }}>{overall.toFixed(1)}</span>
                            </div>
                            <div>
                                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                                    {overall >= 9 ? "Ultra Viral 🚀" : overall >= 7.5 ? "Sangat Viral 🔥" : overall >= 6 ? "Berpotensi Viral 📈" : "Butuh Optimasi 🔧"}
                                </div>
                                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Skor Potensi Viral Keseluruhan</div>
                            </div>
                        </div>
                        <ScoreBar label="Hook Strength" value={a.viralScore?.hook ?? 0} color={scoreColor(a.viralScore?.hook ?? 0)} />
                        <ScoreBar label="Retention Power" value={a.viralScore?.retention ?? 0} color={scoreColor(a.viralScore?.retention ?? 0)} />
                        <ScoreBar label="Shareability" value={a.viralScore?.shareability ?? 0} color={scoreColor(a.viralScore?.shareability ?? 0)} />
                        <ScoreBar label="Emotional Impact" value={a.viralScore?.emotionalImpact ?? 0} color={scoreColor(a.viralScore?.emotionalImpact ?? 0)} />
                    </SectionCard>

                    {/* Viral Formula */}
                    <SectionCard title="🧬 Formula Viral" accent="#8b5cf6">
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                            {a.viralFormula || data.flowText || "—"}
                        </p>
                    </SectionCard>
                </div>

                {/* ── Content DNA ── */}
                <SectionCard title="🧬 Content DNA — Kode Genetik Konten Viral">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap: "12px" }}>
                        {[
                            { icon: "💥", key: "Trigger Emosi", val: a.contentDNA?.triggerEmotion },
                            { icon: "🕳️", key: "Curiosity Gap", val: a.contentDNA?.curiosityGap },
                            { icon: "🪞", key: "Relatable Factor", val: a.contentDNA?.relatabilityFactor },
                            { icon: "✨", key: "Novelty Element", val: a.contentDNA?.noveltyElement },
                            { icon: "💬", key: "Social Currency", val: a.contentDNA?.socialCurrency },
                        ].map(({ icon, key, val }) => (
                            <div key={key} style={{ padding: "14px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-secondary)" }}>
                                <div style={{ fontSize: "18px", marginBottom: "6px" }}>{icon}</div>
                                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "6px" }}>{key}</div>
                                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{val || "—"}</div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                {/* ── Row: Hook + Retention ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "20px" }}>
                    <SectionCard title="🪝 Bedah Hook" accent="#f59e0b">
                        <InfoRow label="Durasi" value={a.hook?.seconds || "—"} />
                        <InfoRow label="Tipe Hook" value={a.hook?.type || "—"} />
                        <InfoRow label="Teknik" value={a.hook?.technique || "—"} />
                        <InfoRow label="Mengapa Efektif" value={a.hook?.whyItWorks || "—"} />
                    </SectionCard>

                    <SectionCard title="⏱️ Retention Mechanics" accent="#10b981">
                        <InfoRow label="Open Loop" value={a.retentionMechanics?.openLoop || "—"} />
                        <InfoRow label="Peak Moment" value={a.retentionMechanics?.peakMoment || "—"} />
                        <InfoRow label="Replay Factor" value={a.retentionMechanics?.replayFactor || "—"} />
                    </SectionCard>
                </div>

                {/* ── ATM Framework ── */}
                <div>
                    <div style={{ marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-primary)", margin: 0 }}>🎯 ATM Framework — Amati · Tiru · Modifikasi</h3>
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Formula sukses yang bisa langsung kamu terapkan</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
                        {(["amati", "tiru", "modifikasi"] as const).map((phase) => {
                            const cfg = {
                                amati: { emoji: "👁️", label: "AMATI", desc: "Pelajari elemen kunci sukses video ini", color: atmColors.amati },
                                tiru: { emoji: "🔁", label: "TIRU", desc: "Replikasi formula yang terbukti bekerja", color: atmColors.tiru },
                                modifikasi: { emoji: "🔮", label: "MODIFIKASI", desc: "Adaptasi & evolusi dengan kreativitasmu", color: atmColors.modifikasi },
                            }[phase];
                            const items = a.atmFramework?.[phase] || [];
                            return (
                                <div key={phase} style={{ border: `1px solid ${cfg.color}30`, borderRadius: "16px", overflow: "hidden", background: "var(--bg-primary)" }}>
                                    <div style={{ padding: "14px 18px", background: `${cfg.color}10`, borderBottom: `1px solid ${cfg.color}20` }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                            <span style={{ fontSize: "20px" }}>{cfg.emoji}</span>
                                            <span style={{ fontSize: "14px", fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                                        </div>
                                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{cfg.desc}</p>
                                    </div>
                                    <div style={{ padding: "16px 18px" }}>
                                        {items.length > 0 ? items.map((item, i) => (
                                            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < items.length - 1 ? "12px" : 0 }}>
                                                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", fontWeight: 800, color: cfg.color }}>{i + 1}</div>
                                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{item}</p>
                                            </div>
                                        )) : <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>—</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Content Ideas ── */}
                <SectionCard title="💡 Ide Konten Baru — Pakai DNA Sukses Ini">
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {(a.contentIdeas || []).map((idea, i) => (
                            <div key={i} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-secondary)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "11px", fontWeight: 900, color: "var(--bg-primary)" }}>{i + 1}</div>
                                    <span style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>{idea.angle}</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div>
                                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "4px" }}>🪝 Hook</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{idea.hook}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "4px" }}>🔮 Twist</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{idea.twist}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!a.contentIdeas || a.contentIdeas.length === 0) && <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>—</p>}
                    </div>
                </SectionCard>

                {/* ── Row: Production Recipe + Distribution ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: "20px" }}>
                    <SectionCard title="🎬 Production Recipe" accent="#3b82f6">
                        <InfoRow label="Visual Style" value={a.productionRecipe?.visualStyle || "—"} />
                        <InfoRow label="Editing Pace" value={a.productionRecipe?.editingPace || "—"} />
                        <InfoRow label="Audio Strategy" value={a.productionRecipe?.audioStrategy || "—"} />
                        <InfoRow label="Caption Style" value={a.productionRecipe?.captionStrategy || "—"} />
                        <InfoRow label="Durasi Optimal" value={a.productionRecipe?.duration || "—"} />
                        <InfoRow label="Platform Terbaik" value={a.productionRecipe?.bestPlatform || "—"} />
                    </SectionCard>

                    <SectionCard title="🚀 Distribusi & Publikasi" accent="#ec4899">
                        <InfoRow label="Waktu Posting Terbaik" value={a.distribution?.bestPostingTime || "—"} />
                        <InfoRow label="Strategi Hashtag" value={a.distribution?.hashtagStrategy || "—"} />
                        <InfoRow label="Formula Caption" value={a.distribution?.captionFormula || "—"} />
                    </SectionCard>
                </div>

            </div>
        </div>
    );
}

// ─── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ item, onView }: { item: AnalysisResponse; onView: () => void }) {
    return (
        <div onClick={onView} style={{ padding: "16px 20px", border: "1px solid var(--border)", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", background: "var(--bg-primary)", transition: "all 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--text-muted)" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || "Video Analysis"}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.originalName} · {item.fileSize ? (item.fileSize / 1024 / 1024).toFixed(1) : "?"} MB</div>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
                {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
            </div>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" style={{ color: "var(--text-muted)", flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ATMPage() {
    const [tab, setTab] = useState<"new" | "history">("new");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<AnalysisResponse[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AnalysisResponse | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const res = await fetch(`${API}/analyses`);
            const json = await res.json();
            if (res.ok && json.success) setHistory(json.data);
        } catch (e) { console.error(e); } finally { setLoadingHistory(false); }
    }, []);

    const fetchDetail = useCallback(async (id: string) => {
        setLoadingDetail(true); setSelectedItem(null);
        try {
            const res = await fetch(`${API}/analyses/${id}`);
            const json = await res.json();
            if (res.ok && json.success) setSelectedItem(json.data);
        } catch (e) { console.error(e); } finally { setLoadingDetail(false); }
    }, []);

    const handleTabChange = (t: "new" | "history") => {
        setTab(t); setSelectedItem(null);
        if (t === "history") fetchHistory();
    };

    const handleUpload = async (file: File) => {
        setLoading(true); setError(null); setResult(null);
        const fd = new FormData(); fd.append("video", file);
        try {
            const res = await fetch(`${API}/analyze`, { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || json.details || "Analisis gagal");
            setResult(json.data); setTab("new");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal terhubung ke server");
        } finally { setLoading(false); }
    };

    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                .atm-tab-toggle { display: inline-flex; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
                .atm-tab-btn { padding: 9px 20px; background: none; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s; white-space: nowrap; }
                .atm-tab-btn.active { background: var(--accent); color: var(--bg-primary); }
                .atm-tab-btn:not(.active) { color: var(--text-secondary); }
                .atm-tab-btn:not(.active):hover { background: var(--bg-secondary); color: var(--text-primary); }
            `}</style>

            {/* Page Header */}
            <div style={{ marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
                    <div>
                        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", marginBottom: "6px" }}>ATM VIDEO</p>
                        <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 900, letterSpacing: "-1px", color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.1 }}>Bedah DNA Viral Video</h1>
                        <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "560px", lineHeight: 1.6 }}>Upload video yang viral, kami akan mengungkap MENGAPA video tersebut viral dan bagaimana kamu bisa mereplikasi formula suksesnya.</p>
                    </div>
                    <div className="atm-tab-toggle">
                        <button className={`atm-tab-btn${tab === "new" ? " active" : ""}`} onClick={() => handleTabChange("new")}>Analisis Baru</button>
                        <button className={`atm-tab-btn${tab === "history" ? " active" : ""}`} onClick={() => handleTabChange("history")}>Riwayat</button>
                    </div>
                </div>
            </div>

            {/* ── Tab: New Analysis ── */}
            {tab === "new" && (
                <div>
                    {!result && !loading && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ textAlign: "center", marginBottom: "32px" }}>
                                <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "20px", flexWrap: "wrap" }}>
                                    {[["🔥", "Viral Score"], ["🧬", "Content DNA"], ["🎯", "ATM Framework"]].map(([icon, label]) => (
                                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>
                                            <span style={{ fontSize: "16px" }}>{icon}</span> {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ width: "100%", maxWidth: "640px" }}>
                                <UploadZone onUpload={handleUpload} loading={loading} />
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: "20px" }}>
                            <Spinner size={40} />
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>Membedah DNA viral video...</p>
                                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Gemini AI sedang menganalisis setiap frame. Ini mungkin butuh 30-60 detik.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ maxWidth: "640px", margin: "0 auto 24px", padding: "14px 18px", border: "1px solid #ef444440", borderRadius: "10px", background: "#ef444408", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <svg width="18" height="18" fill="none" stroke="#ef4444" viewBox="0 0 24 24" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: 700, color: "#ef4444", marginBottom: "4px" }}>Analisis Gagal</p>
                                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{error}</p>
                            </div>
                        </div>
                    )}

                    {!loading && result && (
                        <div>
                            <button onClick={() => { setResult(null); setError(null); }} style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", padding: "4px 0" }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                                Upload video baru
                            </button>
                            <AnalysisDisplay data={result} />
                        </div>
                    )}
                </div>
            )}

            {/* ── Tab: History ── */}
            {tab === "history" && (
                <div>
                    {selectedItem ? (
                        <div>
                            <button onClick={() => setSelectedItem(null)} style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", padding: "4px 0" }}>
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                                Kembali ke riwayat
                            </button>
                            <AnalysisDisplay data={selectedItem} />
                        </div>
                    ) : loadingDetail ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><Spinner size={32} /></div>
                    ) : loadingHistory ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}><Spinner size={32} /></div>
                    ) : history.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "80px 20px" }}>
                            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📂</div>
                            <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "6px" }}>Belum ada riwayat analisis</p>
                            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Upload video pertamamu dan mulai bedah formula viralnya!</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {history.map((item) => (
                                <HistoryCard key={item.id} item={item} onView={() => fetchDetail(item.id)} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
