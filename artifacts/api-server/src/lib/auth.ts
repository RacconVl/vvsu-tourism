import type { RequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool, db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const PgStore = connectPgSimple(session);

export function buildSessionMiddleware(): RequestHandler {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  return session({
    store: new PgStore({ pool, createTableIfMissing: true, tableName: "user_sessions" }),
    secret,
    resave: false,
    saveUninitialized: false,
    name: "vvsu.sid",
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  });
}

export const loadUser: RequestHandler = async (req, _res, next) => {
  if (req.session.userId) {
    const [u] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId)).limit(1);
    if (u) req.user = u;
  }
  next();
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Требуется вход в личный кабинет" });
    return;
  }
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Требуется вход" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Доступ только для администратора" });
    return;
  }
  next();
};

export function publicUser(u: User) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    studentRole: u.studentRole,
    bio: u.bio,
    avatarUrl: u.avatarUrl,
    level: u.level,
    xp: u.xp,
  };
}

export function levelForXp(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number } {
  let level = 1;
  let needed = 200;
  let acc = 0;
  while (xp >= acc + needed) {
    acc += needed;
    level += 1;
    needed = Math.round(needed * 1.4);
  }
  return { level, currentLevelXp: xp - acc, nextLevelXp: needed };
}
