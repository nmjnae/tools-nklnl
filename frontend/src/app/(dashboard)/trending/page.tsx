"use client";

import { useState, useEffect } from "react";

interface ContentScript {
    variation: number; angle: string; estimatedDuration: string;
    hook: { text: string; duration: string; visualGuide: string; technique: string; };
    body: Array<{ timestamp: string; narration: string; visualGuide: string; editingNote: string; }>;
    cta: { text: string; timestamp: string; visualGuide: string; };
    productionNotes: { totalDuration: string; editingSoftware: string; audioRecommendation: string; };
}

interface TrendingVideo {
    id: string; title: string; niche: string; viralScore: number;
    views: string; hookHighlight: string; whyViral: string;
    gradientFrom: string; gradientTo: string; isBookmarked: boolean;
}

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

const NICHES = [
    "Semua", "Gaming", "Finance", "KPop & Commentary", "Automotive",
    "Food & Kuliner", "Skincare & Beauty", "Tech Review", "Education",
    "Fitness & Olahraga", "Comedy & Hiburan", "Travel & Lifestyle",
];

const TONES: { key: string; emoji: string; label: string }[] = [
    { key: "Seru", emoji: "⚡", label: "Seru" },
    { key: "Informatif", emoji: "📚", label: "Informatif" },
    { key: "Komedi", emoji: "😂", label: "Komedi" },
    { key: "Motivatif", emoji: "🔥", label: "Motivatif" },
    { key: "Edukatif", emoji: "💡", label: "Edukatif" },
    { key: "Storytelling", emoji: "🎭", label: "Storytelling" },
];

function Spinner({ size = 18 }: { size?: number }) {
    return <div style={{ width: size, height: size, border: "2px solid var(--border)", borderTop: "2px solid var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />;
}

function ScriptResult({ scripts, onClose }: { scripts: ContentScript[]; onClose: () => void }) {
    const [active, setActive] = useState(0);
    const [copied, setCopied] = useState<string | null>(null);
    const s = scripts[active];
    if (!s) return null;

    const fullScript = [
        `🎬 VARIASI ${s.variation}: ${s.angle}`,
        `⏱ Durasi: ${s.estimatedDuration}`,
        `\n🪝 HOOK (${s.hook.duration})`,
        s.hook.text,
        `📷 Visual: ${s.hook.visualGuide}`,
        `\n📹 BODY`,
        ...(s.body || []).map((b) => `[${b.timestamp}]\n${b.narration}\n📷 ${b.visualGuide}\n✂️ ${b.editingNote}`),
        `\n📢 CTA (${s.cta?.timestamp})`,
        s.cta?.text,
        `\n🎵 Produksi: ${s.productionNotes?.audioRecommendation}`,
        `🖥️ Software: ${s.productionNotes?.editingSoftware}`,
    ].join("\n");

    const copyText = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
                {scripts.map((sc, i) => (
                    <button key={i} onClick={() => setActive(i)}
                        style={{ flex: 1, padding: "8px 4px", border: `1.5px solid ${active === i ? "#6366f1" : "var(--border)"}`, borderRadius: "8px", background: active === i ? "#6366f110" : "var(--bg-secondary)", color: active === i ? "#6366f1" : "var(--text-secondary)", fontSize: "12px", fontWeight: active === i ? 700 : 500, cursor: "pointer", fontFamily: "inherit" }}>
                        V{sc.variation}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: "12px", padding: "12px 14px", background: "var(--bg-secondary)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>Variasi {s.variation} — {s.angle}</div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.estimatedDuration}</span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>🪝 Hook ({s.hook.duration})</div>
                        <button onClick={() => copyText(s.hook.text, "hook")} style={{ fontSize: "11px", background: "none", border: "none", color: copied === "hook" ? "#10b981" : "#6366f1", cursor: "pointer", fontFamily: "inherit" }}>
                            {copied === "hook" ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: "4px", padding: "8px 10px", background: "var(--bg-primary)", borderRadius: "6px", border: "1px solid var(--border)" }}>{s.hook.text}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>📷 {s.hook.visualGuide}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>✨ Teknik: {s.hook.technique}</div>
                </div>

                {(s.body || []).map((b, i) => (
                    <div key={i} style={{ marginBottom: "10px", paddingTop: "10px", borderTop: "1px dashed var(--border)" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>📹 Body [{b.timestamp}]</div>
                        <div style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "4px" }}>{b.narration}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "2px" }}>📷 {b.visualGuide}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>✂️ {b.editingNote}</div>
                    </div>
                ))}

                <div style={{ paddingTop: "10px", borderTop: "1px dashed var(--border)", marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>📢 CTA ({s.cta?.timestamp})</div>
                        <button onClick={() => copyText(s.cta?.text || "", "cta")} style={{ fontSize: "11px", background: "none", border: "none", color: copied === "cta" ? "#10b981" : "#6366f1", cursor: "pointer", fontFamily: "inherit" }}>
                            {copied === "cta" ? "✓ Copied" : "Copy"}
                        </button>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-primary)", lineHeight: 1.5 }}>{s.cta?.text}</div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", padding: "3px 8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)" }}>🎵 {s.productionNotes?.audioRecommendation}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", padding: "3px 8px", background: "var(--bg-primary)", borderRadius: "4px", border: "1px solid var(--border)" }}>🖥️ {s.productionNotes?.editingSoftware}</span>
                </div>
            </div>

            <button onClick={() => copyText(fullScript, "full")}
                style={{ width: "100%", padding: "11px", background: copied === "full" ? "#10b98115" : "var(--bg-secondary)", border: `1px solid ${copied === "full" ? "#10b981" : "var(--border)"}`, borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: copied === "full" ? "#10b981" : "var(--text-primary)", cursor: "pointer", fontFamily: "inherit" }}>
                {copied === "full" ? "✓ Script Tersalin!" : "📋 Copy Full Script"}
            </button>
        </div>
    );
}

