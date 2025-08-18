import { cn } from "@/lib/utils";
import {
  Power,
  Home,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  Menu,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Minus,
  Plus,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface RemoteControlProps {
  highlightButton?: string;
  onButtonClick?: (buttonId: string) => void;
  glowButton?: string;
  remoteId?: string;
  className?: string;
  showButtonPosition?: { x: number; y: number };
}

const RemoteControl = ({
  highlightButton,
  onButtonClick,
  glowButton,
  remoteId,
  className,
  showButtonPosition,
}: RemoteControlProps) => {
  const { getRemoteById, getDefaultRemote } = useData();

  // Get the specific remote or fall back to default
  const remote = remoteId ? getRemoteById(remoteId) : getDefaultRemote();
  const useCustomRemote =
    remote && remote.imageData && remote.buttons.length > 0;

  const handleButtonClick = (buttonId: string) => {
    if (onButtonClick) {
      onButtonClick(buttonId);
    }
  };

  const getButtonClass = (buttonId: string, baseClass = "") => {
    return cn(
      "transition-all duration-300 flex items-center justify-center font-semibold relative",
      baseClass,
      {
        "ring-4 ring-blue-400 ring-opacity-75 shadow-lg shadow-blue-500/50 bg-blue-500/20 scale-110 z-10":
          highlightButton === buttonId,
        "animate-pulse ring-2 ring-yellow-400 shadow-lg shadow-yellow-500/50 bg-yellow-500/20":
          glowButton === buttonId,
      },
    );
  };

  // Render custom remote if available
  if (useCustomRemote && remote) {
    return (
      <div className={cn("relative h-full", className)}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Remote background image */}
          <div
            className="relative w-full max-w-[260px] h-full min-h-[600px] lg:min-h-[700px] bg-cover bg-center bg-no-repeat rounded-3xl shadow-2xl border-4 border-gray-700"
            style={{
              backgroundImage: `url(${remote.imageData})`,
            }}
          >
            {/* Custom buttons */}
            {remote.buttons.map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.action)}
                className={cn("absolute transition-all duration-300", {
                  "ring-4 ring-blue-400 ring-opacity-75 shadow-lg shadow-blue-500/50 scale-110 z-10":
                    highlightButton === button.action,
                  "animate-pulse ring-2 ring-yellow-400 shadow-lg shadow-yellow-500/50":
                    glowButton === button.action,
                })}
                style={{
                  left: `${(button.position.x / remote.dimensions.width) * 100}%`,
                  top: `${(button.position.y / remote.dimensions.height) * 100}%`,
                  width: `${(button.size.width / remote.dimensions.width) * 100}%`,
                  height: `${(button.size.height / remote.dimensions.height) * 100}%`,
                  backgroundColor: button.color,
                  color: button.textColor,
                  fontSize: `${button.fontSize}px`,
                  borderRadius:
                    button.shape === "circle"
                      ? "50%"
                      : button.shape === "rounded"
                        ? "8px"
                        : "4px",
                  transform: "translate(-50%, -50%)",
                }}
                title={button.label}
              >
                <span className="text-xs font-semibold">{button.label}</span>
              </button>
            ))}

            {/* Show button position indicator if provided */}
            {showButtonPosition && (
              <div
                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-20"
                style={{
                  left: `${(showButtonPosition.x / remote.dimensions.width) * 100}%`,
                  top: `${(showButtonPosition.y / remote.dimensions.height) * 100}%`,
                }}
              />
            )}
          </div>
        </div>

        {/* Highlight Effect */}
        {highlightButton && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  // Render default remote if no custom remote is available
  return (
    <div className={cn("relative h-full", className)}>
      {/* Remote Frame */}
      <div className="bg-gray-900 p-4 lg:p-5 rounded-3xl shadow-2xl border-4 border-gray-700 w-full h-full flex flex-col justify-between min-h-[500px] lg:min-h-[580px] max-w-[220px] mx-auto">
        {/* Top Section */}
        <div className="space-y-3 lg:space-y-4 flex-shrink-0">
          {/* Power Button */}
          <button
            onClick={() => handleButtonClick("power")}
            className={getButtonClass(
              "power",
              "w-10 h-10 lg:w-12 lg:h-12 bg-red-600 hover:bg-red-700 text-white rounded-full mx-auto block",
            )}
          >
            <Power className="h-5 w-5" />
          </button>

          {/* Number Buttons */}
          <div className="grid grid-cols-3 gap-1 lg:gap-2">
            {Array.from({ length: 9 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleButtonClick(`number-${i + 1}`)}
                className={getButtonClass(
                  `number-${i + 1}`,
                  "w-full h-8 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs lg:text-sm aspect-square",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* 0 and special buttons */}
          <div className="grid grid-cols-3 gap-1 lg:gap-2">
            <button
              onClick={() => handleButtonClick("prev")}
              className={getButtonClass(
                "prev",
                "w-full h-8 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs aspect-square",
              )}
            >
              <RotateCcw className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => handleButtonClick("number-0")}
              className={getButtonClass(
                "number-0",
                "w-full h-8 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs lg:text-sm aspect-square",
              )}
            >
              0
            </button>
            <button
              onClick={() => handleButtonClick("menu")}
              className={getButtonClass(
                "menu",
                "w-full h-8 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs aspect-square",
              )}
            >
              <Menu className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 flex flex-col justify-center py-4">
          {/* D-Pad */}
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-4">
            {/* Up */}
            <button
              onClick={() => handleButtonClick("up")}
              className={getButtonClass(
                "up",
                "absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <ArrowUp className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* Left */}
            <button
              onClick={() => handleButtonClick("left")}
              className={getButtonClass(
                "left",
                "absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* Center OK */}
            <button
              onClick={() => handleButtonClick("ok")}
              className={getButtonClass(
                "ok",
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold",
              )}
            >
              OK
            </button>

            {/* Right */}
            <button
              onClick={() => handleButtonClick("right")}
              className={getButtonClass(
                "right",
                "absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* Down */}
            <button
              onClick={() => handleButtonClick("down")}
              className={getButtonClass(
                "down",
                "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <ArrowDown className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </div>

          {/* Home and Back */}
          <div className="flex justify-center gap-2 lg:gap-4">
            <button
              onClick={() => handleButtonClick("back")}
              className={getButtonClass(
                "back",
                "w-16 h-7 lg:w-18 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs",
              )}
            >
              Назад
            </button>
            <button
              onClick={() => handleButtonClick("home")}
              className={getButtonClass(
                "home",
                "w-16 h-7 lg:w-18 lg:h-8 bg-green-600 hover:bg-green-700 text-white rounded-lg",
              )}
            >
              <Home className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => handleButtonClick("settings")}
              className={getButtonClass(
                "settings",
                "w-16 h-7 lg:w-18 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex-shrink-0 py-2">
          <div className="flex justify-center gap-1 lg:gap-2">
            <button
              onClick={() => handleButtonClick("vol-down")}
              className={getButtonClass(
                "vol-down",
                "w-16 h-7 lg:w-18 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center",
              )}
            >
              <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => handleButtonClick("mute")}
              className={getButtonClass(
                "mute",
                "w-16 h-7 lg:w-18 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <VolumeX className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => handleButtonClick("vol-up")}
              className={getButtonClass(
                "vol-up",
                "w-16 h-7 lg:w-18 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center",
              )}
            >
              <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex-shrink-0 pb-4">
          <div className="flex justify-center gap-1 lg:gap-2">
            <button
              onClick={() => handleButtonClick("rewind")}
              className={getButtonClass(
                "rewind",
                "w-12 h-7 lg:w-14 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <SkipBack className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => handleButtonClick("play-pause")}
              className={getButtonClass(
                "play-pause",
                "w-12 h-7 lg:w-14 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <Play className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
            <button
              onClick={() => handleButtonClick("forward")}
              className={getButtonClass(
                "forward",
                "w-12 h-7 lg:w-14 lg:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-lg",
              )}
            >
              <SkipForward className="h-3 w-3 lg:h-4 lg:w-4" />
            </button>
          </div>
        </div>

        {/* Remote Brand */}
        <div className="text-center flex-shrink-0">
          <span className="text-gray-500 text-xs font-semibold">
            {remote?.name || "UNIVERSAL REMOTE"}
          </span>
        </div>
      </div>

      {/* Show button position indicator if provided */}
      {showButtonPosition && (
        <div
          className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 animate-pulse z-20"
          style={{
            left: `${showButtonPosition.x}px`,
            top: `${showButtonPosition.y}px`,
          }}
        />
      )}

      {/* Highlight Effect */}
      {highlightButton && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/10 rounded-3xl animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default RemoteControl;
