import { useEffect, useRef, useState } from "react";
import {
  FiShield,
  FiGlobe,
  FiZap,
  FiActivity,
  FiCheck,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { useNav } from "../hooks/useNav";

function Features() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { handleNavigate } = useNav();

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  // Detect global dark mode from <html class="dark">
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

  // Section visibility animation
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes featuresFadeUp {
            from {
              opacity: 0;
              transform: translateY(45px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes featuresFadeDown {
            from {
              opacity: 0;
              transform: translateY(-25px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes featuresShine {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(120%);
            }
          }

          @keyframes featuresPulse {
            0%,
            100% {
              opacity: 0.45;
              transform: scale(1);
            }

            50% {
              opacity: 1;
              transform: scale(1.25);
            }
          }

          .features-header-animation {
            opacity: 0;
          }

          .features-header-animation.visible {
            animation: featuresFadeDown 0.8s ease-out forwards;
          }

          .features-card-animation {
            opacity: 0;
          }

          .features-card-animation.visible {
            animation:
              featuresFadeUp
              0.8s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          .features-shine {
            position: absolute;
            inset: 0;
            width: 45%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.7),
              transparent
            );
            transform: translateX(-120%);
            pointer-events: none;
          }

          .group:hover .features-shine {
            animation: featuresShine 1s ease-out;
          }

          .features-status-dot {
            animation: featuresPulse 2.4s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .features-header-animation,
            .features-card-animation {
              opacity: 1;
              animation: none !important;
              transform: none !important;
            }

            .features-shine,
            .features-status-dot {
              animation: none !important;
            }
          }
        `}
      </style>

      <section
        ref={sectionRef}
        className={`relative z-10 my-24 overflow-hidden px-6 py-4 transition-colors duration-500 md:px-10 lg:px-16 ${
          dark ? "bg-[#080908]" : "bg-[#f6f5ef]"
        }`}
      >
        {/* =========================================
            BACKGROUND
        ========================================== */}

        <div
          className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${
            dark ? "bg-[#080908]" : "bg-[#f6f5ef]"
          }`}
        />

        <div className="relative mx-auto max-w-7xl">
          {/* =========================================
              HEADER
          ========================================== */}

          <div
            className={`features-header-animation ${
              isVisible ? "visible" : ""
            } mx-auto mb-14 max-w-3xl text-center`}
          >
            {/* LABEL */}

            <div
              className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-[0_8px_25px_rgba(35,31,22,0.035)] backdrop-blur-xl transition-all duration-500"
              style={{
                borderColor: dark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.08)",
                backgroundColor: dark
                  ? "rgba(255,255,255,0.035)"
                  : "#ffffff",
                boxShadow: dark
                  ? "0 8px 25px rgba(0,0,0,0.18)"
                  : "0 8px 25px rgba(35,31,22,0.035)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-30" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>

              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                  dark ? "text-white/45" : "text-[#77736b]"
                }`}
              >
                Built for Arc
              </span>

              <span
                className={`h-1 w-1 rounded-full transition-colors duration-500 ${
                  dark ? "bg-white/15" : "bg-black/20"
                }`}
              />

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#B28B20]">
                USDC Native
              </span>
            </div>

            {/* TITLE */}

            <h2
              className={`text-4xl font-bold tracking-[-0.04em] transition-colors duration-500 md:text-5xl ${
                dark ? "text-white" : "text-[#111111]"
              }`}
            >
              Everything You Need to{" "}
              <span className="text-[#B28B20]">Earn</span>
            </h2>

<p
  className={`mx-auto mt-5 max-w-2xl text-sm leading-7 transition-colors duration-500 md:text-base ${
    dark ? "text-white/50" : "text-[#77736b]"
  }`}
>
  Fresh Bounty connects creators and contributors through on-chain
  opportunities, with Arc and USDC powering a faster way to fund,
  complete, and reward Web3 work.
</p>
          </div>

          {/* =========================================
              FEATURE GRID
          ========================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* =========================================
                USDC REWARDS
            ========================================== */}

            <div
              className={`features-card-animation ${
                isVisible ? "visible" : ""
              } group relative overflow-hidden rounded-[26px] border p-7 transition-all duration-500 hover:-translate-y-2`}
              style={{
                animationDelay: "150ms",
                backgroundColor: dark ? "#111311" : "#ffffff",
                borderColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.08)",
                boxShadow: dark
                  ? "0 15px 45px rgba(0,0,0,0.28)"
                  : "0 15px 45px rgba(35,31,22,0.045)",
              }}
            >
              <div className="features-shine" />

              <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] text-[#B28B20] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#D4AF37]/45 group-hover:bg-[#D4AF37]/[0.10]">
                  <FiZap className="h-6 w-6" />
                </div>

                <div className="mt-7">
                  <h3
                    className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${
                      dark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    USDC Rewards
                  </h3>

                  <div className="mt-4 h-px w-10 bg-[#D4AF37]/70 transition-all duration-500 group-hover:w-16" />

      <p
  className={`mt-4 text-sm leading-6 transition-colors duration-500 ${
    dark ? "text-white/50" : "text-[#77736b]"
  }`}
>
  Complete approved bounties and work toward earning rewards
  through a USDC-powered bounty experience.
</p>
                </div>

                <div
                  className={`mt-7 flex items-center gap-2 border-t pt-5 text-xs font-medium transition-colors duration-500 ${
                    dark
                      ? "border-white/[0.07] text-white/45"
                      : "border-black/[0.06] text-[#77736b]"
                  }`}
                >
                  <FiCheck className="h-4 w-4 text-[#B28B20]" />
                  <span>USDC reward flow</span>
                </div>
              </div>
            </div>

            {/* =========================================
                BUILT ON ARC
            ========================================== */}

            <div
              className={`features-card-animation ${
                isVisible ? "visible" : ""
              } group relative overflow-hidden rounded-[26px] border p-7 transition-all duration-500 hover:-translate-y-2`}
              style={{
                animationDelay: "300ms",
                backgroundColor: dark ? "#111311" : "#ffffff",
                borderColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.08)",
                boxShadow: dark
                  ? "0 15px 45px rgba(0,0,0,0.28)"
                  : "0 15px 45px rgba(35,31,22,0.045)",
              }}
            >
              <div className="features-shine" />

              <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] text-[#B28B20] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-[#D4AF37]/45 group-hover:bg-[#D4AF37]/[0.10]">
                  <FiGlobe className="h-6 w-6" />
                </div>

                <div className="mt-7">
                  <h3
                    className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${
                      dark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Built on Arc
                  </h3>

                  <div className="mt-4 h-px w-10 bg-[#D4AF37]/70 transition-all duration-500 group-hover:w-16" />

         <p
  className={`mt-4 text-sm leading-6 transition-colors duration-500 ${
    dark ? "text-white/50" : "text-[#77736b]"
  }`}
>
  A bounty experience designed around Arc, giving creators and
  contributors a focused on-chain environment for Web3 work.
</p>
                </div>

                <div
                  className={`mt-7 flex items-center gap-2 border-t pt-5 text-xs font-medium transition-colors duration-500 ${
                    dark
                      ? "border-white/[0.07] text-white/45"
                      : "border-black/[0.06] text-[#77736b]"
                  }`}
                >
                  <FiCheck className="h-4 w-4 text-[#B28B20]" />
                  <span>Arc-powered workflow</span>
                </div>
              </div>
            </div>

            {/* =========================================
                SECURE BOUNTIES
            ========================================== */}

            <div
              className={`features-card-animation ${
                isVisible ? "visible" : ""
              } group relative overflow-hidden rounded-[26px] border p-7 transition-all duration-500 hover:-translate-y-2`}
              style={{
                animationDelay: "450ms",
                backgroundColor: dark ? "#111311" : "#ffffff",
                borderColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.08)",
                boxShadow: dark
                  ? "0 15px 45px rgba(0,0,0,0.28)"
                  : "0 15px 45px rgba(35,31,22,0.045)",
              }}
            >
              <div className="features-shine" />

              <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] text-[#B28B20] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#D4AF37]/45 group-hover:bg-[#D4AF37]/[0.10]">
                  <FiShield className="h-6 w-6" />
                </div>

                <div className="mt-7">
                  <h3
                    className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${
                      dark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Secure Bounties
                  </h3>

                  <div className="mt-4 h-px w-10 bg-[#D4AF37]/70 transition-all duration-500 group-hover:w-16" />

                  <p
                    className={`mt-4 text-sm leading-6 transition-colors duration-500 ${
                      dark ? "text-white/50" : "text-[#77736b]"
                    }`}
                  >
                    Bounty funding and reward flows are designed to keep
                    contributors and creators aligned throughout the work.
                  </p>
                </div>

                <div
                  className={`mt-7 flex items-center gap-2 border-t pt-5 text-xs font-medium transition-colors duration-500 ${
                    dark
                      ? "border-white/[0.07] text-white/45"
                      : "border-black/[0.06] text-[#77736b]"
                  }`}
                >
                  <FiCheck className="h-4 w-4 text-[#B28B20]" />
                  <span>Protected workflow</span>
                </div>
              </div>
            </div>

            {/* =========================================
                ON-CHAIN TRANSPARENCY
            ========================================== */}

            <div
              className={`features-card-animation ${
                isVisible ? "visible" : ""
              } group relative overflow-hidden rounded-[26px] border p-7 transition-all duration-500 hover:-translate-y-2`}
              style={{
                animationDelay: "600ms",
                backgroundColor: dark ? "#111311" : "#ffffff",
                borderColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.08)",
                boxShadow: dark
                  ? "0 15px 45px rgba(0,0,0,0.28)"
                  : "0 15px 45px rgba(35,31,22,0.045)",
              }}
            >
              <div className="features-shine" />

              <div className="absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/[0.06] text-[#B28B20] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-[#D4AF37]/45 group-hover:bg-[#D4AF37]/[0.10]">
                  <FiActivity className="h-6 w-6" />
                </div>

                <div className="mt-7">
                  <h3
                    className={`text-lg font-semibold tracking-tight transition-colors duration-500 ${
                      dark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    On-Chain Transparency
                  </h3>

                  <div className="mt-4 h-px w-10 bg-[#D4AF37]/70 transition-all duration-500 group-hover:w-16" />

            <p
  className={`mt-4 text-sm leading-6 transition-colors duration-500 ${
    dark ? "text-white/50" : "text-[#77736b]"
  }`}
>
  Keep bounty activity, submissions, and reward flows visible
  through a transparent Web3 experience.
</p>
                </div>

                <div
                  className={`mt-7 flex items-center gap-2 border-t pt-5 text-xs font-medium transition-colors duration-500 ${
                    dark
                      ? "border-white/[0.07] text-white/45"
                      : "border-black/[0.06] text-[#77736b]"
                  }`}
                >
                  <FiCheck className="h-4 w-4 text-[#B28B20]" />
                  <span>Visible on-chain activity</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              TRUST BAR
          ========================================== */}

          <div
            className={`features-card-animation ${
              isVisible ? "visible" : ""
            } mt-7 flex flex-col items-center justify-between gap-6 rounded-[24px] border px-6 py-5 shadow-[0_15px_50px_rgba(35,31,22,0.055)] transition-all duration-500 md:flex-row md:px-7`}
            style={{
              animationDelay: "750ms",
              backgroundColor: dark ? "#111311" : "#ffffff",
              borderColor: dark
                ? "rgba(255,255,255,0.07)"
                : "rgba(0,0,0,0.08)",
              boxShadow: dark
                ? "0 15px 50px rgba(0,0,0,0.28)"
                : "0 15px 50px rgba(35,31,22,0.055)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.06] text-[#B28B20] transition-transform duration-300 hover:scale-110">
                <span className="features-status-dot absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.45)]" />

                <FiUsers className="h-5 w-5" />
              </div>

              <div>
                <p
                  className={`text-sm font-semibold transition-colors duration-500 ${
                    dark ? "text-white" : "text-[#171717]"
                  }`}
                >
                  Built for creators & contributors
                </p>

                <p
                  className={`mt-0.5 text-xs transition-colors duration-500 ${
                    dark ? "text-white/45" : "text-[#77736b]"
                  }`}
                >
                  One platform. Arc-powered opportunities. USDC rewards.
                </p>
              </div>
            </div>

         <Link
  to="/dashboard"
  onClick={(e) => {
    e.preventDefault();
    handleNavigate("/dashboard");
  }}
  className={`group flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-white hover:shadow-[0_10px_30px_rgba(212,175,55,0.18)] ${
    dark
      ? "border-[#D4AF37]/30 bg-[#151715] text-[#D4AF37]"
      : "border-[#D4AF37]/30 bg-white text-[#B28B20]"
  }`}
>
  <span>Explore Opportunities</span>
  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
</Link>
          </div>

          {/* =========================================
              ARC / USDC FOOTER LINE
          ========================================== */}

          <div
            className={`features-card-animation ${
              isVisible ? "visible" : ""
            } mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center`}
            style={{ animationDelay: "900ms" }}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B28B20]">
              ARC
            </span>

            <span
              className={`h-1 w-1 rounded-full transition-colors duration-500 ${
                dark ? "bg-white/15" : "bg-black/20"
              }`}
            />

            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                dark ? "text-white/35" : "text-[#8b8880]"
              }`}
            >
              USDC
            </span>

            <span
              className={`h-1 w-1 rounded-full transition-colors duration-500 ${
                dark ? "bg-white/15" : "bg-black/20"
              }`}
            />

            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${
                dark ? "text-white/35" : "text-[#8b8880]"
              }`}
            >
              WEB3 WORK
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;
