import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Modules helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка переменных окружения
dotenv.config();

const { Pool, Client } = pkg;

// PostgreSQL connection configuration

// Конфигурация подключения к PostgreSQL
let dbConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL if provided (Neon/Heroku style)
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : false,

    // Настройки pool соединений
    max: 20, // максимал����ное количество соединений в pool
    min: 2, // минимальное количество соединений
    idleTimeoutMillis: 30000, // время простоя перед закрытием ���оединения
    connectionTimeoutMillis: 10000, // таймаут подключения
    maxUses: 7500, // максимальное количество использований соединения
  };
} else {
  // Fallback to individual env vars
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "ant_support",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,

    // Настройки pool соединений
    max: 20, // максимальное количество соединений в pool
    min: 5, // минимальное количество соединений
    idleTimeoutMillis: 30000, // время простоя перед закрытием соединения
    connectionTimeoutMillis: 5000, // таймаут подключения
    maxUses: 7500, // максимальное количес��в�� использований соединения
  };
}

// Создание pool соединений
const pool = new Pool(dbConfig);

// Обработка событий pool
pool.on("connect", (client) => {
  console.log("📊 Новое подключение к PostgreSQL установлено");
});

pool.on("error", (err, client) => {
  console.error("📊 Ошибка подключения к PostgreSQL:", err.message);
});

pool.on("acquire", (client) => {
  if (process.env.DEBUG_SQL === "true") {
    console.log("📊 Клиент получен из pool");
  }
});

pool.on("release", (client) => {
  if (process.env.DEBUG_SQL === "true") {
    console.log("📊 Клиент возвращен в pool");
  }
});

// PostgreSQL only configuration

