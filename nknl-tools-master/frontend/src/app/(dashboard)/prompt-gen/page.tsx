"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const ImageIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);
const VideoIcon2 = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    </svg>
);
const CopyIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const CheckIcon = () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);
const TrashIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const EyeIcon = () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const Spinner = () => (
    <div style={{ width: "17px", height: "17px", border: "2px solid var(--border)", borderTop: "2px solid var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
function formatDate(d: string) {
    return new Date(d).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text, small }: { text: string; small?: boolean }) {
    const [copied, setCopied] = useState(false);
    const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <button onClick={copy} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: small ? "4px 10px" : "6px 14px", border: "1px solid var(--border)", borderRadius: "6px", background: copied ? "var(--success)" : "var(--bg-primary)", color: copied ? "white" : "var(--text-secondary)", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", flexShrink: 0 }}>
            {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "Disalin!" : "Salin"}
        </button>
    );
}

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = [
    { key: "universal", label: "Universal", emoji: "⚡" },
    { key: "veo31", label: "Veo 3.1", emoji: "🔵" },
    { key: "googleFlow", label: "Google Flow", emoji: "🌊" },
    { key: "grok", label: "Grok Aurora", emoji: "🌌" },
    { key: "runway", label: "Runway", emoji: "🎬" },
    { key: "kling", label: "Kling AI", emoji: "🎯" },
];

// ─── JSON Result Display ──────────────────────────────────────────────────────
function JsonResultDisplay({ data }: { data: any }) {
    const [activeTab, setActiveTab] = useState<"overview" | "platform" | "raw">("raw");
    const [activePlatform, setActivePlatform] = useState("universal");
    const labelMap: Record<string, Record<string, string>> = {
        camera: { movement: "Gerakan", angle: "Sudut", lens: "Lensa", depthOfField: "Depth of Field" },
        lighting: { type: "Tipe", colorTemperature: "Suhu Warna", shadows: "Bayangan", source: "Sumber" },
        subject: { description: "Deskripsi", action: "Aksi", expression: "Ekspresi", clothing: "Pakaian" },
        atmosphere: { mood: "Mood", timeOfDay: "Waktu", weather: "Cuaca", setting: "Setting" },
        colorGrade: { style: "Style", palette: "Palette", contrast: "Kontras", reference: "Referensi" },
        motion: { speed: "Kecepatan", dynamics: "Dinamika", cameraMotion: "Gerak Kamera" },
        technical: { duration: "Durasi", aspectRatio: "Aspek Rasio", resolution: "Resolusi", fps: "Frame Rate" },
    };
    const sections = [
        { key: "sceneDescription", label: "🎬 Scene", single: true },
        { key: "camera", label: "📷 Kamera" }, { key: "lighting", label: "💡 Pencahayaan" },
        { key: "subject", label: "👤 Subjek" }, { key: "atmosphere", label: "🌅 Atmosfer" },
        { key: "colorGrade", label: "🎨 Color Grade" }, { key: "motion", label: "🎭 Gerak" },
        { key: "technical", label: "⚙️ Teknis" },
    ];
    return (
        <div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "20px", overflowX: "auto" }}>
                {[{ k: "raw", l: "Raw JSON" }, { k: "overview", l: "Ringkasan" }].map(({ k, l }) => (
                    <button key={k} onClick={() => setActiveTab(k as any)} style={{ padding: "9px 16px", background: "none", border: "none", borderBottom: activeTab === k ? "2px solid var(--text-primary)" : "2px solid transparent", marginBottom: "-1px", cursor: "pointer", fontSize: "12px", fontWeight: activeTab === k ? 700 : 500, color: activeTab === k ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap", transition: "color 0.15s" }}>{l}</button>
                ))}
            </div>
            {activeTab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "12px" }}>
                    {sections.map(({ key, label, single }) => {
                        const val = data[key]; if (!val) return null;
                        return (
                            <div key={key} style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-primary)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
                                    <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{label}</h4>
                                </div>
                                {single ? <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.65 }}>{String(val)}</p>
                                    : Object.entries(val as Record<string, string>).map(([k, v]) => v ? (
                                        <div key={k} style={{ marginBottom: "8px" }}>
                                            <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--text-muted)", marginBottom: "2px" }}>{labelMap[key]?.[k] || k}</div>
                                            <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{String(v)}</div>
                                        </div>
                                    ) : null)}
                            </div>
                        );
                    })}
                    {data.negativePrompt && (
                        <div style={{ padding: "16px", border: "1px solid var(--danger)", borderRadius: "10px", background: "var(--bg-primary)" }}>
                            <div style={{ marginBottom: "8px" }}>
                                <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--danger)" }}>⛔ Negative Prompt</h4>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{data.negativePrompt}</p>
                        </div>
                    )}
                    {data.tags?.length > 0 && (
                        <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-primary)" }}>
                            <h4 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>🏷️ Tags</h4>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {data.tags.map((t: string) => <span key={t} style={{ padding: "3px 10px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "999px", fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)" }}>#{t}</span>)}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === "platform" && (
                <div>
                    <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {PLATFORMS.map(({ key, label, emoji }) => (
                            <button key={key} onClick={() => setActivePlatform(key)} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "8px", background: activePlatform === key ? "var(--accent)" : "var(--bg-primary)", color: activePlatform === key ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                                {emoji} {label}
                            </button>
                        ))}
                    </div>
                    {data.platformPrompts?.[activePlatform] && (
                        <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{PLATFORMS.find(p => p.key === activePlatform)?.emoji} {PLATFORMS.find(p => p.key === activePlatform)?.label}</span>
                                <CopyButton text={data.platformPrompts[activePlatform]} small />
                            </div>
                            <div style={{ padding: "16px" }}>
                                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.75, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{data.platformPrompts[activePlatform]}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === "raw" && (
                <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>JSON Output</span>
                        <CopyButton text={JSON.stringify(data, null, 2)} small />
                    </div>
                    <div style={{ padding: "16px", background: "var(--bg-secondary)", overflowX: "auto" }}>
                        <pre style={{ fontFamily: "monospace", fontSize: "11px", lineHeight: 1.7, color: "var(--text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ mediaType, onFile, file, loading }: { mediaType: "image" | "video"; onFile: (f: File) => void; file: File | null; loading: boolean }) {
    const [drag, setDrag] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const accept = mediaType === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "video/mp4,video/quicktime,video/webm";
    const label = mediaType === "image" ? "JPG, PNG, WebP, GIF · Maks 50MB" : "MP4, MOV, WebM · Maks 50MB";
    const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }, [onFile]);

    return (
        <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop} onClick={() => !loading && ref.current?.click()} style={{ border: `2px dashed ${drag ? "var(--text-primary)" : file ? "var(--success)" : "var(--border)"}`, borderRadius: "12px", padding: "clamp(24px, 5vw, 40px) clamp(16px, 4vw, 28px)", textAlign: "center", cursor: loading ? "not-allowed" : "pointer", backgroundColor: drag ? "var(--bg-secondary)" : "transparent", transition: "all 0.2s ease", opacity: loading ? 0.6 : 1 }}>
            <input ref={ref} type="file" accept={accept} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} style={{ display: "none" }} />
            {file && mediaType === "image" ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <img src={URL.createObjectURL(file)} alt="preview" style={{ maxHeight: "140px", maxWidth: "100%", borderRadius: "8px", objectFit: "contain", border: "1px solid var(--border)" }} />
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{file.name} · {formatBytes(file.size)} · <span style={{ color: "var(--accent)" }}>Ganti</span></p>
                </div>
            ) : file && mediaType === "video" ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--bg-secondary)", border: "1px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--success)", margin: "0 auto" }}>
                        <CheckIcon />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)" }}>{file.name}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{formatBytes(file.size)} · <span style={{ color: "var(--accent)" }}>Ganti</span></p>
                </div>
            ) : (
                <>
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "var(--text-muted)" }}>
                        {mediaType === "image" ? <ImageIcon /> : <VideoIcon2 />}
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "5px" }}>Seret & lepas {mediaType === "image" ? "gambar" : "video"} di sini</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>{label}</p>
                    <span style={{ display: "inline-block", padding: "7px 16px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)" }}>Pilih File</span>
                </>
            )}
        </div>
    );
}

