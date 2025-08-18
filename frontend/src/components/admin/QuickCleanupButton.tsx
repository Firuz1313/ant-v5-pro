import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cleanupAPI } from "@/api/cleanup";

const QuickCleanupButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const response = await cleanupAPI.cleanupTVInterfaces();
      if (response.success) {
        toast({
          title: "🎉 Успех!",
          description: `Очистка завершена. Создано ${response.data?.created || 0} пользовательских интерфейсов с реальными скриншотами`,
        });
        // Обновляем страницу через 2 секунды
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "❌ Ошибка",
          description:
            response.error || "Не удалось выполнить очистку TV интерфейсов",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cleaning up TV interfaces:", error);
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при очистке TV интерфейсов",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Очистка...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              🧹 РЕШИТЬ ПРОБЛЕМУ: Создать пользовательские интерфейсы
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            🎯 Создать пользовательские TV интерфейсы?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <strong>Это действие:</strong>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span>❌</span>
                  <span>
                    Удалит все тестовые интерфейсы ("Главное меню OpenBox",
                    "Настройки UCLAN")
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>
                    Создаст новые пользовательские интерфейсы с реальными
                    скриншота��и
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>
                    Исправит проблему "Нет скриншота" в редакторе областей
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Добавит кликабельные области для навигации</span>
                </div>
              </div>
              <div className="font-medium text-green-600 text-sm">
                После этого редактор областей интерфейса будет полностью
                работать!
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleCleanup} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              "🚀 Создать пользовательские интерфейсы"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuickCleanupButton;
