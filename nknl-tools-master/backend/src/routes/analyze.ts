import { Router, Request, Response } from "express";
import fs from "fs";
import { upload } from "../middleware/upload";
import { analyzeVideo } from "../services/gemini";
import { prisma } from "../lib/prisma";

const router = Router();

// POST /api/analyze - Upload and analyze a video
router.post(
    "/analyze",
    upload.single("video"),
    async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ error: "No video file uploaded" });
        }

        const filePath = req.file.path;

        try {
            console.log(`Analyzing video: ${req.file.originalname}`);

            const { analysis, flowText, flowJson } = await analyzeVideo(
                filePath,
                req.file.mimetype
            );

            // Save to database
            const savedAnalysis = await prisma.videoAnalysis.create({
                data: {
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

            // Clean up uploaded file after analysis
            fs.unlinkSync(filePath);

            return res.json({
                success: true,
                data: savedAnalysis,
            });
        } catch (error) {
            // Clean up on error
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            console.error("Analysis error:", error);
            return res.status(500).json({
                error: "Gagal menganalisis video. Pastikan Gemini API key valid.",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
);

// GET /api/analyses - Get all analyses
router.get("/analyses", async (_req: Request, res: Response) => {
    try {
        const analyses = await prisma.videoAnalysis.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                originalName: true,
                title: true,
                summary: true,
                tags: true,
                fileSize: true,
                createdAt: true,
            },
        });
        return res.json({ success: true, data: analyses });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch analyses" });
    }
});

// GET /api/analyses/:id - Get single analysis
router.get("/analyses/:id", async (req: Request, res: Response) => {
    try {
        const analysis = await prisma.videoAnalysis.findUnique({
            where: { id: req.params.id as string },
        });
        if (!analysis) {
            return res.status(404).json({ error: "Analysis not found" });
        }
        return res.json({ success: true, data: analysis });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch analysis" });
    }
});

// DELETE /api/analyses/:id - Delete analysis
router.delete("/analyses/:id", async (req: Request, res: Response) => {
    try {
        await prisma.videoAnalysis.delete({
            where: { id: req.params.id as string },
        });
        return res.json({ success: true, message: "Analysis deleted" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete analysis" });
    }
});

export default router;
