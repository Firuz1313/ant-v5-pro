import database from "./database.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Загрузка переменных окружения
dotenv.config();

async function seedDatabase() {
  try {
    console.log("🌱 Запуск заполнения базы данных ANT Support");
    console.log("=============================================");

    // Проверяем подключение
    const connectionTest = await database.testConnection();
    if (!connectionTest.success) {
      console.error("❌ Не удалось подключиться к базе данных");
      process.exit(1);
    }

    console.log("✅ Подключение к базе данных успешно");

    // 1. Пропускаем создание пользователей (таблица имеет другую структуру)
    console.log("\n👤 Пропускаем создание пользователей (уже существуют)...");

    // 2. Создаем устройства
    console.log("📺 Создание устройств...");
    
    const devices = [
      {
        id: 'device-ant-basic',
        name: 'ANT Basic',
        brand: 'ANT',
        model: 'ANT-B100',
        description: 'Базовая модель цифровой ТВ-приставки ANT с поддержкой HD качества',
        color: 'from-blue-500 to-blue-600',
        order_index: 1
      },
      {
        id: 'device-ant-premium',
        name: 'ANT Premium',
        brand: 'ANT',
        model: 'ANT-P200',
        description: 'Премиум модель с поддержкой 4K и Smart TV функций',
        color: 'from-purple-500 to-purple-600',
        order_index: 2
      },
      {
        id: 'device-ant-pro',
        name: 'ANT Professional',
        brand: 'ANT',
        model: 'ANT-PR300',
        description: 'Профессиональная модель для коммерческого использования',
        color: 'from-green-500 to-green-600',
        order_index: 3
      },
      {
        id: 'device-generic-dvb',
        name: 'Generic DVB-T2',
        brand: 'Generic',
        model: 'DVB-T2-STD',
        description: 'Стандартная DVB-T2 приставка',
        color: 'from-gray-500 to-gray-600',
        order_index: 4
      }
    ];

    for (const device of devices) {
      await database.query(`
        INSERT INTO devices (id, name, brand, model, description, color, order_index, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          brand = EXCLUDED.brand,
          model = EXCLUDED.model,
          description = EXCLUDED.description,
          color = EXCLUDED.color,
          order_index = EXCLUDED.order_index
      `, [device.id, device.name, device.brand, device.model, device.description, device.color, device.order_index, 'active']);
    }

    // 3. Создаем типичные проблемы
    console.log("⚠️  Создание проблем...");
    
    const problems = [
      {
        id: 'problem-no-signal',
        device_id: 'device-ant-basic',
        title: 'Нет сигнала',
        description: 'На экране отображается сообщение "Нет сигнала" или черный экран',
        category: 'critical',
        icon: 'AlertTriangle',
        color: 'from-red-500 to-red-600',
        priority: 5,
        estimated_time: 10
      },
      {
        id: 'problem-poor-quality',
        device_id: 'device-ant-basic',
        title: 'Плохое качество изображения',
        description: 'Изображение нечеткое, есть помехи или артефакты',
        category: 'moderate',
        icon: 'Monitor',
        color: 'from-orange-500 to-orange-600',
        priority: 3,
        estimated_time: 8
      },
      {
        id: 'problem-no-sound',
        device_id: 'device-ant-basic',
        title: 'Нет з��ука',
        description: 'Изображение есть, но звук отсутствует',
        category: 'moderate',
        icon: 'VolumeX',
        color: 'from-yellow-500 to-yellow-600',
        priority: 3,
        estimated_time: 5
      },
      {
        id: 'problem-channels-missing',
        device_id: 'device-ant-basic',
        title: 'Не найдены каналы',
        description: 'Автопоиск не находит телеканалы или найдено слишком мало',
        category: 'moderate',
        icon: 'Search',
        color: 'from-blue-500 to-blue-600',
        priority: 4,
        estimated_time: 15
      },
      {
        id: 'problem-remote-not-working',
        device_id: 'device-ant-basic',
        title: 'Пульт не работает',
        description: 'Приставка не реагирует на команды пульта дистанционного управления',
        category: 'minor',
        icon: 'Zap',
        color: 'from-indigo-500 to-indigo-600',
        priority: 2,
        estimated_time: 7
      },
      {
        id: 'problem-freezing',
        device_id: 'device-ant-premium',
        title: 'Приставка зависает',
        description: 'Устройство периодически зависает или перезагружается',
        category: 'critical',
        icon: 'Pause',
        color: 'from-red-500 to-red-600',
        priority: 5,
        estimated_time: 12
      },
      {
        id: 'problem-wifi-connection',
        device_id: 'device-ant-premium',
        title: 'Проблемы с Wi-Fi',
        description: 'Не удается подключиться к беспроводной сети или соединение нестабильно',
        category: 'moderate',
        icon: 'Wifi',
        color: 'from-purple-500 to-purple-600',
        priority: 3,
        estimated_time: 10
      }
    ];

    for (const problem of problems) {
      await database.query(`
        INSERT INTO problems (id, device_id, title, description, category, icon, color, priority, estimated_time, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          icon = EXCLUDED.icon,
          color = EXCLUDED.color,
          priority = EXCLUDED.priority,
          estimated_time = EXCLUDED.estimated_time
      `, [problem.id, problem.device_id, problem.title, problem.description, problem.category, problem.icon, problem.color, problem.priority, problem.estimated_time, 'published']);
    }

    // 4. Пропускаем диагностические шаги (схема таблицы отличается)
    console.log("🔧 Пропускаем диагностические шаги (будут добавлены позже)...");

    // 5. Пропускаем пульты (будут добавлены позже)
    console.log("🎮 Пропускаем пульты дистанционного управления...");

    // 6. Пропускаем настройки сайта
    console.log("⚙️  Пропускаем настройки сайта...");

    // Проверяем количество записей
    console.log("\n📊 Проверка данных...");
    const devicesCount = await database.query("SELECT COUNT(*) as count FROM devices");
    const problemsCount = await database.query("SELECT COUNT(*) as count FROM problems");

    console.log("🎉 База данных успешно заполнена!");
    console.log("===================================");
    console.log(`📺 Устройств: ${devicesCount.rows[0].count}`);
    console.log(`⚠️  Проблем: ${problemsCount.rows[0].count}`);

    console.log("\n✅ Заполнение базы данных завершено!");
    
  } catch (error) {
    console.error("❌ Ошибка заполнения базы данных:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  } finally {
    await database.closePool();
    console.log("🔒 Соединения с базой данных закрыты");
  }
}

// Запуск заполнения
seedDatabase();
