"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AnalysisResult {
    title: string; summary: string;
    hook: { description: string; duration: string; technique: string };
    structure: { intro: string; body: string; outro: string; pacing: string };
    visualStyle: { colorPalette: string; transitions: string; textOverlays: string; bRoll: string };
    audio: { backgroundMusic: string; voiceover: string; soundEffects: string; tone: string };
    cta: { type: string; placement: string; message: string };
    engagement: { estimatedRetention: string; keyMoments: string[]; improvements: string[] };
    tags: string[];
}
interface AnalysisResponse {
    id: string; originalName: string; title: string; summary: string;
    analysis: AnalysisResult; flowText: string;
    flowJson: {
        videoTitle: string; platform: string; duration: string;
        segments: Array<{ order: number; name: string; duration: string; visual: string; audio: string; text: string; transition: string }>;
        productionNotes: { colorGrading: string; musicGenre: string; editingStyle: string; aspectRatio: string };
        aiPrompts: { imageGeneration: string; voiceoverScript: string; musicMood: string };
    };
    tags: string[];
    createdAt: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ─── Upload Area ──────────────────────────────────────────────────────────────
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
            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => !loading && ref.current?.click()}
                style={{
                    border: `2px dashed ${drag ? "var(--text-primary)" : file ? "var(--success)" : "var(--border)"}`,
                    borderRadius: "16px",
                    padding: "clamp(32px, 6vw, 64px) clamp(16px, 4vw, 40px)",
                    textAlign: "center",
                    cursor: loading ? "not-allowed" : "pointer",
                    backgroundColor: drag ? "var(--bg-secondary)" : "var(--bg-primary)",
                    transition: "all 0.2s ease",
                    opacity: loading ? 0.6 : 1,
                    boxSizing: "border-box",
                }}
            >
                <input ref={ref} type="file" accept="video/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} style={{ display: "none" }} />

                <div style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 24px", color: "var(--text-muted)",
                }}>
                    {file
                        ? <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        : <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    }
                </div>

                {file ? (
                    <>
                        <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "6px" }}>{file.name}</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{(file.size / 1024 / 1024).toFixed(1)} MB · Klik untuk ganti</p>
                    </>
                ) : (
                    <>
                        <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "8px" }}>Seret & lepas video di sini</p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>MP4 atau MOV · Maks 50MB</p>
                        <span style={{ display: "inline-block", padding: "8px 20px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", backgroundColor: "var(--bg-primary)" }}>
                            Pilih File
                        </span>
                    </>
                )}
            </div>

            {/* Analyze button */}
            {file && (
                <button
                    onClick={() => onUpload(file)}
                    disabled={loading}
                    style={{
                        marginTop: "16px", width: "100%", padding: "15px",
                        backgroundColor: loading ? "var(--bg-secondary)" : "var(--accent)",
                        color: loading ? "var(--text-muted)" : "var(--bg-primary)",
                        border: loading ? "1px solid var(--border)" : "none",
                        borderRadius: "10px", fontWeight: 700, fontSize: "15px",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                        transition: "opacity 0.15s", boxSizing: "border-box",
                    }}
                >
                    {loading
                        ? <><Spinner /> Menganalisis video...</>
                        : <>Analisis Sekarang <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>
                    }
                </button>
            )}
        </div>
    );
}

