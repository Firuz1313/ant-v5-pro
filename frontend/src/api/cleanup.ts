import { apiClient } from "./client";

export interface CleanupResponse {
  success: boolean;
  created: number;
}

export const cleanupAPI = {
  // Очистить TV интерфейсы и создать пользовательские
  cleanupTVInterfaces: async (): Promise<{
    success: boolean;
    data?: CleanupResponse;
    error?: string;
  }> => {
    try {
      console.log(
        "🧹 Attempting to call cleanup API: POST /cleanup/tv-interfaces",
      );
      const response = await apiClient.post("/cleanup/tv-interfaces");
      console.log("✅ Cleanup API response:", response);
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error("❌ Error cleaning up TV interfaces:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
      });
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Произошла ошибка при очистке TV интерфейсов",
      };
    }
  },
};

export default cleanupAPI;
