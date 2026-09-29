
import { useEffect, useState } from "react";

function LiveTricker() {
  const items = [
    { label: "Built for Arc", type: "ARC" },
    { label: "Earn USDC Rewards", type: "USDC" },
    { label: "Complete On-Chain Bounties", type: "BOUNTY" },
    { label: "Fast USDC Payouts", type: "PAYOUT" },
    { label: "New Bounties Added Daily", type: "NEW" },
  ];

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`
        relative mt-1 w-full overflow-hidden
        border-y
        transition-all duration-500
        ${
          dark
            ? "border-white/[0.07] bg-[#080908]"
            : "border-black/[0.07] bg-white"
        }
      `}
    >
      {/* =====================================================
          SUBTLE BACKGROUND DOTS
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
        <span className="ticker-bg-dot dot-1" />
        <span className="ticker-bg-dot dot-2" />
        <span className="ticker-bg-dot dot-3" />
        <span className="ticker-bg-dot dot-4" />
        <span className="ticker-bg-dot dot-5" />
        <span className="ticker-bg-dot dot-6" />
        <span className="ticker-bg-dot dot-7" />
        <span className="ticker-bg-dot dot-8" />
        <span className="ticker-bg-dot dot-9" />
        <span className="ticker-bg-dot dot-10" />

        <div
          className={`
            absolute inset-0
            transition-all duration-500
            ${
              dark
                ? "bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.055),transparent_65%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.025),transparent_65%)]"
            }
          `}
        />
      </div>

      {/* =====================================================
          LEFT FADE
      ====================================================== */}

      <div
        className={`
          pointer-events-none absolute
          bottom-0 left-0 top-0
          z-30 w-24
          bg-gradient-to-r
          to-transparent
          transition-all duration-500
          ${
            dark
              ? "from-[#080908] via-[#080908]/95"
              : "from-white via-white/95"
          }
        `}
      />

      {/* =====================================================
          RIGHT FADE
      ====================================================== */}

      <div
        className={`
          pointer-events-none absolute
          bottom-0 right-0 top-0
          z-30 w-24
          bg-gradient-to-l
          to-transparent
          transition-all duration-500
          ${
            dark
              ? "from-[#080908] via-[#080908]/95"
              : "from-white via-white/95"
          }
        `}
      />

      {/* =====================================================
          SUBTLE CENTER ACCENT
      ====================================================== */}

      <div
        className={`
          pointer-events-none absolute
          left-1/2 top-1/2
          z-0 h-8 w-96
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#D4AF37]/[0.04]
          blur-3xl
        `}
      />

      {/* =====================================================
          TICKER
      ====================================================== */}

      <div className="ticker-track relative z-10">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="ticker-content">
            {items.map((item, i) => (
              <div key={i} className="ticker-item">
                {/* STATUS DOT */}

                <span className="status-dot" />

                {/* MAIN LABEL */}

                <span className="ticker-label">
                  {item.label}
                </span>

                {/* CATEGORY */}

                <span className="ticker-category">
                  {item.type}
                </span>

                {/* SEPARATOR */}

                <span className="ticker-separator">
                  /
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        /* =====================================================
           TICKER TRACK
        ====================================================== */

        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 28s linear infinite;
          will-change: transform;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        .ticker-content {
          display: flex;
          align-items: center;
          padding-right: 20px;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 18px;
          white-space: nowrap;
        }

        /* =====================================================
           MAIN TEXT
        ====================================================== */

        .ticker-label {
          color: ${dark ? "#ffffff" : "#111111"};
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.015em;
          transition: color 0.5s ease;
        }

        /* =====================================================
           CATEGORY
        ====================================================== */

        .ticker-category {
          padding: 3px 7px;
          border-radius: 9999px;

          color: ${dark ? "#D4AF37" : "#8a6b16"};

          background: ${
            dark
              ? "rgba(212, 175, 55, 0.10)"
              : "rgba(212, 175, 55, 0.055)"
          };

          border: 1px solid ${
            dark
              ? "rgba(212, 175, 55, 0.30)"
              : "rgba(212, 175, 55, 0.20)"
          };

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;

          transition:
            color 0.5s ease,
            background 0.5s ease,
            border-color 0.5s ease;
        }

        /* =====================================================
           SEPARATOR
        ====================================================== */

        .ticker-separator {
          margin-left: 8px;

          color: ${
            dark
              ? "rgba(212, 175, 55, 0.45)"
              : "rgba(212, 175, 55, 0.30)"
          };

          font-size: 18px;
          font-weight: 500;

          transition: color 0.5s ease;
        }

        /* =====================================================
           STATUS DOT
        ====================================================== */

        .status-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #D4AF37;

          box-shadow:
            0 0 7px rgba(212, 175, 55, 0.45),
            0 0 14px rgba(212, 175, 55, 0.12);

          animation: goldPulse 2.5s ease-in-out infinite;
        }

        /* =====================================================
           BACKGROUND DOTS
        ====================================================== */

        .ticker-bg-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #D4AF37;

          box-shadow:
            0 0 8px rgba(212, 175, 55, 0.3);

          opacity: ${dark ? "0.25" : "0.18"};

          transition: opacity 0.5s ease;
        }

        .dot-1 {
          left: 7%;
          top: 25%;
          animation: bgDotFloat 5s ease-in-out infinite;
        }

        .dot-2 {
          left: 18%;
          top: 70%;
          animation: bgDotFloat 6s ease-in-out infinite 0.5s;
        }

        .dot-3 {
          left: 31%;
          top: 35%;
          animation: bgDotFloat 4.5s ease-in-out infinite 1s;
        }

        .dot-4 {
          left: 44%;
          top: 72%;
          animation: bgDotFloat 5.5s ease-in-out infinite 1.5s;
        }

        .dot-5 {
          left: 57%;
          top: 28%;
          animation: bgDotFloat 6s ease-in-out infinite 0.8s;
        }

        .dot-6 {
          left: 67%;
          top: 68%;
          animation: bgDotFloat 4.8s ease-in-out infinite 1.2s;
        }

        .dot-7 {
          left: 76%;
          top: 30%;
          animation: bgDotFloat 5.8s ease-in-out infinite 0.3s;
        }

        .dot-8 {
          left: 84%;
          top: 73%;
          animation: bgDotFloat 4.5s ease-in-out infinite 1.8s;
        }

        .dot-9 {
          left: 92%;
          top: 40%;
          animation: bgDotFloat 5.2s ease-in-out infinite 0.6s;
        }

        .dot-10 {
          left: 53%;
          top: 52%;
          width: 2px;
          height: 2px;
          animation: bgDotFloat 4s ease-in-out infinite 1.4s;
        }

        /* =====================================================
           TICKER MOVEMENT
        ====================================================== */

        @keyframes tickerScroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-33.333333%);
          }
        }

        /* =====================================================
           GOLD PULSE
        ====================================================== */

        @keyframes goldPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        /* =====================================================
           BACKGROUND DOT MOTION
        ====================================================== */

        @keyframes bgDotFloat {
          0%,
          100% {
            opacity: 0.1;
            transform: translate3d(0, 0, 0) scale(0.8);
          }

          50% {
            opacity: 0.45;
            transform: translate3d(0, -5px, 0) scale(1.25);
          }
        }

        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 640px) {
          .ticker-item {
            padding: 12px 14px;
            gap: 8px;
          }

          .ticker-label {
            font-size: 12px;
            font-weight: 800;
          }

          .ticker-category {
            font-size: 8px;
          }

          .ticker-track {
            animation-duration: 22s;
          }

          .ticker-separator {
            font-size: 16px;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }

          .status-dot,
          .ticker-bg-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default LiveTricker;
