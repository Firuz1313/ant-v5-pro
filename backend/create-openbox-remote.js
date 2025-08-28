import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

// Получение текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загрузка переменных окружения
dotenv.config({ path: join(__dirname, ".env") });

// Подключение к базе данных
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

/**
 * Создать дефолтный пульт для OpenBox
 */
async function createOpenBoxRemote() {
  const client = await pool.connect();
  
  try {
    console.log("🔧 Создание дефолтного пульта для OpenBox...");

    // Проверим, есть ли уже пульт для openbox
    const existingQuery = `
      SELECT id FROM remotes 
      WHERE device_id = 'openbox' AND is_active = true
    `;
    const existingResult = await client.query(existingQuery);
    
    if (existingResult.rows.length > 0) {
      console.log("✅ Пульт для OpenBox уже существует:", existingResult.rows[0].id);
      return;
    }

    // Создаем дефолтный пульт для OpenBox
    const remoteId = uuidv4();
    const now = new Date().toISOString();

    const insertQuery = `
      INSERT INTO remotes (
        id,
        device_id,
        name,
        manufacturer,
        model,
        description,
        layout,
        color_scheme,
        dimensions,
        buttons,
        zones,
        is_default,
        is_active,
        usage_count,
        metadata,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;

    const values = [
      remoteId,
      'openbox',
      'OpenBox Universal Remote',
      'OpenBox',
      'OB-UR-2025',
      'Универсальный пульт дистанционного управления для приставок OpenBox. Поддерживает все стандартные функции управления.',
      'standard',
      'dark',
      JSON.stringify({ width: 220, height: 580 }),
      JSON.stringify([]),
      JSON.stringify([]),
      true,
      true,
      0,
      JSON.stringify({}),
      now,
      now
    ];

    await client.query(insertQuery, values);

    console.log("✅ Дефолтный пульт для OpenBox создан успешно!");
    console.log("📱 Remote ID:", remoteId);
    console.log("🎮 Device ID: openbox");
    console.log("📋 Name: OpenBox Universal Remote");

  } catch (error) {
    console.error("❌ Ошибка при создании пульта для OpenBox:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Главная функция
 */
async function main() {
  try {
    await createOpenBoxRemote();
    console.log("\n🎉 Скрипт завершен успешно!");
  } catch (error) {
    console.error("\n💥 Ошибка выполнения скрипта:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Запуск скрипта
main();
