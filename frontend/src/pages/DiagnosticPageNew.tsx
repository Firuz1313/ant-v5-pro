import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import TVDisplay from "@/components/TVDisplay";
import TVInterfaceDisplay from "@/components/TVInterfaceDisplay";
import RemoteControl from "@/components/RemoteControl";
import { tvInterfacesAPI, TVInterfaceAPI } from "@/api/tvInterfaces";
import { TVInterfaceMark } from "@/api/tvInterfaceMarks";
import { useDevices } from "@/hooks/useDevices";
import { useProblems } from "@/hooks/useProblems";
import { stepsApi, remotesApi } from "@/api";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Tv,
  Monitor,
  Target,
  MousePointer,
  Loader2,
} from "lucide-react";

interface DiagnosticStep {
  id: string;
  problemId: string;
  deviceId: string;
  stepNumber: number;
  title: string;
  description: string;
  instruction: string;
  highlightRemoteButton?: string;
  highlightTVArea?: string;
  tvInterfaceId?: string;
  requiredAction?: string;
  hint?: string;
  remoteId?: string;
  buttonPosition?: { x: number; y: number };
  tvAreaPosition?: { x: number; y: number };
  tvAreaRect?: { x: number; y: number; width: number; height: number };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const DiagnosticPageNew = () => {
  const navigate = useNavigate();
  const { deviceId, problemId } = useParams<{
    deviceId: string;
    problemId: string;
  }>();
  
  // API hooks
  const { devices } = useDevices();
  const { problems } = useProblems();

  // Local state
  const [steps, setSteps] = useState<DiagnosticStep[]>([]);
  const [remote, setRemote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Состояние
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [manualProgress, setManualProgress] = useState(false);
  const [currentTVInterface, setCurrentTVInterface] = useState<TVInterfaceAPI | null>(null);
  const [loadingTVInterface, setLoadingTVInterface] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [hoveredMark, setHoveredMark] = useState<TVInterfaceMark | null>(null);
  const [selectedMark, setSelectedMark] = useState<TVInterfaceMark | null>(null);

  // Данные
  const device = deviceId ? getDeviceById(deviceId) : null;
  const steps: DiagnosticStep[] = problemId ? getStepsForProblem(problemId) : [];
  const currentStepData = steps.find(
    (step) => step.stepNumber === currentStepNumber,
  );
  const progress = steps.length > 0 ? (currentStepNumber / steps.length) * 100 : 0;
  const problem = problemId ? problems.find((p) => p.id === problemId) : null;

  // Получение пульта для текущего ��ага
  const stepRemote = currentStepData?.remoteId
    ? getRemoteById(currentStepData.remoteId)
    : null;
  const deviceDefaultRemote = deviceId
    ? getDefaultRemoteForDevice(deviceId)
    : null;
  const remote = stepRemote || deviceDefaultRemote;

  // Загрузка ТВ интерфейса для текущего шага
  useEffect(() => {
    const loadTVInterface = async () => {
      if (currentStepData?.tvInterfaceId && currentStepData.tvInterfaceId !== "none") {
        setLoadingTVInterface(true);
        try {
          const response = await tvInterfacesAPI.getById(currentStepData.tvInterfaceId);
          if (response.success && response.data) {
            setCurrentTVInterface(response.data);
          }
        } catch (error) {
          console.error("Error loading TV interface:", error);
          setCurrentTVInterface(null);
        } finally {
          setLoadingTVInterface(false);
        }
      } else {
        setCurrentTVInterface(null);
      }
    };

    loadTVInterface();
  }, [currentStepData?.tvInterfaceId]);

  // Проверка валидности данных
  useEffect(() => {
    if (!deviceId || !problemId || steps.length === 0) {
      navigate("/devices");
    }
  }, [deviceId, problemId, steps.length, navigate]);

  const handleNextStep = () => {
    // Clear mark selections when moving to next step
    setSelectedMark(null);
    setHoveredMark(null);

    if (currentStepNumber < steps.length) {
      setCurrentStepNumber(currentStepNumber + 1);
      setManualProgress(true);
    } else {
      // Все шаги завершены
      const sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);

      // Можно сохранить сессию диагностики
      console.log('Diagnostic session completed:', {
        deviceId,
        problemId,
        sessionId,
        duration: sessionDuration,
        completedSteps: steps.length,
        success: true
      });

      navigate(`/success/${deviceId}/${sessionId}?problemId=${problemId}`);
    }
  };

  const handlePrevStep = () => {
    // Clear mark selections when moving to previous step
    setSelectedMark(null);
    setHoveredMark(null);

    if (currentStepNumber > 1) {
      setCurrentStepNumber(currentStepNumber - 1);
    }
  };

  const handleBack = () => {
    navigate(`/problems/${deviceId}`);
  };

  const getProblemTitle = () => {
    return problem?.title || "Диагностика проблемы";
  };

  // Mark interaction handlers
  const handleMarkClick = (mark: TVInterfaceMark) => {
    setSelectedMark(mark);
    console.log('Mark clicked:', mark);

    // If the mark has a click action, we could trigger it here
    if (mark.click_action && mark.action_value) {
      console.log(`Triggering action: ${mark.click_action} - ${mark.action_value}`);
    }
  };

  const handleMarkHover = (mark: TVInterfaceMark | null) => {
    setHoveredMark(mark);
  };

  // Рендер пульта
  const renderRemote = () => {
    if (!remote) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-800 rounded-xl">
          <div className="text-center text-white">
            <MousePointer className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Пульт не найден</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-gray-800 rounded-xl p-2 shadow-2xl w-full">
        {remote.imageData ? (
          <img
            src={remote.imageData}
            alt={remote.name}
            className="w-full h-auto object-contain rounded-lg"
            style={{ maxHeight: '420px' }}
          />
        ) : (
          <RemoteControl />
        )}
        
        {/* Индикатор позиции кнопки */}
        {currentStepData?.buttonPosition && remote.imageData && (
          <div
            className="absolute w-6 h-6 bg-red-500 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-lg z-10"
            style={{
              left: `${(currentStepData.buttonPosition.x / (remote.dimensions?.width || 400)) * 100}%`,
              top: `${(currentStepData.buttonPosition.y / (remote.dimensions?.height || 600)) * 100}%`,
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <Target className="absolute inset-0 w-3 h-3 text-white m-auto" />
          </div>
        )}
        
        {/* Бейдж названия пульта */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gray-700 text-white text-xs">
            {remote.name}
          </Badge>
        </div>
      </div>
    );
  };

  if (!device || !currentStepData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-4">Данные не найдены</h2>
          <Button onClick={() => navigate("/devices")}>
            Вернуться к выбору приставки
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="w-full px-4 pt-6 pb-2 flex flex-col items-center">
        <div className="max-w-7xl w-full flex flex-col items-center">
          <span className="text-2xl font-bold text-white mb-1 text-center">
            {device.name} - {getProblemTitle()}
          </span>
          <div className="text-xs text-gray-400 -mt-1 mb-2">
            Шаг {currentStepNumber} из {steps.length}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Current TV Interface Info */}
          {currentTVInterface && (
            <div className="mt-2">
              <Badge variant="outline" className="text-gray-300 border-gray-400">
                <Tv className="h-3 w-3 mr-1" />
                Интерфейс: {currentTVInterface.name}
              </Badge>
            </div>
          )}
        </div>
      </header>

      {/* Main Content: TV + Remote */}
      <div className="flex-1 flex flex-row items-start justify-center w-full max-w-7xl mx-auto px-4 gap-8 mt-2" style={{ minHeight: 0 }}>
        {/* TV Interface */}
        <div className="flex-1 flex items-center justify-end max-w-4xl min-w-0">
          <div className="w-full" style={{ aspectRatio: '16/9', maxHeight: '450px' }}>
            <TVInterfaceDisplay
              tvInterfaceId={currentStepData?.tvInterfaceId}
              stepId={currentStepData?.id}
              currentStepNumber={currentStepNumber}
              tvAreaPosition={currentStepData?.tvAreaPosition}
              tvAreaRect={currentStepData?.tvAreaRect}
              showAllMarks={true}
              highlightActiveMarks={true}
              showHints={true}
              enableAnimations={true}
              onMarkClick={handleMarkClick}
              onMarkHover={handleMarkHover}
              className="w-full h-full"
            />
          </div>
        </div>
        
        {/* Remote Control */}
        <div className="flex items-center justify-start" style={{ width: '200px', minWidth: '160px', maxWidth: '220px' }}>
          {renderRemote()}
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="w-full px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {currentStepNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-300 mb-3">
                    {currentStepData.description}
                  </p>
                  <div className="text-white leading-relaxed mb-4">
                    {currentStepData.instruction}
                  </div>
                  
                  {/* Step Hint */}
                  {currentStepData.hint && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg mb-4">
                      <Lightbulb className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-yellow-200 text-sm">
                        <strong>Подсказка:</strong> {currentStepData.hint}
                      </p>
                    </div>
                  )}

                  {/* Selected Mark Information */}
                  {selectedMark && (
                    <div className="flex items-start gap-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg mb-4">
                      <Target className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-blue-200 text-sm">
                        <p className="font-medium">{selectedMark.name}</p>
                        {selectedMark.description && (
                          <p className="mt-1">{selectedMark.description}</p>
                        )}
                        {selectedMark.action_description && (
                          <p className="mt-1">
                            <strong>Действие:</strong> {selectedMark.action_description}
                          </p>
                        )}
                        {selectedMark.expected_result && (
                          <p className="mt-1 text-green-300">
                            <strong>Ожидаемый результат:</strong> {selectedMark.expected_result}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hovered Mark Quick Info */}
                  {hoveredMark && !selectedMark && (
                    <div className="flex items-start gap-2 p-2 bg-gray-500/20 border border-gray-500/30 rounded-lg mb-4">
                      <MousePointer className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="text-gray-300 text-sm">
                        <p className="font-medium">{hoveredMark.name}</p>
                        {hoveredMark.hint_text && (
                          <p className="mt-1 text-yellow-300">{hoveredMark.hint_text}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step Status Indicators */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentStepData.remoteId && (
                      <Badge variant="outline" className="text-green-300 border-green-400">
                        <MousePointer className="h-3 w-3 mr-1" />
                        Пульт подключен
                      </Badge>
                    )}
                    {currentStepData.tvInterfaceId && (
                      <Badge variant="outline" className="text-blue-300 border-blue-400">
                        <Monitor className="h-3 w-3 mr-1" />
                        ТВ интерфейс активен
                      </Badge>
                    )}
                    {currentStepData.buttonPosition && (
                      <Badge variant="outline" className="text-red-300 border-red-400">
                        <Target className="h-3 w-3 mr-1" />
                        Позиция кнопки
                      </Badge>
                    )}
                    {currentStepData.tvAreaPosition && (
                      <Badge variant="outline" className="text-orange-300 border-orange-400">
                        <Target className="h-3 w-3 mr-1" />
                        Область на ТВ
                      </Badge>
                    )}
                    {selectedMark && (
                      <Badge variant="outline" className="text-purple-300 border-purple-400">
                        <Target className="h-3 w-3 mr-1" />
                        Выбрана отметка
                      </Badge>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Назад к проблемам
                      </Button>
                      {currentStepNumber > 1 && (
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Предыдущий шаг
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleNextStep}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {currentStepNumber === steps.length ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Завершить диагностику
                        </>
                      ) : (
                        <>
                          Следующий шаг
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPageNew;