// ─── History List ─────────────────────────────────────────────────────────────
function HistoryList({ onView }: { onView: (id: string) => void }) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/prompt-history`);
            const json = await res.json();
            if (json.success) setItems(json.data);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchHistory(); }, [fetchHistory]);

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus riwayat ini?")) return;
        setDeleting(id);
        try {
            await fetch(`${API}/prompt-history/${id}`, { method: "DELETE" });
            setItems(prev => prev.filter(i => i.id !== id));
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return (
        <div style={{ padding: "40px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><Spinner /></div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Memuat riwayat...</p>
        </div>
    );

    if (items.length === 0) return (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📭</div>
            <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", marginBottom: "6px" }}>Belum ada riwayat</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Generate prompt pertamamu lewat tab Generate Baru</p>
        </div>
    );

    const langLabel: Record<string, string> = { id: "🇮🇩 Indonesia", en: "🇺🇸 English" };
    const formatLabel: Record<string, string> = { text: "📄 Teks", json: "{ } JSON" };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {items.map((item) => (
                <div key={item.id} style={{ background: "var(--bg-primary)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {/* Media icon */}
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexShrink: 0 }}>
                        {item.mediaType === "image" ? <ImageIcon /> : <VideoIcon2 />}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.originalName}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(item.createdAt)}</span>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>·</span>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatBytes(item.fileSize)}</span>
                            <span style={{ fontSize: "11px", padding: "1px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "999px", color: "var(--text-secondary)", fontWeight: 600 }}>{langLabel[item.lang] || item.lang}</span>
                            <span style={{ fontSize: "11px", padding: "1px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "999px", color: "var(--text-secondary)", fontWeight: 600 }}>{formatLabel[item.format] || item.format}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <button
                            onClick={() => onView(item.id)}
                            style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "7px", background: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                        >
                            <EyeIcon /> Lihat
                        </button>
                        <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deleting === item.id}
                            style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "7px", background: "var(--bg-primary)", color: "var(--danger)", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", opacity: deleting === item.id ? 0.5 : 1 }}
                        >
                            <TrashIcon /> Hapus
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PromptGenPage() {
    // Default: video tab first
    const [mediaType, setMediaType] = useState<"image" | "video">("video");
    const [mainTab, setMainTab] = useState<"generate" | "history">("generate");
    const [file, setFile] = useState<File | null>(null);
    const [lang, setLang] = useState<"id" | "en">("en");
    const [format, setFormat] = useState<"text" | "json">("json");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    // For viewing a history record
    const [viewingRecord, setViewingRecord] = useState<any>(null);
    const [loadingRecord, setLoadingRecord] = useState(false);

    const handleMediaTypeChange = (t: "image" | "video") => { setMediaType(t); setFile(null); setResult(null); setError(null); };

    const handleGenerate = async () => {
        if (!file) return;
        setLoading(true); setError(null); setResult(null);
        const fd = new FormData();
        fd.append("media", file);
        fd.append("lang", lang);
        fd.append("format", format);
        try {
            const res = await fetch(`${API}/generate-prompt`, { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Gagal generate prompt");
            setResult(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal terhubung ke server");
        } finally {
            setLoading(false);
        }
    };

    const handleViewHistory = async (id: string) => {
        setLoadingRecord(true);
        setViewingRecord(null);
        try {
            const res = await fetch(`${API}/prompt-history/${id}`);
            const json = await res.json();
            if (json.success) setViewingRecord(json.data);
        } finally {
            setLoadingRecord(false);
        }
    };

    const handleReset = () => { setResult(null); setFile(null); setError(null); };

    return (
        <>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .pg-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                @media (max-width: 600px) { .pg-controls { grid-template-columns: 1fr; } }
            `}</style>

            <div style={{ paddingBottom: "40px", paddingTop: "4px", animation: "fadeIn 0.3s ease" }}>

                {/* Header */}
                <div style={{ marginBottom: "20px", paddingBottom: "18px", borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>Prompt Gen</p>
                    <h1 style={{ fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", marginBottom: "6px" }}>AI Video Prompt Generator</h1>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Hasilkan prompt sinematik mendalam dari video atau gambar untuk Veo 3.1, Google Flow, Grok, Runway, dan Kling.</p>
                </div>

                {/* Main tabs: Generate | History */}
                <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "20px" }}>
                    {([{ k: "generate", l: "Generate Baru" }, { k: "history", l: "Riwayat" }] as const).map(({ k, l }) => (
                        <button key={k} onClick={() => { setMainTab(k); setViewingRecord(null); }} style={{ padding: "9px 20px", border: "none", borderRight: k === "generate" ? "1px solid var(--border)" : "none", background: mainTab === k ? "var(--accent)" : "var(--bg-primary)", color: mainTab === k ? "var(--bg-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "all 0.15s" }}>{l}</button>
                    ))}
                </div>

                {/* ── HISTORY TAB ── */}
                {mainTab === "history" && (
                    <div style={{ animation: "fadeIn 0.25s ease" }}>
                        {viewingRecord ? (
                            /* Viewing a single record */
                            <div style={{ animation: "fadeInUp 0.25s ease" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                                    <div>
                                        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "3px" }}>Detail Riwayat</p>
                                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{viewingRecord.originalName}</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "5px" }}>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(viewingRecord.createdAt)}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>·</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatBytes(viewingRecord.fileSize)}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>· {viewingRecord.mediaType === "image" ? "🖼 Gambar" : "🎬 Video"}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>· {viewingRecord.lang === "id" ? "🇮🇩 Indonesia" : "🇺🇸 English"}</span>
                                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>· {viewingRecord.format === "text" ? "📄 Teks" : "{ } JSON"}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewingRecord(null)} style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>← Kembali</button>
                                </div>
                                {viewingRecord.format === "text" && viewingRecord.text && (
                                    <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                                            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>📄 Prompt Lengkap</span>
                                            <CopyButton text={viewingRecord.text} />
                                        </div>
                                        <div style={{ padding: "18px" }}>
                                            <pre style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{viewingRecord.text}</pre>
                                        </div>
                                    </div>
                                )}
                                {viewingRecord.format === "json" && viewingRecord.json && <JsonResultDisplay data={viewingRecord.json} />}
                            </div>
                        ) : loadingRecord ? (
                            <div style={{ padding: "40px", textAlign: "center" }}>
                                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><Spinner /></div>
                                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Memuat detail...</p>
                            </div>
                        ) : (
                            <HistoryList onView={handleViewHistory} />
                        )}
                    </div>
                )}

                {/* ── GENERATE TAB ── */}
                {mainTab === "generate" && (
                    <div style={{ animation: "fadeIn 0.25s ease" }}>
                        {result ? (
                            /* Result view */
                            <div style={{ animation: "fadeInUp 0.3s ease" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
                                    <div>
                                        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "3px" }}>Hasil Prompt</p>
                                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{result.originalName} · {result.mediaType === "image" ? "🖼 Gambar" : "🎬 Video"}</p>
                                        <p style={{ fontSize: "11px", color: "var(--success)", marginTop: "3px", fontWeight: 600 }}>✓ Tersimpan di database</p>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <button onClick={() => { setMainTab("history"); setViewingRecord(null); }} style={{ padding: "8px 14px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>📋 Lihat Riwayat</button>
                                        <button onClick={handleReset} style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>← Generate Baru</button>
                                    </div>
                                </div>
                                {result.format === "text" && result.text && (
                                    <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                                            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>📄 Prompt Lengkap</span>
                                            <CopyButton text={result.text} />
                                        </div>
                                        <div style={{ padding: "18px" }}>
                                            <pre style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{result.text}</pre>
                                        </div>
                                    </div>
                                )}
                                {result.format === "json" && result.json && <JsonResultDisplay data={result.json} />}
                                {result.format === "json" && !result.json && result.text && (
                                    <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                                            <span style={{ fontSize: "13px", fontWeight: 700 }}>📄 Prompt (Text fallback)</span>
                                            <CopyButton text={result.text} />
                                        </div>
                                        <div style={{ padding: "18px" }}>
                                            <pre style={{ fontFamily: "monospace", fontSize: "12px", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0 }}>{result.text}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Input form */
                            <>
                                {/* Media type — Video first */}
                                <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                                    {([{ k: "video", l: "Video", icon: "🎬" }, { k: "image", l: "Gambar", icon: "🖼" }] as const).map(({ k, l, icon }) => (
                                        <button key={k} onClick={() => handleMediaTypeChange(k)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", border: "none", borderRight: k === "video" ? "1px solid var(--border)" : "none", background: mediaType === k ? "var(--accent)" : "var(--bg-primary)", color: mediaType === k ? "var(--bg-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "all 0.15s" }}>
                                            <span>{icon}</span> {l}
                                        </button>
                                    ))}
                                </div>

                                <UploadZone mediaType={mediaType} onFile={setFile} file={file} loading={loading} />

                                <div className="pg-controls" style={{ marginTop: "16px" }}>
                                    {/* Language */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "7px" }}>Bahasa Output</label>
                                        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                                            {([{ k: "id", l: "🇮🇩 Indonesia" }, { k: "en", l: "🇺🇸 English" }] as const).map(({ k, l }) => (
                                                <button key={k} onClick={() => setLang(k)} style={{ flex: 1, padding: "9px 10px", border: "none", borderRight: k === "id" ? "1px solid var(--border)" : "none", background: lang === k ? "var(--bg-secondary)" : "var(--bg-primary)", color: lang === k ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", fontSize: "12px", fontWeight: lang === k ? 700 : 500, transition: "all 0.15s" }}>{l}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Format */}
                                    <div>
                                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "7px" }}>Format Output</label>
                                        <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                                            {([{ k: "text", l: "📄 Teks" }, { k: "json", l: "{ } JSON" }] as const).map(({ k, l }) => (
                                                <button key={k} onClick={() => setFormat(k)} style={{ flex: 1, padding: "9px 10px", border: "none", borderRight: k === "text" ? "1px solid var(--border)" : "none", background: format === k ? "var(--bg-secondary)" : "var(--bg-primary)", color: format === k ? "var(--text-primary)" : "var(--text-muted)", cursor: "pointer", fontSize: "12px", fontWeight: format === k ? 700 : 500, transition: "all 0.15s" }}>{l}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Best result tip */}
                                <div style={{ marginTop: "14px", padding: "11px 14px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-secondary)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                    <span style={{ fontSize: "14px", flexShrink: 0 }}>💡</span>
                                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                                        <strong style={{ color: "var(--text-primary)" }}>Tips hasil maksimal:</strong> Gunakan output <strong style={{ color: "var(--text-primary)" }}>English</strong> dan format <strong style={{ color: "var(--text-primary)" }}>JSON</strong> — prompt menjadi lebih terstruktur, detail, dan siap pakai langsung di semua platform generator video AI.
                                    </p>
                                </div>

                                {/* Platform info chips */}
                                <div style={{ marginTop: "10px", padding: "11px 14px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-secondary)", display: "flex", flexWrap: "wrap", gap: "7px", alignItems: "center" }}>
                                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Prompt untuk:</span>
                                    {PLATFORMS.map(({ key, label, emoji }) => (
                                        <span key={key} style={{ fontSize: "11px", padding: "2px 9px", background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "999px", color: "var(--text-secondary)", fontWeight: 600 }}>{emoji} {label}</span>
                                    ))}
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{ marginTop: "14px", padding: "13px 16px", border: "1px solid var(--danger)", borderRadius: "10px", color: "var(--danger)", fontSize: "13px", fontWeight: 600, display: "flex", gap: "10px", alignItems: "center" }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        {error}
                                    </div>
                                )}

                                {/* CTA */}
                                <button onClick={handleGenerate} disabled={!file || loading} style={{ marginTop: "18px", width: "100%", padding: "14px", background: !file || loading ? "var(--bg-secondary)" : "var(--accent)", color: !file || loading ? "var(--text-muted)" : "var(--bg-primary)", border: !file || loading ? "1px solid var(--border)" : "none", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: !file || loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.15s" }}>
                                    {loading ? <><Spinner /> Memproses dengan AI...</> : <>✨ Hasilkan Prompt</>}
                                </button>

                                {loading && (
                                    <div style={{ marginTop: "18px", padding: "24px", border: "1px solid var(--border)", borderRadius: "10px", textAlign: "center" }}>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><Spinner /></div>
                                        <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-primary)", marginBottom: "5px" }}>AI sedang menganalisis {mediaType === "image" ? "gambar" : "video"}...</p>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Membuat prompt sinematik mendalam untuk semua platform</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
