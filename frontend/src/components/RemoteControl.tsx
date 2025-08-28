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

interface RemoteControlProps {
  highlightButton?: string;
  onButtonClick?: (buttonId: string) => void;
  glowButton?: string;
  remoteId?: string;
  remote?: any;
  className?: string;
  showButtonPosition?: { x: number; y: number };
}

const RemoteControl = ({
  highlightButton,
  onButtonClick,
  glowButton,
  remoteId,
  remote: providedRemote,
  className,
  showButtonPosition,
}: RemoteControlProps) => {
  // Mock functions for removed static functionality
  const getRemoteById = (id: string) => null;
  const getDefaultRemote = () => null;

  // Resolve remote from props or fallbacks
  const remote =
    providedRemote ?? (remoteId ? getRemoteById(remoteId) : getDefaultRemote());
  const imageData =
    remote?.imageData ||
    remote?.image_data ||
    remote?.imageUrl ||
    remote?.image_url;
  const buttons = remote?.buttons || [];
  const dimensions = remote?.dimensions || { width: 260, height: 700 };
  const useCustomRemote = !!imageData;

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
            className="relative w-full max-w-[280px] h-full min-h-[480px] lg:min-h-[550px] bg-cover bg-center bg-no-repeat rounded-3xl shadow-2xl border-4 border-gray-700"
            style={{
              backgroundImage: `url(${imageData})`,
            }}
          >
            {/* Custom buttons */}
            {buttons.map((button: any) => (
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
                  left: `${((button.position?.x ?? button.x) / dimensions.width) * 100}%`,
                  top: `${((button.position?.y ?? button.y) / dimensions.height) * 100}%`,
                  width: `${((button.size?.width ?? button.width) / dimensions.width) * 100}%`,
                  height: `${((button.size?.height ?? button.height) / dimensions.height) * 100}%`,
                  backgroundColor: button.color,
                  color: button.textColor,
                  fontSize: `${button.fontSize ?? 12}px`,
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
      <div
        className="bg-gray-900 p-3 rounded-2xl shadow-xl border-2 border-gray-700 w-full h-full flex flex-col justify-between"
        style={{ maxWidth: "160px", minHeight: "330px" }}
      >
        {/* Top Section */}
        <div className="space-y-2 flex-shrink-0">
          {/* Power Button */}
          <div className="relative flex justify-center">
            <button
              onClick={() => handleButtonClick("power")}
              className={getButtonClass(
                "power",
                "w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full relative",
              )}
            >
              <Power className="h-3 w-3" />
              {/* Red dot indicator */}
              {highlightButton === "power" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse z-10"></div>
              )}
            </button>
          </div>

          {/* Number Buttons */}
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handleButtonClick(`number-${i + 1}`)}
                className={getButtonClass(
                  `number-${i + 1}`,
                  "w-full h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs aspect-square",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* 0 and special buttons */}
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handleButtonClick("prev")}
              className={getButtonClass(
                "prev",
                "w-full h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs aspect-square",
              )}
            >
              <RotateCcw className="h-2 w-2" />
            </button>
            <button
              onClick={() => handleButtonClick("number-0")}
              className={getButtonClass(
                "number-0",
                "w-full h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs aspect-square",
              )}
            >
              0
            </button>
            <button
              onClick={() => handleButtonClick("menu")}
              className={getButtonClass(
                "menu",
                "w-full h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs aspect-square",
              )}
            >
              <Menu className="h-2 w-2" />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 flex flex-col justify-center py-2">
          {/* D-Pad */}
          <div className="relative w-16 h-16 mx-auto mb-2">
            {/* Up */}
            <button
              onClick={() => handleButtonClick("up")}
              className={getButtonClass(
                "up",
                "absolute top-0 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <ArrowUp className="h-3 w-3" />
            </button>

            {/* Left */}
            <button
              onClick={() => handleButtonClick("left")}
              className={getButtonClass(
                "left",
                "absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <ArrowLeft className="h-3 w-3" />
            </button>

            {/* Center OK */}
            <button
              onClick={() => handleButtonClick("ok")}
              className={getButtonClass(
                "ok",
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold",
              )}
            >
              OK
            </button>

            {/* Right */}
            <button
              onClick={() => handleButtonClick("right")}
              className={getButtonClass(
                "right",
                "absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <ArrowRight className="h-3 w-3" />
            </button>

            {/* Down */}
            <button
              onClick={() => handleButtonClick("down")}
              className={getButtonClass(
                "down",
                "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>

          {/* Home and Back */}
          <div className="flex justify-center gap-1">
            <button
              onClick={() => handleButtonClick("back")}
              className={getButtonClass(
                "back",
                "w-9 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs",
              )}
            >
              ←
            </button>
            <button
              onClick={() => handleButtonClick("home")}
              className={getButtonClass(
                "home",
                "w-9 h-5 bg-green-600 hover:bg-green-700 text-white rounded-md",
              )}
            >
              <Home className="h-2 w-2" />
            </button>
            <button
              onClick={() => handleButtonClick("settings")}
              className={getButtonClass(
                "settings",
                "w-9 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <Settings className="h-2 w-2" />
            </button>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex-shrink-0 py-1">
          <div className="flex justify-center gap-1">
            <button
              onClick={() => handleButtonClick("vol-down")}
              className={getButtonClass(
                "vol-down",
                "w-9 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center",
              )}
            >
              <Minus className="h-2 w-2" />
            </button>
            <button
              onClick={() => handleButtonClick("mute")}
              className={getButtonClass(
                "mute",
                "w-9 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <VolumeX className="h-2 w-2" />
            </button>
            <button
              onClick={() => handleButtonClick("vol-up")}
              className={getButtonClass(
                "vol-up",
                "w-9 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center justify-center",
              )}
            >
              <Plus className="h-2 w-2" />
            </button>
          </div>
        </div>

        {/* Media Controls */}
        <div className="flex-shrink-0 pb-2">
          <div className="flex justify-center gap-1">
            <button
              onClick={() => handleButtonClick("rewind")}
              className={getButtonClass(
                "rewind",
                "w-8 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <SkipBack className="h-2 w-2" />
            </button>
            <button
              onClick={() => handleButtonClick("play-pause")}
              className={getButtonClass(
                "play-pause",
                "w-8 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <Play className="h-2 w-2" />
            </button>
            <button
              onClick={() => handleButtonClick("forward")}
              className={getButtonClass(
                "forward",
                "w-8 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-md",
              )}
            >
              <SkipForward className="h-2 w-2" />
            </button>
          </div>
        </div>

        {/* Remote Brand */}
        <div className="text-center flex-shrink-0">
          <span className="text-gray-500 text-xs font-semibold">
            {remote?.name || remote?.model || remote?.manufacturer || "OPENBOX"}
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
