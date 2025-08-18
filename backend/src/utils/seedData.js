import { query, transaction } from "./database.js";

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const createTimestamp = () => {
  return new Date().toISOString();
};

// Тестовые данные для устройств
const testDevices = [
  {
    id: "openbox_standard",
    name: "OpenBox",
    brand: "OpenBox",
    model: "Standard",
    description: "Стандартные приставки OpenBox для цифрового телевидения",
    color: "from-blue-500 to-blue-600",
    order_index: 1,
    status: "active",
  },
  {
    id: "uclan_hd",
    name: "UCLAN",
    brand: "UCLAN",
    model: "HD Series",
    description: "Высококачественные HD приставки UCLAN",
    color: "from-green-500 to-green-600",
    order_index: 2,
    status: "active",
  },
  {
    id: "hdbox_pro",
    name: "HDBox",
    brand: "HDBox",
    model: "Pro",
    description: "Профессиональные приставки HDBox",
    color: "from-purple-500 to-purple-600",
    order_index: 3,
    status: "active",
  },
  {
    id: "openbox_gold",
    name: "OpenBox Gold",
    brand: "OpenBox",
    model: "Gold Edition",
    description: "Премиум приставки OpenBox Gold с расширенными возможностями",
    color: "from-yellow-500 to-yellow-600",
    order_index: 4,
    status: "active",
  },
  {
    id: "skyway_light",
    name: "SkyWay Light",
    brand: "SkyWay",
    model: "Light",
    description: "Компактные приставки SkyWay Light",
    color: "from-orange-500 to-orange-600",
    order_index: 5,
    status: "active",
  },
];

// Тестовые данные для проблем
const testProblems = [
  {
    id: "no_signal_openbox",
    device_id: "openbox_standard",
    title: "Нет сигнала",
    description:
      'На экране телевизора отображается сообщение "Нет сигнала" или черный экран',
    category: "critical",
    icon: "Monitor",
    color: "from-red-500 to-red-600",
    tags: ["сигнал", "экран", "черный экран"],
    priority: 5,
    estimated_time: 10,
    difficulty: "beginner",
    success_rate: 95,
    status: "published",
  },
  {
    id: "remote_not_working_openbox",
    device_id: "openbox_standard",
    title: "Пульт не работает",
    description:
      "Пульт дистанционного управления не реагирует на нажатие кнопок",
    category: "moderate",
    icon: "Radio",
    color: "from-orange-500 to-orange-600",
    tags: ["пульт", "батарейки", "управление"],
    priority: 3,
    estimated_time: 5,
    difficulty: "beginner",
    success_rate: 90,
    status: "published",
  },
  {
    id: "slow_loading_uclan",
    device_id: "uclan_hd",
    title: "Медленная загрузка каналов",
    description:
      "Каналы переключаются очень медленно или зависают при переключении",
    category: "moderate",
    icon: "Clock",
    color: "from-yellow-500 to-yellow-600",
    tags: ["каналы", "загрузка", "медленно"],
    priority: 2,
    estimated_time: 15,
    difficulty: "intermediate",
    success_rate: 80,
    status: "published",
  },
  {
    id: "no_sound_hdbox",
    device_id: "hdbox_pro",
    title: "Нет звука",
    description: "Изображение есть, но звук отсутствует на всех каналах",
    category: "moderate",
    icon: "VolumeX",
    color: "from-blue-500 to-blue-600",
    tags: ["звук", "аудио", "мute"],
    priority: 4,
    estimated_time: 8,
    difficulty: "beginner",
    success_rate: 85,
    status: "published",
  },
  {
    id: "error_message_openbox_gold",
    device_id: "openbox_gold",
    title: "Ошибка авторизации",
    description:
      "Появляется сообщение об ошибке авторизации при попытке просмотра каналов",
    category: "critical",
    icon: "AlertTriangle",
    color: "from-red-500 to-red-600",
    tags: ["авторизация", "ошибка", "каналы"],
    priority: 5,
    estimated_time: 20,
    difficulty: "advanced",
    success_rate: 75,
    status: "published",
  },
];

