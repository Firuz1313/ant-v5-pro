import { cleanupAndCreateUserTVInterfaces } from "../utils/cleanupTVInterfaces.js";

export const cleanupTVInterfaces = async (req, res) => {
  try {
    console.log("🧹 Запуск очистки TV интерфейсов через API...");

    const result = await cleanupAndCreateUserTVInterfaces();

    res.json({
      success: true,
      data: result,
      message: "TV интерфейсы успешно очищены и созданы пользовательские",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in cleanupTVInterfaces:", error);
    res.status(500).json({
      success: false,
      error: "Ошибка при очистке TV интерфейсов",
      details: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

export default {
  cleanupTVInterfaces,
};