// Функция проверки подключения к базе данных
export async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      "SELECT NOW() as current_time, version() as postgres_version",
    );

    console.log("✅ Подключение к PostgreSQL успешно");
    console.log(`🕐 Время сервера: ${result.rows[0].current_time}`);
    console.log(
      `📋 Версия PostgreSQL: ${result.rows[0].postgres_version.split(" ")[0]}`,
    );

    return {
      success: true,
      serverTime: result.rows[0].current_time,
      version: result.rows[0].postgres_version,
    };
  } catch (error) {
    console.error("❌ Ошибка подключ��ния к PostgreSQL:", error.message);

    // PostgreSQL connection failed
    console.error("❌ Failed to connect to PostgreSQL database");

    return {
      success: false,
      error: error.message,
    };
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Функция выполнения запрос�� с логированием
export async function query(text, params = []) {
  const start = Date.now();
  let client;

  try {
    client = await pool.connect();

    if (process.env.DEBUG_SQL === "true") {
      console.log("🔍 SQL Query:", text);
      console.log("🔍 Parameters:", params);
    }

    const result = await client.query(text, params);
    const duration = Date.now() - start;

    if (process.env.DEBUG_SQL === "true") {
      console.log(`⏱️  Query completed in ${duration}ms`);
      console.log(`📊 Rows affected: ${result.rowCount}`);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ SQL Error after ${duration}ms:`, error.message);
    console.error("🔍 Query:", text);
    console.error("🔍 Parameters:", params);

    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Функция выполнения транзакции
export async function transaction(callback) {
  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    try {
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Функция создания базы данных (если не существует)
export async function createDatabase() {
  const adminConfig = {
    ...dbConfig,
    database: "postgres", // подключаемся к системной БД для создания новой
  };

  let client;

  try {
    client = new Client(adminConfig);
    await client.connect();

    // Проверяем, существует ли база данных
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database],
    );

    if (checkResult.rows.length === 0) {
      console.log(`📊 Создание базы данных: ${dbConfig.database}`);
      await client.query(`CREATE DATABASE "${dbConfig.database}"`);
      console.log("��� База данных создана ��спешно");
    } else {
      console.log(`📊 База данных ${dbConfig.database} уже существует`);
    }
  } catch (error) {
    console.error("❌ Ошибка создания базы данных:", error.message);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// Функция выполнения миграций
export async function runMigrations() {
  try {
    console.log("🔄 Запуск миграций базы данных...");

    // Создаем таблицу для отслеживания миграций
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Получаем список выполненных миграций
    const executedResult = await query(
      "SELECT filename FROM migrations ORDER BY id",
    );
    const executedMigrations = new Set(
      executedResult.rows.map((row) => row.filename),
    );

    // Читаем файлы миграций
    const migrationsDir = path.join(__dirname, "../../migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    console.log(`📁 Найдено ${migrationFiles.length} файлов миграций`);

    for (const filename of migrationFiles) {
      if (executedMigrations.has(filename)) {
        console.log(`⏭️  Миграция ${filename} уже выполне��а, пропускае��`);
        continue;
      }

      console.log(`🔄 Выполнение миграции: ${filename}`);

      const migrationPath = path.join(migrationsDir, filename);
      const migrationSQL = fs.readFileSync(migrationPath, "utf8");

      await transaction(async (client) => {
        // Выполняем миграцию
        await client.query(migrationSQL);

        // Записываем в таблицу миграций
        await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
          filename,
        ]);
      });

      console.log(`✅ Миграция ${filename} выполнена успешно`);
    }

    console.log("🎉 Все миграции выполнены успешно");
  } catch (error) {
    console.error("❌ Ошибка выполнения миграций:", error.message);
    throw error;
  }
}

// Функция исправления схемы diagnostic_steps
export async function fixDiagnosticStepsSchema() {
  try {
    console.log("🔧 Проверка и исправление схемы diagnostic_steps...");

    // Проверяем какие колонки существуют
    const columnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'diagnostic_steps'
      AND column_name IN (
        'device_id', 'instruction', 'instruction_text', 'tv_interface',
        'validation_rules', 'success_condition', 'failure_actions',
        'warning_text', 'success_text', 'media', 'next_step_conditions', 'hint', 'button_position'
      );
    `;

    const existingColumns = await query(columnsQuery);
    const columnNames = existingColumns.rows.map((row) => row.column_name);

    const hasDeviceId = columnNames.includes("device_id");
    const hasInstruction = columnNames.includes("instruction");
    const hasInstructionText = columnNames.includes("instruction_text");
    const hasTvInterface = columnNames.includes("tv_interface");
    const hasValidationRules = columnNames.includes("validation_rules");
    const hasSuccessCondition = columnNames.includes("success_condition");
    const hasFailureActions = columnNames.includes("failure_actions");
    const hasWarningText = columnNames.includes("warning_text");
    const hasSuccessText = columnNames.includes("success_text");
    const hasMedia = columnNames.includes("media");
    const hasNextStepConditions = columnNames.includes("next_step_conditions");
    const hasHint = columnNames.includes("hint");
    const hasButtonPosition = columnNames.includes("button_position");

    // Добавляем недостающую колонку device_id
    if (!hasDeviceId) {
      console.log("⚠️  device_id column missing, adding it...");

      // First, add the column as nullable
      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN device_id VARCHAR(255) REFERENCES devices(id) ON DELETE CASCADE
      `);

      // Update existing records to set device_id from their associated problem
      await query(`
        UPDATE diagnostic_steps
        SET device_id = p.device_id
        FROM problems p
        WHERE diagnostic_steps.problem_id = p.id AND diagnostic_steps.device_id IS NULL
      `);

      // Now make it NOT NULL
      await query(`
        ALTER TABLE diagnostic_steps
        ALTER COLUMN device_id SET NOT NULL
      `);

      console.log("✅ Добавлена колонка device_id");
    } else {
      console.log("✅ Колонка device_id уже существует");
    }

    // Fix instruction column name mismatch
    if (hasInstructionText && !hasInstruction) {
      console.log(
        "⚠️  Found instruction_text column, renaming to instruction...",
      );

      await query(`
        ALTER TABLE diagnostic_steps
        RENAME COLUMN instruction_text TO instruction
      `);

      console.log("✅ Переименована колонка instruction_text в instruction");
    } else if (!hasInstruction && !hasInstructionText) {
      console.log("⚠️  instruction column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN instruction TEXT NOT NULL DEFAULT ''
      `);

      console.log("✅ Добавлена колонка instruction");
    } else {
      console.log("✅ Колонка instruction уже существует");
    }

    // Add missing tv_interface column
    if (!hasTvInterface) {
      console.log("⚠️  tv_interface column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN tv_interface VARCHAR(255)
      `);

      console.log("✅ Добавлена колонка tv_interface");
    } else {
      console.log("✅ Колонка tv_interface уже существует");
    }

    // Add missing validation_rules column
    if (!hasValidationRules) {
      console.log("⚠️  validation_rules column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN validation_rules JSONB DEFAULT '[]'::jsonb
      `);

      console.log("✅ Добавлена колонка validation_rules");
    } else {
      console.log("✅ Колонка validation_rules уже существует");
    }

    // Add missing success_condition column
    if (!hasSuccessCondition) {
      console.log("⚠️  success_condition column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN success_condition VARCHAR(500)
      `);

      console.log("✅ Добавлена колонка success_condition");
    } else {
      console.log("✅ Колонка success_condition уже существует");
    }

    // Add missing failure_actions column
    if (!hasFailureActions) {
      console.log("⚠️  failure_actions column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN failure_actions JSONB DEFAULT '[]'::jsonb
      `);

      console.log("✅ Добавлена колонка failure_actions");
    } else {
      console.log("✅ Колонка failure_actions уже существует");
    }

    // Add missing warning_text column
    if (!hasWarningText) {
      console.log("⚠️  warning_text column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN warning_text TEXT
      `);

      console.log("✅ Добавлена колонка warning_text");
    } else {
      console.log("✅ Колонка warning_text уже существует");
    }

    // Add missing success_text column
    if (!hasSuccessText) {
      console.log("⚠️  success_text column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN success_text TEXT
      `);

      console.log("✅ Добавлена колонка success_text");
    } else {
      console.log("✅ Колонка success_text уже существует");
    }

    // Add missing media column
    if (!hasMedia) {
      console.log("⚠️  media column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN media JSONB DEFAULT '[]'::jsonb
      `);

      console.log("✅ Добавлена колонка media");
    } else {
      console.log("✅ Колонка media уже существует");
    }

    // Add missing next_step_conditions column
    if (!hasNextStepConditions) {
      console.log("⚠️  next_step_conditions column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN next_step_conditions JSONB DEFAULT '[]'::jsonb
      `);

      console.log("✅ Добавлена колонка next_step_conditions");
    } else {
      console.log("✅ Колонка next_step_conditions уже существует");
    }

    // Add missing hint column
    if (!hasHint) {
      console.log("⚠️  hint column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN hint TEXT
      `);

      console.log("✅ Добавлена колонка hint");
    } else {
      console.log("✅ Колонка hint уже существует");
    }

    // Add missing button_position column
    if (!hasButtonPosition) {
      console.log("⚠️  button_position column missing, adding it...");

      await query(`
        ALTER TABLE diagnostic_steps
        ADD COLUMN button_position JSONB
      `);

      console.log("✅ Добавлена колонка button_position");
    } else {
      console.log("✅ Колонка button_position уже существует");
    }

    console.log("🎉 Схема diagnostic_steps исправлена");
    return true;
  } catch (error) {
    console.error(
      "❌ Ошибка исправления схемы diagnostic_steps:",
      error.message,
    );
    throw error;
  }
}

// Функция исправления схемы tv_interfaces
export async function fixTVInterfacesSchema() {
  try {
    console.log("🔧 Проверка и исправление схемы tv_interfaces...");

    // Проверяем какие колонки существуют
    const columnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'tv_interfaces' AND column_name IN ('clickable_areas', 'highlight_areas');
    `;

    const existingColumns = await query(columnsQuery);
    const hasClickableAreas = existingColumns.rows.some(
      (row) => row.column_name === "clickable_areas",
    );
    const hasHighlightAreas = existingColumns.rows.some(
      (row) => row.column_name === "highlight_areas",
    );

    // Добавляем недостающие колонки
    if (!hasClickableAreas) {
      await query(`
        ALTER TABLE tv_interfaces
        ADD COLUMN clickable_areas JSONB NOT NULL DEFAULT '[]'::jsonb
      `);
      console.log("✅ Добавлена колонка clickable_areas");
    }

    if (!hasHighlightAreas) {
      await query(`
        ALTER TABLE tv_interfaces
        ADD COLUMN highlight_areas JSONB NOT NULL DEFAULT '[]'::jsonb
      `);
      console.log("✅ Добавлена колонка highlight_areas");
    }

    if (hasClickableAreas && hasHighlightAreas) {
      console.log("✅ Все необходимые колонки уже существуют");
    }

    console.log("🎉 Схема tv_interfaces исправлена");
    return true;
  } catch (error) {
    console.error("❌ Ошибка исправления схемы tv_interfaces:", error.message);
    throw error;
  }
}

// Функция получения статистики базы данных
export async function getDatabaseStats() {
  try {
    const stats = await query(`
      SELECT
        schemaname,
        relname as table_name,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_live_tup as row_count,
        n_dead_tup as dead_rows
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC
    `);

    const dbSize = await query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);

    return {
      tables: stats.rows,
      databaseSize: dbSize.rows[0].size,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Ошибка получения статистики БД:", error.message);
    throw error;
  }
}

// Функци�� безопасного закрытия всех соединений
export async function closePool() {
  try {
    console.log("🔄 Закрытие пула соединений PostgreSQL...");
    await pool.end();
    console.log("✅ Пул со��динений закрыт");
  } catch (error) {
    console.error("❌ Ошибка закрытия п��ла:", error.message);
  }
}

// Функция очистки старых данных (maintenance)
export async function cleanupOldData(daysToKeep = 90) {
  try {
    console.log(`🧹 Очистка данных старше ${daysToKeep} дней...`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    // Удаляем старые сессии
    const sessionsResult = await query(
      `
      DELETE FROM diagnostic_sessions 
      WHERE start_time < $1 AND end_time IS NOT NULL
    `,
      [cutoffDate],
    );

    // Удаляем старые логи изменений
    const logsResult = await query(
      `
      DELETE FROM change_logs 
      WHERE created_at < $1
    `,
      [cutoffDate],
    );

    console.log(`✅ Удалено сессий: ${sessionsResult.rowCount}`);
    console.log(`✅ Удалено логов: ${logsResult.rowCount}`);

    // О��новляем статистику
    await query("ANALYZE");

    return {
      deletedSessions: sessionsResult.rowCount,
      deletedLogs: logsResult.rowCount,
    };
  } catch (error) {
    console.error("❌ Ошибка очис��ки данных:", error.message);
    throw error;
  }
}

// Функция для полнотекстового поиска
export async function searchText(
  searchTerm,
  tables = ["problems", "devices", "diagnostic_steps"],
) {
  try {
    const searchResults = {};

    for (const table of tables) {
      let searchQuery;

      switch (table) {
        case "problems":
          searchQuery = `
            SELECT id, title, description, 
                   ts_rank(to_tsvector('russian', title || ' ' || COALESCE(description, '')), plainto_tsquery('russian', $1)) as rank
            FROM problems 
            WHERE to_tsvector('russian', title || ' ' || COALESCE(description, '')) @@ plainto_tsquery('russian', $1)
            AND is_active = true
            ORDER BY rank DESC
            LIMIT 20
          `;
          break;

        case "devices":
          searchQuery = `
            SELECT id, name, brand, model, description,
                   ts_rank(to_tsvector('russian', name || ' ' || brand || ' ' || COALESCE(description, '')), plainto_tsquery('russian', $1)) as rank
            FROM devices
            WHERE to_tsvector('russian', name || ' ' || brand || ' ' || COALESCE(description, '')) @@ plainto_tsquery('russian', $1)
            AND is_active = true
            ORDER BY rank DESC
            LIMIT 20
          `;
          break;

        case "diagnostic_steps":
          searchQuery = `
            SELECT id, title, description, instruction,
                   ts_rank(to_tsvector('russian', title || ' ' || COALESCE(description, '') || ' ' || instruction), plainto_tsquery('russian', $1)) as rank
            FROM diagnostic_steps
            WHERE to_tsvector('russian', title || ' ' || COALESCE(description, '') || ' ' || instruction) @@ plainto_tsquery('russian', $1)
            AND is_active = true
            ORDER BY rank DESC
            LIMIT 20
          `;
          break;
      }

      if (searchQuery) {
        const result = await query(searchQuery, [searchTerm]);
        searchResults[table] = result.rows;
      }
    }

    return searchResults;
  } catch (error) {
    console.error("❌ Ошибка полнотекстового пои��ка:", error.message);
    throw error;
  }
}

// Экспорт pool для прямого использования в с����чае необходимости
export { pool };

export default {
  query,
  transaction,
  testConnection,
  createDatabase,
  runMigrations,
  getDatabaseStats,
  closePool,
  cleanupOldData,
  searchText,
  pool,
};