// Тестовые данные для диагностических шагов
const testSteps = [
  // Шаги для проблемы "Нет сигнала" OpenBox
  {
    id: "check_cables_openbox",
    problem_id: "no_signal_openbox",
    device_id: "openbox_standard",
    step_number: 1,
    title: "Проверьте соединения кабелей",
    description: "Убедитесь, что все кабели подключены правильно",
    instruction:
      "Проверьте подключение HDMI или AV кабеля между приставкой и телевизором. Убедитесь, что кабель плотно вставлен в разъемы.",
    estimated_time: 60,
    hint: "Попробуйте отключить и снова подключить кабель",
    success_text: "Кабели подключены правильно",
    tv_interface_id: "tv_int_825", // Интерфейс "Нет сигнала" для первого шага
  },
  {
    id: "check_power_openbox",
    problem_id: "no_signal_openbox",
    device_id: "openbox_standard",
    step_number: 2,
    title: "Проверьте питание приставки",
    description: "Убедитесь, что приставка включена и получает питание",
    instruction:
      "Проверьте, что индикатор питания на приставке горит. Если не горит, проверьте подключение блока питания.",
    estimated_time: 30,
    hint: "Индикатор обычно находится на передней панели",
    success_text: "Приставка получает питание",
    tv_interface_id: "tv_int_825", // Тот же интерфейс "Нет сигнала"
  },
  {
    id: "select_input_openbox",
    problem_id: "no_signal_openbox",
    device_id: "openbox_standard",
    step_number: 3,
    title: "Выберите правильный вход на телевизоре",
    description:
      "Убедитесь, что на телевизоре выбран правильный источник сигнала",
    instruction:
      'Нажмите кнопку "Input" или "Source" на пульте телевизора и выберите вход, к которому подключена приставка (HDMI1, HDMI2, AV и т.д.).',
    estimated_time: 45,
    hint: "Попробуйте все доступные входы по очереди",
    success_text: "Выбран правильный вход",
    tv_interface_id: null, // Нет интерфейса на этом шаге, так как работаем с телевизором
  },

  // Шаги для проблемы "Пульт не работает" OpenBox
  {
    id: "check_batteries_openbox",
    problem_id: "remote_not_working_openbox",
    device_id: "openbox_standard",
    step_number: 1,
    title: "Проверьте батарейки в пульте",
    description:
      "Убедитесь, что батарейки установлены правильно и не разряжены",
    instruction:
      "Откройте крышку батарейного отсека на пульте. Проверьте, что батарейки установлены согласно полярности (+/-). Попробуйте заменить батарейки на новые.",
    estimated_time: 120,
    hint: "Используйте качественные батарейки типа AAA",
    success_text: "Батарейки установлены правильно",
    tv_interface_id: "tv_int_828", // Показываем главное меню для контраста
  },
  {
    id: "test_remote_openbox",
    problem_id: "remote_not_working_openbox",
    device_id: "openbox_standard",
    step_number: 2,
    title: "Проверьте работу пульта",
    description: "Убедитесь, что пуль�� передает сигнал",
    instruction:
      "Направьте пульт на приставку и нажмите любую кнопку. Если есть смартфон с камерой, ��осмотрите через камеру на ИК-диод пульта при нажатии кнопки - должен мигать красный свет.",
    estimated_time: 60,
    hint: "Держите пульт на расстоянии не более 5 метров от приставки",
    success_text: "Пульт передает сигнал",
    tv_interface_id: "tv_int_829", // Переключаемся на настройки
  },

  // Шаги для проблемы "Медленная загрузка каналов" UCLAN
  {
    id: "restart_uclan",
    problem_id: "slow_loading_uclan",
    device_id: "uclan_hd",
    step_number: 1,
    title: "Перезагрузите приставку",
    description: "Выполните перезагрузку для очистки временных файлов",
    instruction:
      "Отключите приставку от сети питания на 10 секунд, затем включите снова. Дождитесь полной загрузки системы.",
    estimated_time: 180,
    hint: "Подождите полной загрузки всех сервисов",
    success_text: "Приставка перезагружена",
  },
  {
    id: "clear_cache_uclan",
    problem_id: "slow_loading_uclan",
    device_id: "uclan_hd",
    step_number: 2,
    title: "Очистите кэш приложений",
    description: "Очистите кэш для ускорения работы",
    instruction:
      "Зайдите в Настройки → Система → Память → Очистить кэш. Подтвердите действие и дождитесь завершения процесса.",
    estimated_time: 120,
    hint: "Процесс может занять несколько минут",
    success_text: "Кэш очищен",
  },
];