function MimicModal({ video, onClose }: { video: TrendingVideo; onClose: () => void }) {
    const [topic, setTopic] = useState("");
    const [selectedTones, setSelectedTones] = useState<string[]>(["Seru"]);
    const [loading, setLoading] = useState(false);
    const [scripts, setScripts] = useState<ContentScript[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const toggleTone = (key: string) => {
        setSelectedTones((prev) => {
            if (prev.includes(key)) return prev.length > 1 ? prev.filter((t) => t !== key) : prev;
            if (prev.length >= 2) return [prev[1], key];
            return [...prev, key];
        });
    };

    const generate = async () => {
        setLoading(true); setError(null);
        try {
            let res: Response;
            try {
                res = await fetch(`${API}/trending/${video.id}/generate-script`, {
                    method: "POST", credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ topic: topic.trim() || null, tones: selectedTones }),
                });
            } catch {
                throw new Error("Koneksi gagal. AI sedang sibuk — tunggu beberapa detik lalu coba lagi.");
            }
            let json: { error?: string; data?: ContentScript[] };
            try { json = await res.json(); } catch {
                throw new Error("AI sedang mengalami lonjakan permintaan. Coba lagi dalam 10–30 detik.");
            }
            if (!res.ok) throw new Error(json.error || "Gagal generate script");
            if (!json.data) throw new Error("Respons tidak valid dari AI. Coba lagi.");
            setScripts(json.data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Terjadi kesalahan");
        } finally { setLoading(false); }
    };

    const nicheExamples: Record<string, string> = {
        "Gaming": "Genshin Impact build terbaru, review game horror indie...",
        "Finance": "Cara nabung pertama gaji, strategi cicilan KPR...",
        "Automotive": "Review Yamaha Aerox 2025, tips modif motor trail...",
        "KPop & Commentary": "Pendapat jujur soal comeback AESPA, analisis MV terbaru...",
        "Food & Kuliner": "Cobain bakso viral TikTok, resep es kopi susu murah...",
        "Skincare & Beauty": "Review sunscreen lokal Rp30rb, rutinitas pagi 5 menit...",
        "Tech Review": "Unboxing laptop gaming budget, test kamera HP Rp2 juta...",
        "Education": "Cara belajar desain gratis, tips lolos beasiswa luar negeri...",
        "Fitness & Olahraga": "Workout 10 menit di kamar kos, tips diet tanpa lapar...",
        "Comedy & Hiburan": "Drama kantor yang absurd, POV anak pertama di rumah...",
        "Travel & Lifestyle": "Liburan Lombok 3 hari Rp800rb, hidden gem Bandung...",
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
            <div style={{ position: "relative", width: "100%", maxWidth: "600px", maxHeight: "92vh", overflowY: "auto", background: "var(--bg-primary)", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "sticky", top: 0, background: "var(--bg-primary)", zIndex: 1, borderRadius: "20px 20px 0 0" }}>
                    <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "#6366f1", marginBottom: "4px" }}>Tiru Tren Ini</div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3 }}>{video.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>Niche: {video.niche} · Score: {video.viralScore}/100</div>
                    </div>
                    <button onClick={onClose} style={{ flexShrink: 0, marginLeft: "12px", background: "none", border: "1px solid var(--border)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-muted)", fontSize: "16px" }}>×</button>
                </div>

                <div style={{ padding: "24px" }}>
                    {!scripts ? (
                        <>
                            <div style={{ marginBottom: "20px", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-secondary)" }}>
                                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: "var(--text-muted)", marginBottom: "4px" }}>Formula yang Akan Ditiru</div>
                                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{video.hookHighlight}</div>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
                                    Topik spesifikmu <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>(opsional)</span>
                                </label>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "0 0 8px" }}>Jika dikosongkan, AI akan menyesuaikan sendiri berdasarkan niche dan formula tren.</p>
                                <input
                                    value={topic} onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter" && !loading) generate(); }}
                                    placeholder={nicheExamples[video.niche] || "Topik yang ingin kamu bahas..."}
                                    style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                                    onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
                                    onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                                    autoFocus
                                />
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>Pilih Tone Video</label>
                                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{selectedTones.length}/2 dipilih</span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                                    {TONES.map((t) => {
                                        const isSelected = selectedTones.includes(t.key);
                                        return (
                                            <button key={t.key} onClick={() => toggleTone(t.key)}
                                                style={{ padding: "10px 8px", border: `1.5px solid ${isSelected ? "#6366f1" : "var(--border)"}`, borderRadius: "10px", background: isSelected ? "#6366f110" : "var(--bg-secondary)", color: isSelected ? "#6366f1" : "var(--text-secondary)", cursor: "pointer", fontSize: "12px", fontWeight: isSelected ? 700 : 500, fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                                <span style={{ fontSize: "18px" }}>{t.emoji}</span>
                                                <span>{t.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "8px 0 0" }}>Pilih hingga 2 tone yang paling sesuai dengan gaya kontenmu.</p>
                            </div>

                            {error && <div style={{ padding: "10px 14px", background: "#ef444408", border: "1px solid #ef444430", borderRadius: "8px", fontSize: "12px", color: "#ef4444", marginBottom: "16px" }}>{error}</div>}

                            {loading ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px", gap: "12px", color: "var(--text-muted)" }}>
                                    <Spinner size={28} />
                                    <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>Mengadaptasi formula trending ke kontenmu...</p>
                                    <p style={{ fontSize: "12px", margin: 0 }}>Biasanya 15–30 detik</p>
                                </div>
                            ) : (
                                <button onClick={generate}
                                    style={{ width: "100%", padding: "13px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                                    ✨ Generate My Script Now
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <ScriptResult scripts={scripts} onClose={() => setScripts(null)} />
                            <button onClick={() => setScripts(null)} style={{ marginTop: "16px", width: "100%", padding: "10px", background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                ← Coba Topik / Tone Lain
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TrendingPage() {
    const [videos, setVideos] = useState<TrendingVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNiche, setSelectedNiche] = useState("Semua");
    const [mimicVideo, setMimicVideo] = useState<TrendingVideo | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch(`${API}/trending`, { credentials: "include" });
            const json = await res.json();
            if (json.success) setVideos(json.data);
        } catch (e) {
            console.error(e);
        } finally { setLoading(false); }
    };

    const toggleBookmark = async (video: TrendingVideo) => {
        setTogglingId(video.id);
        try {
            const res = await fetch(`${API}/trending/${video.id}/bookmark`, { method: "POST", credentials: "include" });
            const json = await res.json();
            if (json.success) {
                setVideos((prev) => prev.map((v) => v.id === video.id ? { ...v, isBookmarked: json.bookmarked } : v));
            }
        } catch (e) { console.error(e); }
        finally { setTogglingId(null); }
    };

    const filtered = selectedNiche === "Semua" ? videos : videos.filter((v) => v.niche === selectedNiche);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ padding: "32px 32px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", marginBottom: "4px" }}>🔥 Trend Explorer</h1>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Video tren terkurasi. Pilih formula, masukkan topikmu, generate script instan.</p>
                    </div>
                    <div style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                        {filtered.length} tren aktif
                    </div>
                </div>

                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {NICHES.map((niche) => (
                        <button key={niche} onClick={() => setSelectedNiche(niche)}
                            style={{ flexShrink: 0, padding: "6px 14px", border: `1.5px solid ${selectedNiche === niche ? "var(--text-primary)" : "var(--border)"}`, borderRadius: "999px", background: selectedNiche === niche ? "var(--text-primary)" : "var(--bg-primary)", color: selectedNiche === niche ? "var(--bg-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "12px", fontWeight: selectedNiche === niche ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                            {niche}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px", gap: "12px", color: "var(--text-muted)" }}>
                        <Spinner size={24} />
                        <span style={{ fontSize: "14px" }}>Memuat tren terbaru...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔍</div>
                        <p style={{ fontSize: "14px" }}>Tidak ada video tren untuk niche ini.</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                        {filtered.map((video) => (
                            <div key={video.id} style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", background: "var(--bg-primary)", animation: "fadeUp 0.3s ease" }}>
                                <div style={{ height: "6px", background: `linear-gradient(135deg, ${video.gradientFrom}, ${video.gradientTo})` }} />
                                <div style={{ padding: "18px 20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                                        <div style={{ flex: 1, marginRight: "10px" }}>
                                            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.5px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>{video.niche}</div>
                                            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3 }}>{video.title}</div>
                                        </div>
                                        <button onClick={() => toggleBookmark(video)} disabled={togglingId === video.id}
                                            style={{ flexShrink: 0, background: "none", border: "1px solid var(--border)", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px", opacity: togglingId === video.id ? 0.5 : 1 }}>
                                            {video.isBookmarked ? "🔖" : "📌"}
                                        </button>
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                        <span style={{ padding: "3px 8px", background: video.viralScore >= 95 ? "#ef444415" : video.viralScore >= 90 ? "#f97316 15" : "#6366f115", border: `1px solid ${video.viralScore >= 95 ? "#ef444440" : video.viralScore >= 90 ? "#f9731640" : "#6366f140"}`, borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: video.viralScore >= 95 ? "#ef4444" : video.viralScore >= 90 ? "#f97316" : "#6366f1" }}>
                                            🔥 {video.viralScore}/100
                                        </span>
                                        <span style={{ padding: "3px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                                            👁 {video.views}
                                        </span>
                                    </div>

                                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {video.hookHighlight}
                                    </div>

                                    <button onClick={() => setMimicVideo(video)}
                                        style={{ width: "100%", padding: "10px", background: "var(--text-primary)", color: "var(--bg-primary)", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s" }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                                        ✨ Tiru Formula Ini
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {mimicVideo && <MimicModal video={mimicVideo} onClose={() => setMimicVideo(null)} />}
        </div>
    );
}
