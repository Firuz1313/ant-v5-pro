import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TVInterfaceDisplay from "@/components/TVInterfaceDisplay";
import RemoteControl from "@/components/RemoteControl";
import { useDevices } from "@/hooks/useDevices";
import { useProblems } from "@/hooks/useProblems";
import { remotesApi, stepsApi } from "@/api";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DiagnosticPage = () => {
  const navigate = useNavigate();
  const { deviceId, problemId } = useParams<{
    deviceId: string;
    problemId: string;
  }>();

  // API hooks
  const { data: devicesResponse, isLoading: devicesLoading } = useDevices();
  const { data: problemsResponse, isLoading: problemsLoading } = useProblems(
    1,
    20,
    { deviceId },
  );

  // Extract data arrays from API responses
  const devices = devicesResponse?.data || [];
  const problems = problemsResponse?.data || [];

  // Local state
  const [currentStepNumber, setCurrentStepNumber] = useState(1);
  const [manualProgress, setManualProgress] = useState(false);
  const [steps, setSteps] = useState([]);
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derived state
  const device = devices?.find((d) => d.id === deviceId);
  const problem = problems?.find((p) => p.id === problemId);
  const currentStepData = steps.find(
    (step) => step.stepNumber === currentStepNumber,
  );

  // Load steps when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!problemId || !deviceId) return;

      try {
        setLoading(true);
        const stepsResponse = await stepsApi.getStepsByProblem(problemId);
        setSteps(stepsResponse?.data || []);
      } catch (error) {
        console.error("Error loading diagnostic data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [problemId, deviceId]);

  // Load remote
  useEffect(() => {
    const loadRemote = async () => {
      if (!deviceId) return;

      try {
        // Try step-specific remote first
        if (currentStepData?.remoteId) {
          try {
            const stepRemote = await remotesApi.getById(
              currentStepData.remoteId,
            );
            setRemote(stepRemote);
            return;
          } catch (stepError) {
            console.warn(`Failed to load step-specific remote`, stepError);
          }
        }

        // Try device default remote
        try {
          const defaultRemote = await remotesApi.getDefaultForDevice(deviceId);
          setRemote(defaultRemote);
          return;
        } catch (defaultError: any) {
          // Try any remote for device
          try {
            const deviceRemotes = await remotesApi.getByDevice(deviceId);
            if (deviceRemotes && deviceRemotes.length > 0) {
              setRemote(deviceRemotes[0]);
              return;
            }
          } catch (deviceError) {
            console.error(`Failed to load device remotes`, deviceError);
          }
        }

        // Final fallback
        const fallbackRemote = {
          id: `fallback-${deviceId}`,
          name: `${deviceId.toUpperCase()} Remote`,
          manufacturer: deviceId.toUpperCase(),
          model: "Universal",
          device_id: deviceId,
          layout: "standard",
          is_default: false,
          buttons: [],
          dimensions: { width: 140, height: 420 },
        };
        setRemote(fallbackRemote);
      } catch (error) {
        console.error(`Error loading remote`, error);
      }
    };

    loadRemote();
  }, [deviceId, currentStepData?.remoteId]);

  const handlePrevStep = () => {
    if (currentStepNumber > 1) {
      setCurrentStepNumber(currentStepNumber - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepNumber < steps.length) {
      setCurrentStepNumber(currentStepNumber + 1);
    } else {
      navigate(`/success/${deviceId}/${problemId}`);
    }
  };

  const handleBack = () => {
    navigate(`/problems/${deviceId}`);
  };

  const handleManualProgress = () => {
    setManualProgress(true);
    setTimeout(() => setManualProgress(false), 2000);
  };

  if (devicesLoading || problemsLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-900">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка диагностики...</p>
        </div>
      </div>
    );
  }

  if (!device || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-900">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>Устройство или проблема не найдены</p>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-900">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p>Шаги диагностики не найдены</p>
          <Button onClick={handleBack} className="mt-4" variant="outline">
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:bg-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {device.name || "OpenBox"}
              </h1>
              <p className="text-gray-600 text-sm">
                {problem.title || "Диагностика"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center mb-4">
            {Array.from({ length: steps.length }, (_, index) => (
              <React.Fragment key={index}>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    index + 1 <= currentStepNumber
                      ? "bg-gray-900 border-gray-900"
                      : index + 1 === currentStepNumber
                        ? "bg-white border-gray-900"
                        : "bg-white border-gray-300"
                  }`}
                />
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ${
                      index + 1 < currentStepNumber
                        ? "bg-gray-900"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center text-gray-600 text-sm">
            Шаг {currentStepNumber}
          </div>
        </div>

        {/* Main Content - Responsive Mockup Layout */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8 lg:gap-12">
          {/* TV Section - Top on Mobile, Left on Desktop */}
          <div className="flex flex-col items-center">
            {/* TV Display - Responsive Sizing */}
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-0">
                <div
                  className="bg-gray-900 rounded-xl overflow-hidden w-full max-w-[650px] aspect-video lg:aspect-[650/380]"
                  style={{
                    width: "90vw",
                    maxWidth: "650px",
                    height: "calc(90vw * 380/650)",
                    maxHeight: "380px",
                  }}
                >
                  {currentStepData?.tvInterfaceId ? (
                    <TVInterfaceDisplay
                      tvInterfaceId={currentStepData.tvInterfaceId}
                      stepId={currentStepData.id}
                      tvAreaPosition={currentStepData.tvAreaPosition}
                      tvAreaRect={currentStepData.tvAreaRect}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                      {/* Default TV Interface - Mockup Style */}
                      <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center text-white">
                            <div className="w-6 h-6 mr-3">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                              </svg>
                            </div>
                            <span className="text-lg font-medium">
                              Главное м��ню
                            </span>
                          </div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Шаг 1
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                          <div className="bg-gray-600 rounded-lg p-4 text-center text-white hover:bg-gray-500 transition-colors">
                            <div className="w-10 h-10 mx-auto mb-3 text-red-500">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                              </svg>
                            </div>
                            <div className="font-medium">Прямой эфир</div>
                          </div>

                          <div className="bg-gray-600 rounded-lg p-4 text-center text-white hover:bg-gray-500 transition-colors">
                            <div className="w-10 h-10 mx-auto mb-3 text-blue-500">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
                              </svg>
                            </div>
                            <div className="font-medium">Настройки</div>
                          </div>

                          <div className="bg-gray-600 rounded-lg p-4 text-center text-white hover:bg-gray-500 transition-colors">
                            <div className="w-10 h-10 mx-auto mb-3 text-green-500">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                              </svg>
                            </div>
                            <div className="font-medium">Приложения</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons - Directly Under TV */}
            <div
              className="flex items-center justify-between mt-6 w-full max-w-[650px]"
              style={{ width: "90vw", maxWidth: "650px" }}
            >
              <Button
                onClick={handlePrevStep}
                disabled={currentStepNumber <= 1}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                onClick={handleNextStep}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            {/* Hint Text - Directly Under TV */}
            <div
              className="mt-4 text-center w-full max-w-[650px]"
              style={{ width: "90vw", maxWidth: "650px" }}
            >
              <p className="text-gray-600 text-sm">
                Красная точка на пульте показывает точное место для нажатия
              </p>
              <p className="text-gray-600 text-sm">
                Красная точка на пульте показывает точное место для нажатия
              </p>
            </div>
          </div>

          {/* Remote Control - Bottom on Mobile, Right on Desktop */}
          <div className="flex justify-center lg:justify-start">
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="w-[120px] h-[330px] lg:w-[140px] lg:h-[360px]">
                  <RemoteControl
                    remote={remote}
                    highlightButton={
                      currentStepData?.highlightRemoteButton || "power"
                    }
                    showButtonPosition={currentStepData?.buttonPosition}
                    onButtonClick={handleManualProgress}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Manual Progress Indicator */}
        {manualProgress && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Действие выполнено!
          </div>
        )}
      </main>
    </div>
  );
};

export default DiagnosticPage;
