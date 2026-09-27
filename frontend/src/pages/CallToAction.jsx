
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNav } from "../hooks/useNav";
import {
  FiArrowUpRight,
  FiCheck,
  FiCode,
  FiDollarSign,
  FiLayers,
  FiPlus,
  FiShield,
  FiZap,
} from "react-icons/fi";

function CallToAction() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
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
      const { handleNavigate } = useNav();


  return (
    <section
      className={`relative z-10 mx-4 my-14 transition-colors duration-500 md:mx-8 md:my-16 lg:mx-14`}
    >
      <style>
        {`
          @keyframes ctaScan {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(420%);
            }
          }

          @keyframes ctaPulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.5;
            }

            50% {
              transform: scale(1.5);
              opacity: 1;
            }
          }

          @keyframes ctaFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-5px);
            }
          }

          .cta-scan {
            animation: ctaScan 5s linear infinite;
          }

          .cta-pulse {
            animation: ctaPulse 2s ease-in-out infinite;
          }

          .cta-float {
            animation: ctaFloat 4s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .cta-scan,
            .cta-pulse,
            .cta-float {
              animation: none;
            }
          }
        `}
      </style>

      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] border transition-all duration-500"
        style={{
          backgroundColor: dark ? "#111311" : "#ffffff",
          borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
          boxShadow: dark
            ? "0 20px 70px rgba(0,0,0,0.32)"
            : "0 20px 70px rgba(0,0,0,0.07)",
        }}
      >
        {/* Subtle architectural background */}

        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: dark ? 0.18 : 0.12,
            backgroundImage: dark
              ? "linear-gradient(rgba(212,175,55,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.12) 1px, transparent 1px)"
              : "linear-gradient(rgba(76,58,28,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(76,58,28,0.16) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        {/* Subtle gold accents */}

        <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.025] blur-[90px]" />

        <div className="pointer-events-none absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-[#D4AF37]/[0.025] blur-[90px]" />

        {/* Gold architectural accent */}

        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-[0.08]">
          <div className="absolute right-8 top-8 h-20 w-20 border border-[#6f5424]" />
          <div className="absolute right-14 top-14 h-20 w-20 border border-[#6f5424]" />
        </div>

        <div className="relative z-10 px-5 py-9 text-center sm:px-8 sm:py-11 md:px-12 md:py-12">
          {/* Badge */}

          <div className="mb-5 flex justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-xl transition-colors duration-500"
              style={{
                borderColor: dark
                  ? "rgba(212,175,55,0.2)"
                  : "rgba(212,175,55,0.2)",
                backgroundColor: dark ? "rgba(255,255,255,0.035)" : "#f6f5ef",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="cta-pulse absolute inset-0 rounded-full bg-[#D4AF37]" />

                <span className="relative h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#B28B20]">
                Built for Arc
              </span>

              <span
                className={`h-3 w-px ${dark ? "bg-white/10" : "bg-black/10"}`}
              />

              <span
                className={`text-[9px] font-bold uppercase tracking-[0.18em] ${
                  dark ? "text-white/45" : "text-black/50"
                }`}
              >
                USDC Native
              </span>
            </div>
          </div>

          {/* Heading */}

          <h2
            className={`mx-auto max-w-3xl text-3xl font-black leading-[1.05] tracking-[-0.04em] transition-colors duration-500 sm:text-4xl md:text-5xl ${
              dark ? "text-white" : "text-[#111111]"
            }`}
          >
            Build. Contribute.
            <br />
            <span className="text-[#B28B20]">Get Rewarded.</span>
          </h2>

          {/* Description */}

          <p
            className={`mx-auto mt-4 max-w-xl text-sm leading-6 transition-colors duration-500 md:text-[15px] ${
              dark ? "text-white/55" : "text-black/55"
            }`}
          >
            Discover Web3 opportunities, complete meaningful work, and earn USDC
            rewards. Or create a bounty and find contributors ready to build
            with you.
          </p>

          {/* Compact workflow */}

          <div className="mx-auto mt-7 flex max-w-xl flex-col items-center justify-center gap-3 sm:flex-row">
            {/* CREATE */}

            <div
              className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 shadow-sm backdrop-blur-xl transition-colors duration-500"
              style={{
                borderColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
                backgroundColor: dark ? "#151715" : "#f6f5ef",
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/[0.08]">
                <FiCode className="h-4 w-4 text-[#B28B20]" />
              </div>

              <div className="text-left">
                <p
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    dark ? "text-white/35" : "text-black/35"
                  }`}
                >
                  Create
                </p>

                <p
                  className={`text-xs font-bold ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  Post a Bounty
                </p>
              </div>
            </div>

            <FiArrowUpRight className="hidden h-4 w-4 text-[#B28B20]/40 sm:block" />

            {/* COMPLETE */}

            <div
              className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 shadow-sm backdrop-blur-xl transition-colors duration-500"
              style={{
                borderColor: dark
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(0,0,0,0.07)",
                backgroundColor: dark ? "#151715" : "#f6f5ef",
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/[0.08]">
                <FiLayers className="h-4 w-4 text-[#B28B20]" />
              </div>

              <div className="text-left">
                <p
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    dark ? "text-white/35" : "text-black/35"
                  }`}
                >
                  Complete
                </p>

                <p
                  className={`text-xs font-bold ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  Do the Work
                </p>
              </div>
            </div>

            <FiArrowUpRight className="hidden h-4 w-4 text-[#B28B20]/40 sm:block" />

            {/* EARN */}

            <div
              className="cta-float flex items-center gap-2 rounded-xl border px-3.5 py-2.5 shadow-sm backdrop-blur-xl transition-colors duration-500"
              style={{
                borderColor: dark
                  ? "rgba(212,175,55,0.2)"
                  : "rgba(212,175,55,0.2)",
                backgroundColor: dark ? "#151715" : "#f6f5ef",
              }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/[0.08]">
                <FiDollarSign className="h-4 w-4 text-[#B28B20]" />
              </div>

              <div className="text-left">
                <p
                  className={`text-[9px] font-bold uppercase tracking-wider ${
                    dark ? "text-white/35" : "text-black/35"
                  }`}
                >
                  Earn
                </p>

                <p
                  className={`text-xs font-bold ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  Get USDC
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dashboard"
               onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/dashboard");
                }}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(212,175,55,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B28B20] hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] sm:w-auto"
            >
              <span className="relative z-10">Explore Bounties</span>

              <FiArrowUpRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

              <span className="cta-scan absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>

            <Link
              to="/create"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/40 sm:w-auto"
              style={{
                borderColor: dark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.09)",
                backgroundColor: dark ? "#151715" : "#f6f5ef",
                color: dark ? "#ffffff" : "#111111",
              }}
               onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/dashboard");
                }}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black/[0.09] bg-[#f6f5ef] px-6 py-3 text-sm font-semibold text-[#111111] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-white sm:w-auto"
            >
              <FiPlus
                className={`transition-transform duration-300 group-hover:rotate-90 ${
                  dark ? "text-white/45" : "text-black/45"
                } group-hover:text-[#B28B20]`}
              />

              <span>Create a Bounty</span>
            </Link>
          </div>

          {/* Trust indicators */}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
            <div className="flex items-center gap-1.5">
              <FiShield className="h-3.5 w-3.5 text-[#B28B20]" />

              <span
                className={`text-[9px] font-semibold uppercase tracking-wider ${
                  dark ? "text-white/40" : "text-black/40"
                }`}
              >
                On-chain
              </span>
            </div>

            <div
              className={`h-3 w-px ${dark ? "bg-white/10" : "bg-black/10"}`}
            />

            <div className="flex items-center gap-1.5">
              <FiDollarSign className="h-3.5 w-3.5 text-[#B28B20]" />

              <span
                className={`text-[9px] font-semibold uppercase tracking-wider ${
                  dark ? "text-white/40" : "text-black/40"
                }`}
              >
                USDC Rewards
              </span>
            </div>

            <div
              className={`h-3 w-px ${dark ? "bg-white/10" : "bg-black/10"}`}
            />

            <div className="flex items-center gap-1.5">
              <FiZap className="h-3.5 w-3.5 text-[#B28B20]" />

              <span
                className={`text-[9px] font-semibold uppercase tracking-wider ${
                  dark ? "text-white/40" : "text-black/40"
                }`}
              >
                Arc Powered
              </span>
            </div>

            <div
              className={`h-3 w-px ${dark ? "bg-white/10" : "bg-black/10"}`}
            />

            <div className="flex items-center gap-1.5">
              <FiCheck className="h-3.5 w-3.5 text-[#B28B20]" />

              <span
                className={`text-[9px] font-semibold uppercase tracking-wider ${
                  dark ? "text-white/40" : "text-black/40"
                }`}
              >
                Open Opportunities
              </span>
            </div>
          </div>

          {/* Bottom accent */}

          <div className="mx-auto mt-7 flex max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/30" />

            <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
