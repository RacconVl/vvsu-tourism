import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  RegisterBody,
  RegisterResponse,
  LoginBody,
  LoginResponse,
  GetMeResponse,
  LogoutResponse,
} from "@workspace/api-zod";
import { publicUser } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Проверьте email, имя и пароль (от 6 символов)" });
    return;
  }
  const email = parsed.data.email.toLowerCase().trim();
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length) {
    res.status(409).json({ error: "Аккаунт с таким email уже существует" });
    return;
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const [u] = await db.insert(usersTable).values({
    email,
    passwordHash,
    name: parsed.data.name,
    studentRole: parsed.data.studentRole ?? "guide",
    role: "student",
  }).returning();
  req.session.userId = u.id;
  req.session.save(() => {
    res.json(RegisterResponse.parse(publicUser(u)));
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Введите email и пароль" });
    return;
  }
  const email = parsed.data.email.toLowerCase().trim();
  const [u] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!u) {
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }
  const ok = await bcrypt.compare(parsed.data.password, u.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Неверный email или пароль" });
    return;
  }
  req.session.userId = u.id;
  req.session.save((err) => {
    if (err) {
      req.log.error({ err }, "session save failed (login)");
      res.status(500).json({ error: "Session error" });
      return;
    }
    res.json(LoginResponse.parse(publicUser(u)));
  });
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json(LogoutResponse.parse({ ok: true }));
  });
});

router.get("/auth/me", (req, res): void => {
  res.json(GetMeResponse.parse({ user: req.user ? publicUser(req.user) : null }));
});

export default router;
