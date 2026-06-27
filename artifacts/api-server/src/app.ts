import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { buildSessionMiddleware, loadUser } from "./lib/auth";

const app: Express = express();

app.set("trust proxy", 1);

// Replit always terminates TLS at the proxy level — force HTTPS detection
// so that express-session sets the Secure cookie flag correctly.
app.use((req, _res, next) => {
  req.headers["x-forwarded-proto"] = "https";
  next();
});

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(buildSessionMiddleware());
app.use(loadUser);

const uploadsDir = process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/api/uploads", express.static(uploadsDir, { maxAge: "1d" }));

app.use("/api", router);

// In production: serve the built frontend from STATIC_DIR
if (process.env.NODE_ENV === "production") {
  const staticDir = process.env.STATIC_DIR ?? path.join(process.cwd(), "public");
  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir, { maxAge: "7d", index: "index.html" }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  }
}

export default app;
