import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
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

app.use("/api", router);

export default app;
