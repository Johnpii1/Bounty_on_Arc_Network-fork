
import React, { useEffect, useState } from "react";
import {
  FaTwitter,
  FaDiscord,
  FaGithub,
} from "react-icons/fa";
import {
  FiArrowUp,
  FiCheck,
  FiDollarSign,
} from "react-icons/fi";
import HappyBounty from "../../assets/images/HappyBounty.png";

function Footer() {
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className={`relative mt-16 overflow-hidden border-t transition-colors duration-300 ${
        dark
          ? "border-[#D4AF37]/20 bg-[#080908] text-white"
          : "border-[#D4AF37]/20 bg-white text-[#111111]"
      }`}
    >
      {/* =====================================================
          SUBTLE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-[#D4AF37]/[0.045] blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-[#D4AF37]/[0.035] blur-[110px]" />

      {/* Architectural grid */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          dark ? "opacity-[0.07]" : "opacity-[0.055]"
        }`}
        style={{
          backgroundImage: `
            linear-gradient(
              ${
                dark
                  ? "rgba(212,175,55,0.28)"
                  : "rgba(212,175,55,0.35)"
              } 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              ${
                dark
                  ? "rgba(212,175,55,0.28)"
                  : "rgba(212,175,55,0.35)"
              } 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Gold corner detail */}
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 opacity-[0.12]">
        <div className="absolute right-8 top-8 h-24 w-24 border border-[#D4AF37]" />
        <div className="absolute right-14 top-14 h-24 w-24 border border-[#D4AF37]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6 py-12 md:px-10 lg:px-16">

        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* =====================================================
              BRAND
          ====================================================== */}

          <div className="lg:col-span-1">
            <div className="mb-5 flex items-center gap-3">

              {/* Logo */}
              <div
                className={`group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 ${
                  dark
                    ? "border-[#D4AF37]/20 bg-[#111311] shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:border-[#D4AF37]/50 hover:shadow-[0_12px_30px_rgba(212,175,55,0.14)]"
                    : "border-[#D4AF37]/20 bg-white shadow-[0_8px_25px_rgba(17,17,17,0.05)] hover:border-[#D4AF37]/50 hover:shadow-[0_12px_30px_rgba(212,175,55,0.14)]"
                }`}
              >
                <div className="absolute inset-0 bg-[#D4AF37]/[0.06] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <img
                  src={HappyBounty}
                  alt="Happy Bounty logo"
                  className="relative z-10 h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Brand */}
              <div>
                <h3
                  className={`text-lg font-black tracking-tight transition-colors duration-300 ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  Happy{" "}
                  <span className="text-[#D4AF37]">
                    Bounty
                  </span>
                </h3>

                <p
                  className={`text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                    dark ? "text-white/35" : "text-black/35"
                  }`}
                >
                  Web3 Bounty Platform
                </p>
              </div>
            </div>

            <p
              className={`max-w-xs text-sm leading-6 transition-colors duration-300 ${
                dark ? "text-white/50" : "text-black/50"
              }`}
            >
              A Web3 bounty platform connecting creators and contributors
              through on-chain opportunities and USDC rewards.
            </p>

            {/* Arc / USDC status */}
            <div
              className={`mt-6 flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 transition-colors duration-300 ${
                dark
                  ? "border-[#D4AF37]/20 bg-[#111311] shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                  : "border-[#D4AF37]/20 bg-white shadow-[0_6px_20px_rgba(17,17,17,0.04)]"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-30" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Built for Arc
              </span>

              <span
                className={`h-3 w-px ${
                  dark ? "bg-white/10" : "bg-black/10"
                }`}
              />

              <FiDollarSign className="h-3 w-3 text-[#D4AF37]" />

              <span
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                  dark ? "text-white/40" : "text-black/40"
                }`}
              >
                USDC
              </span>
            </div>
          </div>

          {/* =====================================================
              PLATFORM
          ====================================================== */}

          <div>
            <h4
              className={`mb-5 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                dark ? "text-white" : "text-[#111111]"
              }`}
            >
              Platform
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/dashboard"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Browse Bounties
                </a>
              </li>

              <li>
                <a
                  href="/dashboard"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Categories
                </a>
              </li>

              <li>
                <a
                  href="/leaderboard"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Leaderboard
                </a>
              </li>

              <li>
                <a
                  href="/rewards"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Rewards
                </a>
              </li>
            </ul>
          </div>

          {/* =====================================================
              RESOURCES
          ====================================================== */}

          <div>
            <h4
              className={`mb-5 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                dark ? "text-white" : "text-[#111111]"
              }`}
            >
              Resources
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Documentation
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Blog
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Help Center
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className={`group flex w-fit items-center gap-2 transition-all duration-200 hover:translate-x-1 hover:text-[#D4AF37] ${
                    dark ? "text-white/45" : "text-black/45"
                  }`}
                >
                  <span className="h-px w-0 bg-[#D4AF37] transition-all duration-200 group-hover:w-3" />
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* =====================================================
              CONNECT
          ====================================================== */}

          <div>
            <h4
              className={`mb-5 text-xs font-bold uppercase tracking-[0.16em] transition-colors duration-300 ${
                dark ? "text-white" : "text-[#111111]"
              }`}
            >
              Connect
            </h4>

            <p
              className={`mb-5 max-w-xs text-sm leading-6 transition-colors duration-300 ${
                dark ? "text-white/45" : "text-black/45"
              }`}
            >
              Follow Happy Bounty for new opportunities, platform updates,
              and Web3 work.
            </p>

            <div className="flex gap-2.5">

              {/* X */}
              <a
                href="https://x.com/Happy_bounty"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Happy Bounty on X"
                className={`group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-white hover:shadow-[0_10px_25px_rgba(212,175,55,0.18)] ${
                  dark
                    ? "border-white/[0.08] bg-[#111311] text-white/45 shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
                    : "border-black/[0.08] bg-white text-black/45 shadow-[0_6px_18px_rgba(17,17,17,0.04)]"
                }`}
              >
                <FaTwitter className="text-base transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* Discord */}
              <a
                href="#"
                aria-label="Happy Bounty Discord"
                className={`group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-white hover:shadow-[0_10px_25px_rgba(212,175,55,0.18)] ${
                  dark
                    ? "border-white/[0.08] bg-[#111311] text-white/45 shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
                    : "border-black/[0.08] bg-white text-black/45 shadow-[0_6px_18px_rgba(17,17,17,0.04)]"
                }`}
              >
                <FaDiscord className="text-base transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* GitHub */}
              <a
                href="#"
                aria-label="Happy Bounty GitHub"
                className={`group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-white hover:shadow-[0_10px_25px_rgba(212,175,55,0.18)] ${
                  dark
                    ? "border-white/[0.08] bg-[#111311] text-white/45 shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
                    : "border-black/[0.08] bg-white text-black/45 shadow-[0_6px_18px_rgba(17,17,17,0.04)]"
                }`}
              >
                <FaGithub className="text-base transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

          {/* Copyright */}
          <p
            className={`text-[11px] transition-colors duration-300 ${
              dark ? "text-white/30" : "text-black/35"
            }`}
          >
            © 2026 Happy Bounty. All rights reserved.
          </p>

          {/* Legal */}
          <div
            className={`flex flex-wrap justify-center gap-5 text-[11px] transition-colors duration-300 ${
              dark ? "text-white/30" : "text-black/35"
            }`}
          >
            <a
              href="#"
              className="transition-colors duration-200 hover:text-[#D4AF37]"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors duration-200 hover:text-[#D4AF37]"
            >
              Terms of Service
            </a>

            <a
              href="#"
              className="transition-colors duration-200 hover:text-[#D4AF37]"
            >
              Security
            </a>
          </div>

          {/* Built For */}
          <div
            className={`flex items-center gap-2 text-[11px] transition-colors duration-300 ${
              dark ? "text-white/30" : "text-black/35"
            }`}
          >
            <span>Built for</span>

            <span className="font-bold text-[#D4AF37]">
              Arc
            </span>

            <span className="h-1 w-1 rounded-full bg-[#D4AF37]/40" />

            <span className="font-bold text-[#D4AF37]">
              USDC
            </span>

            <FiCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
          </div>
        </div>

        {/* =====================================================
            BACK TO TOP
        ====================================================== */}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-white hover:shadow-[0_10px_25px_rgba(212,175,55,0.18)] ${
              dark
                ? "border-white/[0.08] bg-[#111311] text-white/40 shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                : "border-black/[0.08] bg-white text-black/40 shadow-[0_6px_20px_rgba(17,17,17,0.04)]"
            }`}
          >
            <span>Back to top</span>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/15 group-hover:text-white ${
                dark
                  ? "border-white/[0.07] bg-[#151715] text-white/50"
                  : "border-black/[0.07] bg-white text-black/50"
              }`}
            >
              <FiArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>

        {/* =====================================================
            BOTTOM SYSTEM LABEL
        ====================================================== */}

        <div
          className={`mt-8 flex items-center justify-center gap-3 text-[8px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 ${
            dark ? "text-white/15" : "text-black/20"
          }`}
        >
          <span>ARC</span>
          <span className="text-[#D4AF37]/50">•</span>
          <span>USDC</span>
          <span className="text-[#D4AF37]/50">•</span>
          <span>WEB3 WORK</span>
          <span className="text-[#D4AF37]/50">•</span>
          <span>ON-CHAIN</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;