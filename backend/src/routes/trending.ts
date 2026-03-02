import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { isAuthenticated } from "../middleware/auth";
import { generateTrendingScript } from "../services/gemini";

const router = Router();

router.get("/trending", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { niche } = req.query;
        const userId = (req.user as any)?.id;

        const videos = await prisma.trendingVideo.findMany({
            where: { isActive: true, ...(niche ? { niche: niche as string } : {}) },
            orderBy: { viralScore: "desc" },
        });

        const bookmarks = userId
            ? await prisma.trendingBookmark.findMany({ where: { userId }, select: { trendingVideoId: true } })
            : [];
        const bookmarkedIds = new Set(bookmarks.map((b) => b.trendingVideoId));

        return res.json({
            success: true,
            data: videos.map((v) => ({ ...v, isBookmarked: bookmarkedIds.has(v.id) })),
        });
    } catch (error) {
        console.error("Get trending error:", error);
        return res.status(500).json({ error: "Failed to fetch trending videos" });
    }
});

router.get("/trending/niches", async (_req: Request, res: Response) => {
    try {
        const niches = await prisma.trendingVideo.findMany({
            where: { isActive: true },
            select: { niche: true },
            distinct: ["niche"],
        });
        return res.json({ success: true, data: niches.map((n) => n.niche) });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch niches" });
    }
});

router.post("/trending/:id/bookmark", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const trendingVideoId = req.params.id as string;

        const existing = await prisma.trendingBookmark.findUnique({
            where: { userId_trendingVideoId: { userId, trendingVideoId } },
        });

        if (existing) {
            await prisma.trendingBookmark.delete({ where: { id: existing.id } });
            return res.json({ success: true, bookmarked: false });
        }
        await prisma.trendingBookmark.create({ data: { userId, trendingVideoId } });
        return res.json({ success: true, bookmarked: true });
    } catch (error) {
        console.error("Bookmark error:", error);
        return res.status(500).json({ error: "Failed to toggle bookmark" });
    }
});

router.post("/trending/:id/generate-script", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const { topic, tones, tone } = req.body as { topic?: string | null; tones?: string[]; tone?: string };

        const video = await prisma.trendingVideo.findUnique({
            where: { id: req.params.id as string },
            select: { analysisData: true, title: true, niche: true },
        });
        if (!video) return res.status(404).json({ error: "Trending video not found" });

        const resolvedTones = tones && tones.length > 0 ? tones : (tone ? [tone] : ["Seru"]);

        const scripts = await generateTrendingScript(
            video.analysisData as any,
            video.title,
            video.niche,
            topic?.trim() || null,
            resolvedTones
        );

        return res.json({ success: true, data: scripts });
    } catch (error) {
        console.error("Generate trending script error:", error);
        return res.status(500).json({
            error: "Gagal generate script. AI mungkin sedang sibuk, coba lagi.",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;
