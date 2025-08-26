import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Загрузка переменных окружения
dotenv.config();

// ES Modules helper для __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Импорт главного роутера API
import apiRoutes from "./routes/index.js";

// Импорт middleware
import errorHandler from "./middleware/errorHandler.js";
import requestLogger from "./middleware/requestLogger.js";
import validateRequest from "./middleware/validateRequest.js";

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Trust proxy for production deployment (required for rate limiting with X-Forwarded-For)
if (NODE_ENV === "production" || process.env.FLY_APP_NAME) {
  // Trust first proxy (Fly.io) for accurate IP detection
  app.set("trust proxy", 1);
}

// Настройка CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:8080",
    ];

    // В облачной среде разрешаем все origins
    if (
      NODE_ENV === "development" ||
      !origin ||
      origin.includes("fly.dev") ||
      origin.includes("builder.codes") ||
      origin.includes("projects.builder.my") ||
      origin.includes("localhost") ||
      allowedOrigins.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));

// Безопасность
if (process.env.HELMET_ENABLED !== "false") {
  app.use(
    helmet({
      contentSecurityPolicy: false, // Отключаем для разработки
      crossOriginEmbedderPolicy: false,
    }),
  );
}

// Сжатие
if (process.env.COMPRESSION_ENABLED !== "false") {
  app.use(compression());
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 минут
  max:
    NODE_ENV === "development" || process.env.FLY_APP_NAME
      ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000 // 10000 запросов для разработки и облачных сред
      : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // 1000 для продакшена
  message: {
    error: "Слишком много запросов с этого IP, попробуйте позже.",
    retryAfter: Math.ceil(
      (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000,
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => {
    // Пропускаем rate limiting для локальных IP в разработке
    if (NODE_ENV === "development") {
      const ip = req.ip || req.connection.remoteAddress;
      if (ip === "127.0.0.1" || ip === "::1" || ip?.includes("localhost")) {
        return true;
      }
    }

    // Пропускаем rate limiting для облачных proxy IP
    if (process.env.FLY_APP_NAME || NODE_ENV === "development") {
      const clientIP =
        req.headers["fly-client-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.ip;
      console.log(
        `📊 Rate limit check - Client IP: ${clientIP}, Skipping: true`,
      );
      return true;
    }

    return false;
  },
});

app.use("/api/", limiter);

// Логирование
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Парсинг JSON и URL-encoded данных
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Статические файлы
app.use("/media", express.static(path.join(__dirname, "../uploads")));

// Кастомный middleware для логирования запросов
app.use(requestLogger);

// Дополнительное логирование для отладки
app.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`🔍 Headers:`, JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`🔍 Body:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API routes
app.use("/api", apiRoutes);

// 404 handler для API роутов
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint не най��ен",
    message: `Маршрут ${req.method} ${req.path} не существует`,
    availableEndpoints: "/api/v1",
  });
});

// Обработка ошибок
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📄 Получен сигнал SIGTERM. Изящное завершение работы...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📄 Получен сигнал SIGINT. Изящное завершение работы...");
  process.exit(0);
});

// Функция инициализации сервер��
async function startServer() {
  try {
    // Исправляем схему diagnostic_steps и tv_interfaces при старте
    const { fixDiagnosticStepsSchema, fixTVInterfacesSchema } = await import(
      "./utils/database.js"
    );
    await fixDiagnosticStepsSchema();
    await fixTVInterfacesSchema();
  } catch (error) {
    console.error(
      "⚠️ Ошибка исправления схемы, продолжаем запуск:",
      error.message,
    );
  }

  // Запуск сервера
  app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 ANT Support API Server started successfully!");
    console.log(`📍 Server running on 0.0.0.0:${PORT}`);
    console.log(`🌐 API available at: http://0.0.0.0:${PORT}/api/v1`);
    console.log(`🌐 API also available at: http://127.0.0.1:${PORT}/api/v1`);
    console.log(`🏥 Health check: http://127.0.0.1:${PORT}/health`);
    console.log(`📝 Environment: ${NODE_ENV}`);

    if (NODE_ENV === "development") {
      console.log(
        "🔧 Development mode - CORS enabled for localhost and cloud environments",
      );
      console.log("📁 Static files served from: /media");
      console.log(
        "🔄 Vite proxy should forward /api/* requests from port 8080 to port 3000",
      );
    }
  });
}

// Запуск сервера
startServer();

export default app;
