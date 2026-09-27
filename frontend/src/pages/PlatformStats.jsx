import { useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiDollarSign,
  FiLayers,
  FiZap,
} from "react-icons/fi";

const platformHighlights = [
  {
    icon: FiLayers,
    value: "ARC",
    label: "Built for Arc",
    description:
      "A bounty experience designed around Arc's fast, USDC-native on-chain environment.",
    accent: "gold",
  },
  {
    icon: FiDollarSign,
    value: "USDC",
    label: "Reward Currency",
    description:
      "Creators can fund bounties and contributors can earn rewards using USDC.",
    accent: "gold",
  },
  {
    icon: FiCode,
    value: "ON-CHAIN",
    label: "Bounty Workflow",
    description:
      "Connect wallets, fund opportunities, complete work, and move toward verifiable settlement.",
    accent: "gold",
  },
  {
    icon: FiZap,
    value: "24/7",
    label: "Open Opportunities",
    description:
      "A continuous marketplace for creators and contributors to discover and complete Web3 work.",
    accent: "gold",
  },
];

const PlatformStats = () => {
  const sectionRef = useRef(null);

  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const [isVisible, setIsVisible] = useState(false);

  /* =========================================================
     GLOBAL THEME DETECTION
  ========================================================= */

  useEffect(() => {
    const updateTheme = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /* =========================================================
     SECTION VISIBILITY
  ========================================================= */

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={`platform-stats-section ${
          dark ? "platform-stats-dark" : "platform-stats-light"
        }`}
      >
        {/* =====================================================
            SUBTLE ARC / USDC BACKGROUND
        ===================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* GOLD GLOW */}

          <div
            className="absolute left-[-180px] top-[8%] h-[420px] w-[420px] rounded-full blur-[150px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.10), transparent 70%)",
            }}
          />

          {/* SOFT GOLD GLOW */}

          <div
            className="absolute bottom-[-180px] right-[-130px] h-[430px] w-[430px] rounded-full blur-[150px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.065), transparent 70%)",
            }}
          />

          {/* CENTER LIGHT */}

          <div
            className="absolute left-1/2 top-[42%] h-[320px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.045), transparent 70%)",
            }}
          />

          {/* SUBTLE ARCHITECTURAL LINES */}

          <div className="arc-brick-pattern absolute inset-0 opacity-60" />
        </div>

        {/* =====================================================
            MAIN CONTAINER
        ===================================================== */}

        <div className="platform-stats-inner">
          {/* ===================================================
              HEADER
          =================================================== */}

          <div className="mx-auto max-w-3xl text-center">
            {/* ARC BADGE */}

            <div className="arc-section-badge mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border px-3.5 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-40" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>

              <span
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  dark ? "text-white/55" : "text-[#1f2937]"
                }`}
              >
                Built for Arc
              </span>

              <span
                className={`h-3 w-px transition-colors duration-300 ${
                  dark ? "bg-white/10" : "bg-black/10"
                }`}
              />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B28B20]">
                USDC Native
              </span>
            </div>

            {/* TITLE */}

            <h2
              className={`text-3xl font-bold tracking-[-0.04em] transition-colors duration-300 sm:text-4xl lg:text-5xl ${
                dark ? "text-white" : "text-[#111111]"
              }`}
            >
              Built for the{" "}
              <span className="arc-gradient-text">
                future of Web3 work.
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className={`mx-auto mt-5 max-w-2xl text-sm leading-7 transition-colors duration-300 sm:text-base ${
                dark ? "text-white/50" : "text-[#66645f]"
              }`}
            >
              Happy Bounty connects creators and contributors through on-chain
              opportunities, with Arc and USDC powering a simple path from
              funded bounty to completed work.
            </p>
          </div>

          {/* ===================================================
              HIGHLIGHT CARDS
          =================================================== */}

          <div className="mx-auto mt-12 max-w-6xl">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {platformHighlights.map((item, index) => {
                const Icon = item.icon;

                const accentStyles = {
                  gold: {
                    border: "rgba(212,175,55,0.22)",
                    background: "rgba(212,175,55,0.075)",
                    color: "#B28B20",
                    glow: "rgba(212,175,55,0.16)",
                  },
                };

                const accent = accentStyles[item.accent];

                return (
                  <div
                    key={item.label}
                    className={`highlight-card highlight-card-${index + 1} ${
                      isVisible ? "highlight-card-visible" : ""
                    } group`}
                  >
                    <div
                      className="highlight-card-shell relative h-full overflow-hidden rounded-[24px] border p-6 transition-all duration-500"
                      style={{
                        borderColor: accent.border,
                        background: dark
                          ? "linear-gradient(145deg, rgba(20,22,20,0.98), rgba(15,17,15,0.94))"
                          : "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(248,246,238,0.90))",
                        boxShadow: dark
                          ? "0 18px 50px rgba(0,0,0,0.30)"
                          : "0 18px 50px rgba(35,31,22,0.07)",
                      }}
                    >
                      {/* MOVING LIGHT */}

                      <div className="card-light-sweep pointer-events-none absolute inset-y-0 -left-[80%] w-[55%]" />

                      {/* TOP ACCENT */}

                      <div
                        className="absolute left-6 right-6 top-0 h-px opacity-80"
                        style={{
                          background: `linear-gradient(
                            to right,
                            transparent,
                            ${accent.color},
                            transparent
                          )`,
                        }}
                      />

                      {/* CORNER GLOW */}

                      <div
                        className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full blur-[65px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{
                          background: accent.glow,
                        }}
                      />

                      {/* NUMBER */}

                      <div
                        className={`absolute right-5 top-5 text-[10px] font-bold tracking-[0.22em] transition-colors duration-300 ${
                          dark ? "text-white/[0.10]" : "text-black/[0.12]"
                        }`}
                      >
                        0{index + 1}
                      </div>

                      {/* ICON */}

                      <div
                        className="relative mb-7 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105"
                        style={{
                          borderColor: accent.border,
                          backgroundColor: accent.background,
                          boxShadow: `0 10px 30px ${accent.glow}`,
                        }}
                      >
                        <Icon
                          size={20}
                          style={{
                            color: accent.color,
                          }}
                        />
                      </div>

                      {/* VALUE */}

                      <div className="relative">
                        <div
                          className="text-[27px] font-black tracking-[-0.04em]"
                          style={{
                            color:
                              item.value === "USDC" ||
                              item.value === "ARC"
                                ? "#B28B20"
                                : dark
                                  ? "#ffffff"
                                  : "#111111",
                          }}
                        >
                          {item.value}
                        </div>

                        <p
                          className={`mt-2 text-sm font-bold transition-colors duration-300 ${
                            dark ? "text-white" : "text-[#252525]"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p
                          className={`mt-3 text-xs leading-[1.8] transition-colors duration-300 ${
                            dark ? "text-white/45" : "text-[#77736b]"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div className="relative mt-7 flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: accent.color,
                            boxShadow: `0 0 10px ${accent.glow}`,
                          }}
                        />

                        <span
                          className={`text-[9px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 ${
                            dark ? "text-white/30" : "text-[#99958c]"
                          }`}
                        >
                          Arc ecosystem
                        </span>

                        <FiArrowUpRight
                          size={11}
                          className={`ml-auto transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
                            dark ? "text-white/25" : "text-[#aaa69d]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================================
              ARC / USDC BOTTOM PANEL
          =================================================== */}

          <div className="mx-auto mt-6 max-w-6xl">
            <div className="arc-bottom-panel relative overflow-hidden rounded-[24px] border p-5 sm:p-6">
              {/* GOLD LIGHT */}

              <div className="pointer-events-none absolute left-[18%] top-0 h-[160px] w-[300px] rounded-full bg-[#D4AF37]/[0.07] blur-[90px]" />

              {/* SOFT GOLD LIGHT */}

              <div className="pointer-events-none absolute bottom-[-80px] right-[10%] h-[180px] w-[280px] rounded-full bg-[#D4AF37]/[0.05] blur-[90px]" />

              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                {/* LEFT */}

                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07]">
                    <FiCheckCircle size={18} className="text-[#B28B20]" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-sm font-bold transition-colors duration-300 ${
                          dark ? "text-white" : "text-[#151515]"
                        }`}
                      >
                        One workflow. Built around USDC.
                      </p>

                      <span className="rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#B28B20]">
                        ARC
                      </span>
                    </div>

                    <p
                      className={`mt-1 max-w-2xl text-xs leading-relaxed transition-colors duration-300 ${
                        dark ? "text-white/45" : "text-[#77736b]"
                      }`}
                    >
                      From discovering a bounty to completing the work and
                      receiving rewards, Happy Bounty is being shaped around a
                      fast, transparent and USDC-focused Web3 experience.
                    </p>
                  </div>
                </div>

                {/* RIGHT */}

                <div
                  className={`flex shrink-0 items-center gap-2 self-start rounded-full border px-3.5 py-2.5 shadow-sm transition-colors duration-300 sm:self-auto ${
                    dark
                      ? "border-[#D4AF37]/15 bg-[#151715]"
                      : "border-[#D4AF37]/15 bg-white/70"
                  }`}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-[#D4AF37]/40" />

                    <span className="relative h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  </span>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                      dark ? "text-white/40" : "text-[#68655e]"
                    }`}
                  >
                    Arc / USDC
                  </span>

                  <FiArrowUpRight size={11} className="text-[#B28B20]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================
          ANIMATIONS + VISUAL SYSTEM
      ======================================================= */}

      <style>{`
        .platform-stats-section {
          position: relative;
          width: 100%;
          padding: 96px 24px;
          overflow: hidden;
          transition:
            background 300ms ease,
            color 300ms ease;
        }

        .platform-stats-light {
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(212, 175, 55, 0.055),
              transparent 34%
            ),
            linear-gradient(
              180deg,
              #faf9f5 0%,
              #ffffff 50%,
              #f7f3e7 100%
            );
          color: #111111;
        }

        .platform-stats-dark {
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(212, 175, 55, 0.07),
              transparent 34%
            ),
            linear-gradient(
              180deg,
              #080908 0%,
              #0b0d0b 50%,
              #080908 100%
            );
          color: #ffffff;
        }

        .platform-stats-inner {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ========================================
           SUBTLE GOLD ARCHITECTURAL TEXTURE
        ======================================== */

        .arc-brick-pattern {
          background-image:
            linear-gradient(
              rgba(104, 80, 30, 0.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(104, 80, 30, 0.035) 1px,
              transparent 1px
            );
          background-size: 64px 32px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 75%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            black,
            transparent 75%
          );
          transition: opacity 300ms ease;
        }

        .platform-stats-dark .arc-brick-pattern {
          background-image:
            linear-gradient(
              rgba(212, 175, 55, 0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(212, 175, 55, 0.04) 1px,
              transparent 1px
            );
          opacity: 0.45;
        }

        /* ========================================
           BADGE
        ======================================== */

        .arc-section-badge {
          border-color: rgba(212, 175, 55, 0.20);
          background: rgba(255, 255, 255, 0.78);
          box-shadow:
            0 8px 30px rgba(212, 175, 55, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(14px);
          transition:
            background 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease;
        }

        .platform-stats-dark .arc-section-badge {
          background: rgba(255, 255, 255, 0.035);
          border-color: rgba(212, 175, 55, 0.18);
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        /* ========================================
           GOLD GRADIENT TITLE
        ======================================== */

        .arc-gradient-text {
          background: linear-gradient(
            100deg,
            #9a7414 0%,
            #b28b20 35%,
            #d4af37 68%,
            #e2c45b 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* ========================================
           CARD INITIAL STATE

           IMPORTANT:
           The animation is now controlled by React
           state instead of .highlights-visible.
           Theme changes therefore cannot reset the
           cards to opacity: 0.
        ======================================== */

        @media (min-width: 768px) {
          .highlight-card {
            opacity: 0;
            transform:
              translateY(38px)
              scale(0.965);
            filter: blur(7px);
          }

          .highlight-card-visible {
            animation:
              arcCardReveal
              0.9s
              cubic-bezier(.22, 1, .36, 1)
              forwards;
          }

          .highlight-card-1.highlight-card-visible {
            animation-delay: 0.05s;
          }

          .highlight-card-2.highlight-card-visible {
            animation-delay: 0.15s;
          }

          .highlight-card-3.highlight-card-visible {
            animation-delay: 0.25s;
          }

          .highlight-card-4.highlight-card-visible {
            animation-delay: 0.35s;
          }
        }

        @keyframes arcCardReveal {
          0% {
            opacity: 0;
            transform:
              translateY(38px)
              scale(0.965);
            filter: blur(7px);
          }

          65% {
            opacity: 1;
            transform:
              translateY(-5px)
              scale(1.008);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
            filter: blur(0);
          }
        }

        /* ========================================
           CARD HOVER
        ======================================== */

        .highlight-card-shell {
          isolation: isolate;
        }

        .highlight-card-shell::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(212, 175, 55, 0.075),
              transparent 45%
            );
          transition: opacity 500ms ease;
        }

        .highlight-card:hover .highlight-card-shell {
          transform: translateY(-7px);
        }

        .platform-stats-light
          .highlight-card:hover
          .highlight-card-shell {
          box-shadow:
            0 24px 60px rgba(35, 31, 22, 0.11),
            0 0 0 1px rgba(212, 175, 55, 0.08);
        }

        .platform-stats-dark
          .highlight-card:hover
          .highlight-card-shell {
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.42),
            0 0 0 1px rgba(212, 175, 55, 0.12);
        }

        .highlight-card:hover
          .highlight-card-shell::after {
          opacity: 1;
        }

        /* ========================================
           LIGHT SWEEP
        ======================================== */

        .card-light-sweep {
          z-index: 2;
          background: linear-gradient(
            100deg,
            transparent,
            rgba(255, 255, 255, 0.75),
            transparent
          );
          transform: skewX(-18deg);
          opacity: 0;
        }

        .platform-stats-dark .card-light-sweep {
          background: linear-gradient(
            100deg,
            transparent,
            rgba(212, 175, 55, 0.16),
            transparent
          );
        }

        .highlight-card:hover .card-light-sweep {
          opacity: 1;
          animation: cardLightSweep 1s
            cubic-bezier(.22, 1, .36, 1);
        }

        @keyframes cardLightSweep {
          0% {
            left: -80%;
          }

          100% {
            left: 135%;
          }
        }

        /* ========================================
           BOTTOM PANEL
        ======================================== */

        .arc-bottom-panel {
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.97),
              rgba(247, 246, 239, 0.92)
            );
          border-color: rgba(20, 20, 20, 0.08);
          box-shadow:
            0 20px 60px rgba(35, 31, 22, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(18px);
          transition:
            background 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease;
        }

        .platform-stats-dark .arc-bottom-panel {
          background:
            linear-gradient(
              135deg,
              rgba(20, 22, 20, 0.98),
              rgba(14, 16, 14, 0.94)
            );
          border-color: rgba(255, 255, 255, 0.07);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        /* ========================================
           MOBILE
        ======================================== */

        @media (max-width: 767px) {
          .platform-stats-section {
            padding: 76px 20px;
          }

          .highlight-card {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }

          .highlight-card-shell {
            transform: none !important;
          }
        }

        @media (max-width: 640px) {
          .platform-stats-section {
            padding: 68px 18px;
          }

          .arc-brick-pattern {
            background-size: 48px 24px;
          }
        }

        /* ========================================
           REDUCED MOTION
        ======================================== */

        @media (prefers-reduced-motion: reduce) {
          .platform-stats-section *,
          .platform-stats-section *::before,
          .platform-stats-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .highlight-card {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default PlatformStats;