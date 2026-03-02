"use client";

import { useState, useEffect } from "react";

interface AnalysisSummary {
    id: string; originalName: string; title: string; summary: string;
    tags: string[]; fileSize: number; createdAt: string;
    isFavorite: boolean; notes: string | null;
    generatedScripts: any[] | null; scriptNiche: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

function Spinner({ size = 18 }: { size?: number }) {
    return <div style={{ width: size, height: size, border: "2px solid var(--border)", borderTop: "2px solid var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function LibraryPage() {
    const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "favorites">("all");
    const [editingNotes, setEditingNotes] = useState<string | null>(null);
    const [notesDraft, setNotesDraft] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => { fetchAnalyses(); }, []);

    const fetchAnalyses = async () => {
        try {
            const res = await fetch(`${API}/analyses`, { credentials: "include" });
            const json = await res.json();
            if (json.success) setAnalyses(json.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const toggleFavorite = async (id: string, current: boolean) => {
        try {
            await fetch(`${API}/analyses/${id}`, {
                method: "PATCH", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFavorite: !current }),
            });
            setAnalyses((prev) => prev.map((a) => a.id === id ? { ...a, isFavorite: !current } : a));
        } catch (e) { console.error(e); }
    };

    const saveNotes = async (id: string) => {
        setSavingNotes(true);
        try {
            await fetch(`${API}/analyses/${id}`, {
                method: "PATCH", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes: notesDraft }),
            });
            setAnalyses((prev) => prev.map((a) => a.id === id ? { ...a, notes: notesDraft } : a));
            setEditingNotes(null);
        } catch (e) { console.error(e); }
        finally { setSavingNotes(false); }
    };

    const deleteAnalysis = async (id: string) => {
        if (!confirm("Hapus analisis ini? Tidak bisa dikembalikan.")) return;
        setDeletingId(id);
        try {
            await fetch(`${API}/analyses/${id}`, { method: "DELETE", credentials: "include" });
            setAnalyses((prev) => prev.filter((a) => a.id !== id));
        } catch (e) { console.error(e); }
        finally { setDeletingId(null); }
    };

    const displayed = filter === "favorites" ? analyses.filter((a) => a.isFavorite) : analyses;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <div style={{ padding: "32px 32px 20px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.8px", color: "var(--text-primary)", marginBottom: "4px" }}>📚 My Library</h1>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Semua analisis video viralmu. Kelola, tandai favorit, dan tambahkan catatan.</p>
                    </div>
                    <div style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                        {analyses.length} analisis
                    </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                    {[{ key: "all", label: "Semua" }, { key: "favorites", label: "⭐ Favorit" }].map((f) => (
                        <button key={f.key} onClick={() => setFilter(f.key as any)}
                            style={{ padding: "6px 14px", border: `1.5px solid ${filter === f.key ? "var(--text-primary)" : "var(--border)"}`, borderRadius: "999px", background: filter === f.key ? "var(--text-primary)" : "var(--bg-primary)", color: filter === f.key ? "var(--bg-primary)" : "var(--text-secondary)", cursor: "pointer", fontSize: "12px", fontWeight: filter === f.key ? 700 : 500, fontFamily: "inherit", transition: "all 0.15s" }}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "24px 32px" }}>
                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px", gap: "12px", color: "var(--text-muted)" }}>
                        <Spinner size={24} />
                        <span style={{ fontSize: "14px" }}>Memuat library...</span>
                    </div>
                ) : displayed.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                        <div style={{ fontSize: "40px", marginBottom: "16px" }}>{filter === "favorites" ? "⭐" : "📭"}</div>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                            {filter === "favorites" ? "Belum ada favorit" : "Library masih kosong"}
                        </h3>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                            {filter === "favorites" ? "Tandai analisis sebagai favorit untuk melihatnya di sini." : "Analisis video viralmu pertama dari menu ATM Video."}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {displayed.map((a) => (
                            <div key={a.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-primary)", overflow: "hidden", animation: "fadeUp 0.3s ease" }}>
                                <div style={{ padding: "18px 20px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {a.title || a.originalName}
                                            </div>
                                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                                {a.originalName} · {formatBytes(a.fileSize)} · {formatDate(a.createdAt)}
                                                {a.scriptNiche && <span style={{ marginLeft: "8px", padding: "2px 6px", background: "#6366f115", border: "1px solid #6366f130", borderRadius: "4px", color: "#6366f1", fontSize: "10px", fontWeight: 700 }}>ATM: {a.scriptNiche}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                                            <button onClick={() => toggleFavorite(a.id, a.isFavorite)}
                                                style={{ background: "none", border: "1px solid var(--border)", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {a.isFavorite ? "⭐" : "☆"}
                                            </button>
                                            <button onClick={() => deleteAnalysis(a.id)} disabled={deletingId === a.id}
                                                style={{ background: "none", border: "1px solid var(--border)", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", opacity: deletingId === a.id ? 0.5 : 1, color: "var(--text-muted)" }}>
                                                {deletingId === a.id ? <Spinner size={14} /> : "🗑"}
                                            </button>
                                        </div>
                                    </div>

                                    {a.summary && <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.summary}</p>}

                                    {a.tags && a.tags.length > 0 && (
                                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                                            {a.tags.slice(0, 5).map((tag) => (
                                                <span key={tag} style={{ padding: "2px 8px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    {editingNotes === a.id ? (
                                        <div style={{ marginTop: "10px" }}>
                                            <textarea
                                                value={notesDraft}
                                                onChange={(e) => setNotesDraft(e.target.value)}
                                                placeholder="Tambahkan catatan..."
                                                rows={3}
                                                style={{ width: "100%", padding: "10px 12px", border: "1px solid #6366f1", borderRadius: "8px", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "13px", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                                            />
                                            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                                <button onClick={() => saveNotes(a.id)} disabled={savingNotes}
                                                    style={{ padding: "7px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "6px" }}>
                                                    {savingNotes ? <><Spinner size={12} /> Menyimpan...</> : "Simpan"}
                                                </button>
                                                <button onClick={() => setEditingNotes(null)}
                                                    style={{ padding: "7px 14px", background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                                    Batal
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => { setEditingNotes(a.id); setNotesDraft(a.notes || ""); }}
                                            style={{ fontSize: "12px", color: "var(--text-muted)", background: "none", border: "1px dashed var(--border)", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                                            {a.notes ? `📝 ${a.notes.slice(0, 60)}${a.notes.length > 60 ? "..." : ""}` : "+ Tambah catatan"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
