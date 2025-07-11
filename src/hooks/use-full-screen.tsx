import { useEffect, useState, useCallback } from "react";

const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(
    typeof document !== "undefined" && !!document.fullscreenElement
  );

  const handleChange = () => {
    setIsFullScreen(!!document.fullscreenElement);
  };

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Failed to exit fullscreen:", err);
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
    };
  }, []);

  return { isFullScreen, toggleFullScreen };
};

export default useFullScreen;
