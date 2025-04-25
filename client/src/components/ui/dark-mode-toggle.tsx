import * as Switch from "@radix-ui/react-switch";
import { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div className="flex items-center gap-3">
      <Switch.Root
        className="w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full relative flex items-center px-1 transition-colors"
        checked={darkMode}
        onCheckedChange={setDarkMode}
      >
        <Switch.Thumb className="w-4 h-4 flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-full transition-transform translate-x-0 dark:translate-x-4">
          {darkMode ? "🌙" : "🌞"}
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
};

export default DarkModeToggle;