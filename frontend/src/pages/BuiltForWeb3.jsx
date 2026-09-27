import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiCreditCard,
  FiDollarSign,
  FiShield,
  FiZap,
} from "react-icons/fi";

const features = [
  {
    icon: FiCode,
    title: "Built for Arc",
    description:
      "Fresh Bounty is being shaped around Arc as the infrastructure for a focused on-chain bounty experience.",
  },
  {
    icon: FiDollarSign,
    title: "USDC Rewards",
    description:
      "Use USDC as the reward layer for bounty opportunities, giving creators and contributors a clear reward currency.",
  },
  {
    icon: FiCreditCard,
    title: "Wallet Integration",
    description:
      "Connect your wallet to interact with bounty opportunities, rewards, and your Web3 activity.",
  },
  {
    icon: FiShield,
    title: "On-chain Verification",
    description:
      "Bounty activity and blockchain transactions can be verified on-chain instead of relying entirely on centralized records.",
  },
];

export default function BuiltForWeb3() {
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
    <section
      className={`relative overflow-hidden px-5 py-20 transition-colors duration-500 sm:px-8 lg:px-10 ${
        dark
          ? "bg-[#080908] text-white"
          : "bg-[#f6f5ef] text-[#111111]"
      }`}
      style={{
        backgroundColor: dark ? "#080908" : "#f6f5ef",
      }}
    >
      {/* =====================================================
          SUBTLE ARCHITECTURAL BACKGROUND
      ===================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(
              ${
                dark
                  ? "rgba(212,175,55,0.025)"
                  : "rgba(105,82,35,0.025)"
              } 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              ${
                dark
                  ? "rgba(212,175,55,0.018)"
                  : "rgba(105,82,35,0.02)"
              } 1px,
              transparent 1px
            )
          `,
          backgroundSize: "64px 32px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 88%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 88%)",
        }}
      />

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-2xl text-center">
          {/* BADGE */}

          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-xl transition-colors duration-500"
            style={{
              borderColor: dark
                ? "rgba(212,175,55,0.18)"
                : "rgba(35,31,22,0.08)",
              backgroundColor: dark
                ? "rgba(255,255,255,0.035)"
                : "rgba(255,255,255,0.82)",
              boxShadow: dark
                ? "0 8px 25px rgba(0,0,0,0.18)"
                : "0 8px 25px rgba(35,31,22,0.035)",
            }}
          >
            <FiZap
              size={12}
              className="text-[#B28B20]"
            />

            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                dark ? "text-white/55" : "text-[#77736b]"
              }`}
            >
              Arc Infrastructure
            </span>

            <span
              className={`h-1 w-1 rounded-full ${
                dark ? "bg-white/20" : "bg-black/20"
              }`}
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B28B20]">
              USDC
            </span>
          </div>

          {/* TITLE */}

          <h2
            className={`text-3xl font-bold tracking-[-0.04em] transition-colors duration-500 sm:text-4xl lg:text-5xl ${
              dark ? "text-white" : "text-[#111111]"
            }`}
          >
            Built for{" "}
            <span className="text-[#B28B20]">
              Web3 Work
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className={`mx-auto mt-4 max-w-xl text-sm leading-relaxed transition-colors duration-500 sm:text-base ${
              dark ? "text-white/55" : "text-[#77736b]"
            }`}
          >
            Fresh Bounty combines bounty discovery, wallet interaction,
            and on-chain reward flows into a practical marketplace
            designed around Arc and USDC.
          </p>
        </div>

        {/* =====================================================
            TECHNOLOGY CARDS
        ===================================================== */}

        <div className="mx-auto mt-12 max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative"
                >
                  <div
                    className="relative h-full overflow-hidden rounded-[22px] border p-5 transition-all duration-500 hover:-translate-y-1.5"
                    style={{
                      backgroundColor: dark
                        ? "#111311"
                        : "#ffffff",
                      borderColor: dark
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(35,31,22,0.08)",
                      boxShadow: dark
                        ? "0 14px 40px rgba(0,0,0,0.28)"
                        : "0 14px 40px rgba(35,31,22,0.045)",
                    }}
                  >
                    {/* TOP GOLD ACCENT */}

                    <div
                      className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, #D4AF37, transparent)",
                      }}
                    />

                    {/* SUBTLE GOLD CORNER ACCENT */}

                    <div
                      className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#D4AF37]/[0.035] blur-[55px] opacity-60 transition-all duration-500 group-hover:bg-[#D4AF37]/[0.07] group-hover:opacity-100"
                    />

                    {/* NUMBER */}

                    <div
                      className={`absolute right-4 top-4 text-[10px] font-semibold tracking-widest transition-colors duration-500 ${
                        dark
                          ? "text-white/[0.16]"
                          : "text-black/[0.14]"
                      }`}
                    >
                      0{index + 1}
                    </div>

                    {/* ICON */}

                    <div
                      className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-xl border bg-[#D4AF37]/[0.06] text-[#B28B20] transition-all duration-500 group-hover:scale-110"
                      style={{
                        borderColor: "rgba(212,175,55,0.22)",
                      }}
                    >
                      <Icon
                        size={19}
                        className="transition-transform duration-500"
                      />
                    </div>

                    {/* TITLE */}

                    <h3
                      className={`relative text-base font-semibold transition-colors duration-500 ${
                        dark ? "text-white" : "text-[#171717]"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      className={`relative mt-2 text-xs leading-relaxed transition-colors duration-500 ${
                        dark ? "text-white/50" : "text-[#77736b]"
                      }`}
                    >
                      {feature.description}
                    </p>

                    {/* VERIFIED */}

                    <div className="relative mt-5 flex items-center gap-1.5">
                      <FiCheckCircle
                        size={11}
                        className="text-[#B28B20]"
                      />

                      <span
                        className={`text-[9px] uppercase tracking-[0.12em] transition-colors duration-500 ${
                          dark
                            ? "text-white/35"
                            : "text-[#99958c]"
                        }`}
                      >
                        Arc / Web3 enabled
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            TRANSPARENCY PANEL
        ===================================================== */}

        <div className="mx-auto mt-6 max-w-5xl">
          <div
            className="relative overflow-hidden rounded-[22px] border p-5 transition-all duration-500 sm:p-6"
            style={{
              backgroundColor: dark
                ? "#111311"
                : "#ffffff",
              borderColor: dark
                ? "rgba(255,255,255,0.07)"
                : "rgba(35,31,22,0.08)",
              boxShadow: dark
                ? "0 15px 50px rgba(0,0,0,0.3)"
                : "0 15px 50px rgba(35,31,22,0.05)",
            }}
          >
            {/* GOLD ARCHITECTURAL LINE */}

            <div
              className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(212,175,55,0.55), transparent)",
              }}
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* LEFT */}

              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-[#D4AF37]/[0.06]"
                  style={{
                    borderColor: "rgba(212,175,55,0.22)",
                  }}
                >
                  <FiShield
                    size={17}
                    className="text-[#B28B20]"
                  />
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold transition-colors duration-500 ${
                      dark ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    Transparent by design
                  </p>

                  <p
                    className={`mt-1 max-w-xl text-xs leading-relaxed transition-colors duration-500 ${
                      dark ? "text-white/50" : "text-[#77736b]"
                    }`}
                  >
                    Bounty activity and blockchain transactions can be
                    independently verified instead of relying entirely
                    on a centralized payment record.
                  </p>
                </div>
              </div>

              {/* RIGHT STATUS */}

              <div
                className="flex shrink-0 items-center gap-2 self-start rounded-full border bg-[#D4AF37]/[0.045] px-3 py-2 sm:self-auto"
                style={{
                  borderColor: "rgba(212,175,55,0.2)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"
                  style={{
                    boxShadow:
                      "0 0 10px rgba(212,175,55,0.55)",
                  }}
                />

                <span
                  className={`text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                    dark ? "text-white/50" : "text-[#77736b]"
                  }`}
                >
                  Arc / USDC
                </span>

                <FiArrowUpRight
                  size={11}
                  className="text-[#B28B20]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM SYSTEM LABEL
        ===================================================== */}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B28B20]">
            ARC
          </span>

          <span
            className={`h-1 w-1 rounded-full ${
              dark ? "bg-white/20" : "bg-black/20"
            }`}
          />

          <span
            className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/40" : "text-[#8b8880]"
            }`}
          >
            USDC
          </span>

          <span
            className={`h-1 w-1 rounded-full ${
              dark ? "bg-white/20" : "bg-black/20"
            }`}
          />

          <span
            className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/40" : "text-[#8b8880]"
            }`}
          >
            BOUNTY INFRASTRUCTURE
          </span>

          <span
            className={`h-1 w-1 rounded-full ${
              dark ? "bg-white/20" : "bg-black/20"
            }`}
          />

          <span
            className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${
              dark ? "text-white/40" : "text-[#8b8880]"
            }`}
          >
            ON-CHAIN
          </span>
        </div>
      </div>

      {/* =====================================================
          REDUCED MOTION
      ===================================================== */}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .group {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}