// Функция заполнения базы данных
export const seedDatabase = async () => {
  try {
    console.log("🌱 Начинаем заполнение базы данных тестовыми данными...");

    await transaction(async (client) => {
      // Очистка существующих данных
      console.log("🧹 Очистка существующих тестовых данных...");

      await client.query("DELETE FROM session_steps");
      await client.query("DELETE FROM diagnostic_sessions");
      await client.query("DELETE FROM diagnostic_steps");
      await client.query("DELETE FROM problems");
      await client.query("DELETE FROM devices");

      // Добавление устройств
      console.log("📱 Добавление тестовых устройств...");
      for (const device of testDevices) {
        const deviceData = {
          ...device,
          is_active: true,
          created_at: createTimestamp(),
          updated_at: createTimestamp(),
        };

        const columns = Object.keys(deviceData);
        const values = Object.values(deviceData);
        const placeholders = columns.map((_, index) => `$${index + 1}`);

        await client.query(
          `INSERT INTO devices (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
          values,
        );
      }

      // Добавление проблем
      console.log("🔧 Добавление тестовых проблем...");
      for (const problem of testProblems) {
        const problemData = {
          ...problem,
          completed_count: Math.floor(Math.random() * 50),
          is_active: true,
          created_at: createTimestamp(),
          updated_at: createTimestamp(),
        };

        const columns = Object.keys(problemData);
        const values = Object.values(problemData);
        const placeholders = columns.map((_, index) => `$${index + 1}`);

        await client.query(
          `INSERT INTO problems (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
          values,
        );
      }

      // Добавление диагностических шагов
      console.log("📋 Добавление диагностич��ских шагов...");
      for (const step of testSteps) {
        const stepData = {
          ...step,
          is_active: true,
          created_at: createTimestamp(),
          updated_at: createTimestamp(),
        };

        const columns = Object.keys(stepData);
        const values = Object.values(stepData);
        const placeholders = columns.map((_, index) => `$${index + 1}`);

        await client.query(
          `INSERT INTO diagnostic_steps (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
          values,
        );
      }

      // Добавление нескольких тестовых сессий
      console.log("📊 Добавление тестовых сессий...");
      for (let i = 0; i < 10; i++) {
        const randomDevice =
          testDevices[Math.floor(Math.random() * testDevices.length)];
        const deviceProblems = testProblems.filter(
          (p) => p.device_id === randomDevice.id,
        );

        if (deviceProblems.length > 0) {
          const randomProblem =
            deviceProblems[Math.floor(Math.random() * deviceProblems.length)];
          const sessionId = generateId();
          const startTime = new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          );
          const endTime = new Date(
            startTime.getTime() + Math.random() * 30 * 60 * 1000,
          );
          const success = Math.random() > 0.2; // 80% успешных сессий

          const sessionData = {
            id: generateId(),
            device_id: randomDevice.id,
            problem_id: randomProblem.id,
            session_id: sessionId,
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            total_steps: Math.floor(Math.random() * 5) + 1,
            completed_steps: success
              ? Math.floor(Math.random() * 5) + 1
              : Math.floor(Math.random() * 3),
            success,
            duration: Math.floor((endTime - startTime) / 1000),
            user_agent: "Mozilla/5.0 (Test Browser)",
            ip_address: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
            is_active: true,
            created_at: createTimestamp(),
            updated_at: createTimestamp(),
          };

          const columns = Object.keys(sessionData);
          const values = Object.values(sessionData);
          const placeholders = columns.map((_, index) => `$${index + 1}`);

          await client.query(
            `INSERT INTO diagnostic_sessions (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
            values,
          );
        }
      }
    });

    console.log("✅ База данных успешно заполнена тестовыми данными!");
    console.log(`📊 Добавлено:`);
    console.log(`   - ${testDevices.length} устройств`);
    console.log(`   - ${testProblems.length} проблем`);
    console.log(`   - ${testSteps.length} диагностических шагов`);
    console.log(`   - 10 тестовых сессий`);

    return {
      success: true,
      devices: testDevices.length,
      problems: testProblems.length,
      steps: testSteps.length,
      sessions: 10,
    };
  } catch (error) {
    console.error("❌ Ошибка при заполнении базы данных:", error);
    throw error;
  }
};

// Функция для запуска из командной строки
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Заполнение завершено успешно!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Ошибка:", error);
      process.exit(1);
    });
}

export default seedDatabase;
