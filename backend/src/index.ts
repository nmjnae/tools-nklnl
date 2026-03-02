import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import analyzeRouter from "./routes/analyze";
import promptGenRouter from "./routes/promptGen";
import authRouter from "./routes/auth";
import trendingRouter from "./routes/trending";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5000",
    credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(session({
    secret: process.env.SESSION_SECRET || "mimicai-secret-key-dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRouter);
app.use("/api", analyzeRouter);
app.use("/api", promptGenRouter);
app.use("/api", trendingRouter);

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`🚀 ATM Backend server running on port ${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
});

export default app;
