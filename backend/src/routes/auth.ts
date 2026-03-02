import { Router, Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma";

const router = Router();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/api/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value || "";
                const avatar = profile.photos?.[0]?.value || "";
                const user = await prisma.user.upsert({
                    where: { googleId: profile.id },
                    update: { name: profile.displayName, avatar, email },
                    create: { googleId: profile.id, email, name: profile.displayName, avatar },
                });
                return done(null, user);
            } catch (err) {
                return done(err as Error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5000"}/login?error=auth_failed` }),
    (_req: Request, res: Response) => {
        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5000"}/atm`);
    }
);

router.get("/auth/me", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        return res.json({ success: true, data: req.user });
    }
    return res.status(401).json({ error: "Not authenticated" });
});

router.post("/auth/logout", (req: Request, res: Response) => {
    req.logout(() => {
        res.json({ success: true });
    });
});

export default router;
