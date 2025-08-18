import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/api/client";

const SimpleCleanupButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      console.log("🧹 Starting cleanup process...");

      // First test if we can reach the API at all
      try {
        const healthCheck = await apiClient.get("/health");
        console.log("✅ API Health check passed:", healthCheck);
      } catch (healthError) {
        console.error("❌ API Health check failed:", healthError);
        throw new Error("API не доступен");
      }

      // Try to call the cleanup endpoint
      console.log("🧹 Calling cleanup endpoint...");
      const response = await apiClient.post("/cleanup/tv-interfaces");

      console.log("✅ Cleanup response:", response);

      if (response.data.success) {
        toast({
          title: "🎉 Успех!",
          description: `Очистка завершена. Создано ${response.data.data?.created || 0} пользовательских интерфейсов`,
        });

        // Reload page after success
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(response.data.error || "Неизвестная ошибка");
      }
    } catch (error: any) {
      console.error("❌ Cleanup failed:", error);

      let errorMessage = "Произошла ошибка при очистке TV интерфейсов";

      if (error.response) {
        // HTTP error
        errorMessage = `HTTP ${error.response.status}: ${error.response.data?.error || error.response.statusText}`;
      } else if (error.message) {
        // Other error
        errorMessage = error.message;
      }

      toast({
        title: "❌ Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCleanup}
      variant="destructive"
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Очистка...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          🧹 Создать пользовательские интерфейсы
        </>
      )}
    </Button>
  );
};

export default SimpleCleanupButton;
