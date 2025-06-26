import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "../db/client";
import { newUser, User, Users } from "../db/schema";
import { eq } from "drizzle-orm";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let [user] = await db
          .select()
          .from(Users)
          .where(eq(Users.email, profile.emails?.[0]?.value || ""));
        if (user) return done(null, user);
        if (!user) {
          const newUser: newUser = {
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName || "",
            provider: "google",
            role: "attendee",
          };
          [user] = await db.insert(Users).values(newUser).returning();
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj as any);
});
