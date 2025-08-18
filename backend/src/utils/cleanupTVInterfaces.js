import { query, transaction } from "./database.js";
import { v4 as uuidv4 } from "uuid";

// Функция очистки всех TV интерфейсов
export const cleanupAndCreateUserTVInterfaces = async () => {
  try {
    console.log("🧹 Начинаем очистку TV интерфейсов...");

    await transaction(async (client) => {
      // Удаляем все существующие TV интерфейсы
      console.log("🗑️ Удаление всех существующих TV интерфейсов...");
      await client.query("DELETE FROM tv_interfaces");
      console.log("✅ Все TV интерфейсы удалены");
    });

    console.log("🎉 Очистка интерфейсов завершена успешно!");
    return {
      success: true,
      deleted: "all",
      message:
        "Все TV интерфейсы удалены. Теперь пользователи могут создавать свои собственные интерфейсы.",
    };
  } catch (error) {
    console.error("❌ Ошибка при очистке TV интерфейсов:", error);
    throw error;
  }
};

// Функция для запуска из командной строки
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupAndCreateUserTVInterfaces()
    .then((result) => {
      console.log("🎉 Очистка завершена успешно!", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Ошибка:", error);
      process.exit(1);
    });
}

export default cleanupAndCreateUserTVInterfaces;
