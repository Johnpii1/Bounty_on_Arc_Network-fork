import { useEffect, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const VISIBILITY_THRESHOLD = 480;

function ScrollToTopButton() {
  const lastScrollY = useRef(0);
  const animationFrame = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;

      setIsVisible(
        currentScrollY > VISIBILITY_THRESHOLD && isScrollingUp,
      );
      lastScrollY.current = currentScrollY;
      animationFrame.current = undefined;
    };

    const handleScroll = () => {
      if (!animationFrame.current) {
        animationFrame.current = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame.current) {
        window.cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className={`fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#111311] text-white shadow-[0_12px_30px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#D4AF37] hover:shadow-[0_15px_32px_rgba(212,175,55,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 dark:ring-offset-[#080908] sm:bottom-8 sm:right-8 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <FiArrowUp className="h-5 w-5" aria-hidden="true" />
      <span className="sr-only">Back to top</span>
    </button>
  );
}

export default ScrollToTopButton;
