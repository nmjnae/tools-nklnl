import { Router, Request, Response } from "express";
import fs from "fs";
import { upload } from "../middleware/upload";
import { analyzeVideo, generateContentScripts } from "../services/gemini";
import { prisma } from "../lib/prisma";
import { isAuthenticated } from "../middleware/auth";

const router = Router();

router.post("/analyze", isAuthenticated, upload.single("video"), async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No video file uploaded" });
    const filePath = req.file.path;
    const userId = (req.user as any)?.id;

    try {
        const { analysis, flowText, flowJson } = await analyzeVideo(filePath, req.file.mimetype);

        const savedAnalysis = await prisma.videoAnalysis.create({
            data: {
                userId,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                title: analysis.title,
                summary: analysis.summary,
                analysis: analysis as object,
                flowText,
                flowJson: flowJson as object,
                tags: analysis.tags || [],
            },
        });

        fs.unlinkSync(filePath);
        return res.json({ success: true, data: savedAnalysis });
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error("Analysis error:", error);
        return res.status(500).json({
            error: "Gagal menganalisis video. Pastikan Gemini API key valid.",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

router.get("/analyses", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const analyses = await prisma.videoAnalysis.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true, originalName: true, title: true, summary: true,
                tags: true, fileSize: true, createdAt: true, isFavorite: true,
                notes: true, generatedScripts: true, scriptNiche: true,
            },
        });
        return res.json({ success: true, data: analyses });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch analyses" });
    }
});

router.get("/analyses/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const analysis = await prisma.videoAnalysis.findFirst({
            where: { id: req.params.id as string, userId },
        });
        if (!analysis) return res.status(404).json({ error: "Analysis not found" });
        return res.json({ success: true, data: analysis });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch analysis" });
    }
});

router.patch("/analyses/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { isFavorite, notes } = req.body;
        const analysis = await prisma.videoAnalysis.updateMany({
            where: { id: req.params.id as string, userId },
            data: {
                ...(isFavorite !== undefined ? { isFavorite } : {}),
                ...(notes !== undefined ? { notes } : {}),
            },
        });
        if (analysis.count === 0) return res.status(404).json({ error: "Analysis not found" });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to update analysis" });
    }
});

router.patch("/analyses/:id/scripts", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { scripts, niche } = req.body;
        await prisma.videoAnalysis.updateMany({
            where: { id: req.params.id as string, userId },
            data: { generatedScripts: scripts, scriptNiche: niche },
        });
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: "Failed to save scripts" });
    }
});

router.post("/analyses/:id/generate-scripts", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { niche } = req.body;
        if (!niche) return res.status(400).json({ error: "Niche is required" });

        const analysis = await prisma.videoAnalysis.findFirst({
            where: { id: req.params.id as string, userId },
        });
        if (!analysis) return res.status(404).json({ error: "Analysis not found" });

        const scripts = await generateContentScripts(analysis.analysis as any, niche);

        await prisma.videoAnalysis.update({
            where: { id: req.params.id as string },
            data: { generatedScripts: scripts as any, scriptNiche: niche },
        });

        return res.json({ success: true, data: scripts });
    } catch (error) {
        console.error("Generate scripts error:", error);
        return res.status(500).json({
            error: "Gagal generate script. AI mungkin sedang sibuk, coba lagi.",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

router.delete("/analyses/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        await prisma.videoAnalysis.deleteMany({ where: { id: req.params.id as string, userId } });
        return res.json({ success: true, message: "Analysis deleted" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete analysis" });
    }
});

export default router;