function Spinner() {
    return <div style={{ width: "18px", height: "18px", border: "2px solid var(--border)", borderTop: "2px solid var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />;
}

// ─── Result Display ───────────────────────────────────────────────────────────
function AnalysisDisplay({ data }: { data: AnalysisResponse }) {
    const [tab, setTab] = useState<"analysis" | "flow_text" | "flow_json">("analysis");

    const tabs = [
        { key: "analysis" as const, label: "Analisis" },
        { key: "flow_text" as const, label: "Script" },
        { key: "flow_json" as const, label: "Data" },
    ];

    return (
        <div style={{ marginTop: "48px", animation: "fadeInUp 0.4s ease" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {data.tags?.map((t) => (
                        <span key={t} style={{ padding: "4px 10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "999px", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>#{t}</span>
                    ))}
                </div>
                <h2 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, letterSpacing: "-1px", color: "var(--text-primary)", marginBottom: "8px" }}>{data.title}</h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "640px" }}>{data.summary}</p>
                <div style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "6px", maxWidth: "100%", overflow: "hidden" }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.originalName}</span>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "36px", overflowX: "auto" }}>
                {tabs.map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)} style={{
                        padding: "12px 20px", background: "none", border: "none", borderBottom: tab === t.key ? "2px solid var(--text-primary)" : "2px solid transparent",
                        marginBottom: "-1px", cursor: "pointer", fontSize: "13px", fontWeight: tab === t.key ? 700 : 500,
                        color: tab === t.key ? "var(--text-primary)" : "var(--text-muted)",
                        transition: "color 0.15s", whiteSpace: "nowrap",
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab: Analysis */}
            {tab === "analysis" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
                    {[
                        { label: "🪝 Hook", rows: [["Deskripsi", data.analysis.hook.description], ["Durasi", data.analysis.hook.duration], ["Teknik", data.analysis.hook.technique]] },
                        { label: "🏗 Struktur", rows: [["Intro", data.analysis.structure.intro], ["Body", data.analysis.structure.body], ["Outro", data.analysis.structure.outro], ["Pacing", data.analysis.structure.pacing]] },
                        { label: "🎨 Visual", rows: [["Color Palette", data.analysis.visualStyle.colorPalette], ["Transisi", data.analysis.visualStyle.transitions], ["Text Overlays", data.analysis.visualStyle.textOverlays]] },
                        { label: "🎵 Audio", rows: [["Musik Latar", data.analysis.audio.backgroundMusic], ["Voiceover", data.analysis.audio.voiceover], ["Tone", data.analysis.audio.tone]] },
                        { label: "📣 CTA", rows: [["Tipe", data.analysis.cta.type], ["Posisi", data.analysis.cta.placement], ["Pesan", data.analysis.cta.message]] },
                        { label: "📈 Engagement", rows: [["Estimasi Retensi", data.analysis.engagement.estimatedRetention]] },
                    ].map((card) => (
                        <div key={card.label} style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-primary)", transition: "border-color 0.15s, box-shadow 0.15s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>{card.label}</h4>
                            {card.rows.map(([l, v]) => (
                                <div key={l} style={{ marginBottom: "12px" }}>
                                    <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "4px" }}>{l}</div>
                                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{v}</div>
                                </div>
                            ))}
                            {card.label === "📈 Engagement" && (
                                <div style={{ marginTop: "12px" }}>
                                    {data.analysis.engagement.keyMoments?.map((m, i) => (
                                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "var(--text-secondary)" }}>
                                            <span style={{ color: "var(--success)", fontWeight: 700 }}>✓</span> {m}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Tab: Script */}
            {tab === "flow_text" && (
                <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "clamp(16px, 3vw, 32px)", overflowX: "auto" }}>
                    <pre style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>
                        {data.flowText}
                    </pre>
                </div>
            )}

            {/* Tab: Data */}
            {tab === "flow_json" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                    {data.flowJson?.aiPrompts && (
                        <div>
                            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>AI Generation Prompts</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "16px" }}>
                                {Object.entries(data.flowJson.aiPrompts).map(([k, v]) => (
                                    <div key={k} style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-primary)" }}>
                                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "10px" }}>{k.replace(/([A-Z])/g, " $1").trim()}</div>
                                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: "monospace", background: "var(--bg-secondary)", padding: "12px", borderRadius: "8px", wordBreak: "break-word" }}>{v as string}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.flowJson?.segments && (
                        <div>
                            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>Video Timeline</h3>
                            <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                                {data.flowJson.segments.map((seg, i) => (
                                    <div key={seg.order} style={{ padding: "16px 20px", display: "flex", gap: "16px", borderBottom: i < data.flowJson.segments.length - 1 ? "1px solid var(--border)" : "none", background: "var(--bg-primary)", transition: "background 0.15s" }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-primary)"; }}>
                                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{seg.order}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
                                                <h4 style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{seg.name}</h4>
                                                <span style={{ fontSize: "11px", padding: "2px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-muted)", fontFamily: "monospace" }}>{seg.duration}</span>
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                                                {[["Visual", seg.visual], ["Audio", seg.audio]].map(([l, v]) => (
                                                    <div key={l}>
                                                        <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.8px", marginBottom: "4px" }}>{l}</div>
                                                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{v}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── History Card ──────────────────────────────────────────────────────────────
function HistoryCard({ item, onView }: { item: any; onView: () => void }) {
    return (
        <div
            onClick={onView}
            style={{ padding: "16px 20px", border: "1px solid var(--border)", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", background: "var(--bg-primary)", transition: "all 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--text-muted)" }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || "Video Analysis"}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.originalName} · {(item.fileSize ? (item.fileSize / 1024 / 1024).toFixed(1) : "?")} MB</div>
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
    const [history, setHistory] = useState<any[]>([]);
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
        setLoadingDetail(true);
        setSelectedItem(null);
        try {
            const res = await fetch(`${API}/analyses/${id}`);
            const json = await res.json();
            if (res.ok && json.success) setSelectedItem(json.data);
        } catch (e) { console.error(e); } finally { setLoadingDetail(false); }
    }, []);

    const handleTabChange = (t: "new" | "history") => {
        setTab(t);
        setSelectedItem(null);
        if (t === "history") fetchHistory();
    };

    const handleUpload = async (file: File) => {
        setLoading(true); setError(null); setResult(null);
        const fd = new FormData(); fd.append("video", file);
        try {
            const res = await fetch(`${API}/analyze`, { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Analisis gagal");
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
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .atm-page-header { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
                .atm-title { font-size: clamp(22px, 4vw, 30px); font-weight: 900; letter-spacing: -1px; color: var(--text-primary); margin-bottom: 8px; line-height: 1.1; }
                .atm-tab-toggle { display: inline-flex; gap: 0; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; width: 100%; max-width: 300px; }
                .atm-upload-wrap { max-width: 100%; margin: 0 auto; width: 100%; }
                @media (min-width: 768px) { .atm-upload-wrap { max-width: 560px; } }
                @media (min-width: 1024px) { .atm-upload-wrap { max-width: 640px; } }
                @media (max-width: 480px) {
                    .atm-tab-toggle { max-width: 100%; width: 100%; }
                    .atm-tab-toggle button { flex: 1; }
                }
            `}</style>
            <div style={{ paddingBottom: "40px", paddingTop: "4px", animation: "fadeIn 0.3s ease" }}>

                {/* Header */}
                <div className="atm-page-header">
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>ATM Video</p>
                    <h1 className="atm-title">Analisis Video Shorts</h1>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>Upload video viral dan dapatkan breakdown mendalam dari AI.</p>
                    {/* Tabs below title */}
                    <div className="atm-tab-toggle">
                        {[{ key: "new", label: "Analisis Baru" }, { key: "history", label: "Riwayat" }].map(({ key, label }) => (
                            <button key={key} onClick={() => handleTabChange(key as "new" | "history")} style={{
                                padding: "10px 20px", border: "none", borderRight: key === "new" ? "1px solid var(--border)" : "none",
                                background: tab === key ? "var(--accent)" : "var(--bg-primary)",
                                color: tab === key ? "var(--bg-primary)" : "var(--text-secondary)",
                                cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "all 0.15s",
                            }}>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* New Analysis */}
                {tab === "new" && (
                    <div style={{ animation: "fadeIn 0.25s ease" }}>
                        {!result && (
                            <div className="atm-upload-wrap">
                                <UploadZone onUpload={handleUpload} loading={loading} />
                            </div>
                        )}

                        {error && (
                            <div style={{ margin: "24px auto", maxWidth: "640px", padding: "14px 20px", border: "1px solid var(--danger)", borderRadius: "10px", color: "var(--danger)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-primary)" }}>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                {error}
                            </div>
                        )}

                        {loading && (
                            <div style={{ marginTop: "32px", padding: "clamp(32px, 6vw, 64px) clamp(20px, 4vw, 40px)", border: "1px solid var(--border)", borderRadius: "16px", textAlign: "center", background: "var(--bg-primary)" }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                    <Spinner />
                                </div>
                                <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "6px" }}>AI sedang menganalisis video</p>
                                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Proses memakan waktu 30–60 detik tergantung durasi video</p>
                            </div>
                        )}

                        {result && !loading && <AnalysisDisplay data={result} />}
                    </div>
                )}

                {/* History */}
                {tab === "history" && (
                    <div style={{ animation: "fadeIn 0.25s ease" }}>

                        {/* Detail view */}
                        {(selectedItem || loadingDetail) ? (
                            <div>
                                {/* Back button */}
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px", background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", transition: "all 0.15s" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                                    Kembali ke Riwayat
                                </button>

                                {loadingDetail ? (
                                    <div style={{ padding: "clamp(32px, 6vw, 64px) clamp(20px, 4vw, 40px)", border: "1px solid var(--border)", borderRadius: "16px", textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}><Spinner /></div>
                                        <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>Memuat detail analisis...</p>
                                    </div>
                                ) : selectedItem ? (
                                    <AnalysisDisplay data={selectedItem} />
                                ) : null}
                            </div>

                        ) : loadingHistory ? (
                            <div style={{ textAlign: "center", padding: "80px 40px", color: "var(--text-muted)", fontSize: "14px" }}>Memuat riwayat...</div>

                        ) : history.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "clamp(40px, 8vw, 80px) clamp(20px, 4vw, 40px)", border: "1px solid var(--border)", borderRadius: "16px", background: "var(--bg-primary)" }}>
                                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--text-muted)" }}>
                                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)", marginBottom: "8px" }}>Belum ada riwayat</p>
                                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>Analisis pertama kamu akan muncul di sini</p>
                                <button onClick={() => handleTabChange("new")} style={{ padding: "10px 24px", background: "var(--accent)", color: "var(--bg-primary)", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                                    Analisis Sekarang
                                </button>
                            </div>

                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {history.map((item) => (
                                    <HistoryCard key={item.id} item={item} onView={() => fetchDetail(item.id)} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
