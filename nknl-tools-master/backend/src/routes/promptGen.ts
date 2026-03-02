import { Router, Request, Response } from "express";
import fs from "fs";
import { uploadMedia } from "../middleware/upload";
import { generateVideoPrompt } from "../services/gemini";
import { prisma } from "../lib/prisma";

const router = Router();

// POST /api/generate-prompt — analyze image or video and return AI video prompts
router.post(
    "/generate-prompt",
    uploadMedia.single("media"),
    async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;
        const lang = (req.body.lang as "id" | "en") || "id";
        const format = (req.body.format as "text" | "json") || "text";

        try {
            console.log(`Generating prompt for: ${req.file.originalname} | lang=${lang} | format=${format}`);

            const result = await generateVideoPrompt(
                filePath,
                req.file.mimetype,
                lang,
                format
            );

            // Clean up file after processing
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

            const mediaType = req.file.mimetype.startsWith("image/") ? "image" : "video";

            // Save to database
            const saved = await prisma.promptGenHistory.create({
                data: {
                    originalName: req.file.originalname,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype,
                    mediaType,
                    lang,
                    format,
                    promptText: result.text,
                    promptJson: result.json ? (result.json as object) : undefined,
                },
            });

            return res.json({
                success: true,
                data: {
                    id: saved.id,
                    originalName: saved.originalName,
                    mimeType: saved.mimeType,
                    mediaType: saved.mediaType,
                    lang: saved.lang,
                    format: saved.format,
                    text: saved.promptText,
                    json: saved.promptJson,
                    createdAt: saved.createdAt,
                },
            });
        } catch (error) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            console.error("Prompt generation error:", error);
            return res.status(500).json({
                error: "Gagal membuat prompt. Pastikan Gemini API key valid.",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
);

// GET /api/prompt-history — list all prompt generation history
router.get("/prompt-history", async (_req: Request, res: Response) => {
    try {
        const history = await prisma.promptGenHistory.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                originalName: true,
                mimeType: true,
                mediaType: true,
                lang: true,
                format: true,
                fileSize: true,
                createdAt: true,
            },
        });
        return res.json({ success: true, data: history });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch history" });
    }
});

// GET /api/prompt-history/:id — get single prompt gen record
router.get("/prompt-history/:id", async (req: Request, res: Response) => {
    try {
        const record = await prisma.promptGenHistory.findUnique({
            where: { id: req.params.id as string },
        });
        if (!record) {
            return res.status(404).json({ error: "Not found" });
        }
        return res.json({
            success: true,
            data: {
                id: record.id,
                originalName: record.originalName,
                mimeType: record.mimeType,
                mediaType: record.mediaType,
                lang: record.lang,
                format: record.format,
                fileSize: record.fileSize,
                text: record.promptText,
                json: record.promptJson,
                createdAt: record.createdAt,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch record" });
    }
});

// DELETE /api/prompt-history/:id — delete a prompt gen record
router.delete("/prompt-history/:id", async (req: Request, res: Response) => {
    try {
        await prisma.promptGenHistory.delete({ where: { id: req.params.id as string } });
        return res.json({ success: true, message: "Deleted" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to delete record" });
    }
});

export default router;
