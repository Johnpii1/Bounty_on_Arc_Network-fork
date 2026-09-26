import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function Theme() {
  const { dark, setDark } = useTheme();
  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        group relative flex h-10 w-10 items-center justify-center
        overflow-hidden rounded-full border
        transition-all duration-500 ease-out
        ${
          dark
            ? "border-[#D4AF37]/30 bg-[#121212] text-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.12)] hover:bg-[#1a1a1a]"
            : "border-black/10 bg-white text-[#B28B20] shadow-[0_4px_15px_rgba(0,0,0,0.06)] hover:bg-[#faf9f4]"
        }
      `}
    >
      {/* Animated glow */}
      <span
        className={`
          absolute inset-0 rounded-full
          transition-all duration-700 ease-out
          ${
            dark
              ? "scale-100 bg-[#D4AF37]/10 opacity-100"
              : "scale-0 bg-[#D4AF37]/10 opacity-0"
          }
        `}
      />

      {/* Rotating icon */}
      <span
        className={`
          relative z-10 flex items-center justify-center
          transition-all duration-500 ease-out
          ${dark ? "rotate-0 scale-100" : "rotate-[180deg] scale-100"}
        `}
      >
        {dark ? (
          <FiSun className="text-lg transition-all duration-500" />
        ) : (
          <FiMoon className="text-lg transition-all duration-500" />
        )}
      </span>

      {/* Small hover ring */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-full
          border border-transparent
          transition-all duration-300
          group-hover:scale-110
          group-hover:border-[#D4AF37]/20
        "
      />
    </button>
  );
}
