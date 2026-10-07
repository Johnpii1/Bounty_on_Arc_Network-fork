import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNav } from "../hooks/useNav";
import {
  FiArrowUpRight,
  FiSend,
  FiDownload,
  FiPlus,
  FiZap,
} from "react-icons/fi";
import ArcLogo from "../assets/images/GradientLogo.png";

const heroMessages = [
  "Earn USDC.",
  "Complete Quests.",
  "Build Your Skills.",
  "Get Rewarded.",
];

export default function Hero({ dark }) {
  const [heroText, setHeroText] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const visualRef = useRef(null);
  const { handleNavigate } = useNav();

  /* =====================================================
     TYPING ANIMATION
  ===================================================== */
  useEffect(() => {
    const currentMessage = heroMessages[heroText];
    const typingSpeed = isDeleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        const nextText = currentMessage.slice(0, displayText.length + 1);
        setDisplayText(nextText);

        if (nextText.length === currentMessage.length) {
          setTimeout(() => {
            setIsDeleting(true);
          }, 1400);
        }
      } else {
        const nextText = currentMessage.slice(0, displayText.length - 1);
        setDisplayText(nextText);

        if (nextText.length === 0) {
          setIsDeleting(false);
          setHeroText((prev) => (prev + 1) % heroMessages.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, heroText]);

  /* =====================================================
     3D MOUSE TILT
  ===================================================== */
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    const handleMouseMove = (event) => {
      const rect = visual.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = (x / rect.width - 0.5) * 8;
      const rotateX = (y / rect.height - 0.5) * -8;

      visual.style.setProperty("--rotate-x", `${rotateX}deg`);
      visual.style.setProperty("--rotate-y", `${rotateY}deg`);
    };

    const handleMouseLeave = () => {
      visual.style.setProperty("--rotate-x", "0deg");
      visual.style.setProperty("--rotate-y", "0deg");
    };

    visual.addEventListener("mousemove", handleMouseMove);
    visual.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      visual.removeEventListener("mousemove", handleMouseMove);
      visual.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* =====================================================
     ANIMATED BACKGROUND DOTS
  ===================================================== */
  const backgroundDots = [
    { left: "7%", top: "18%", delay: "0s", size: "3px" },
    { left: "14%", top: "72%", delay: "1.2s", size: "4px" },
    { left: "23%", top: "34%", delay: "2.4s", size: "2px" },
    { left: "31%", top: "84%", delay: "0.8s", size: "3px" },
    { left: "42%", top: "15%", delay: "3s", size: "2px" },
    { left: "49%", top: "67%", delay: "1.8s", size: "4px" },
    { left: "58%", top: "28%", delay: "2.8s", size: "3px" },
    { left: "67%", top: "78%", delay: "0.4s", size: "2px" },
    { left: "74%", top: "14%", delay: "1.6s", size: "3px" },
    { left: "81%", top: "47%", delay: "3.2s", size: "4px" },
    { left: "89%", top: "24%", delay: "2s", size: "2px" },
    { left: "94%", top: "72%", delay: "0.6s", size: "3px" },
    { left: "38%", top: "46%", delay: "2.2s", size: "2px" },
    { left: "62%", top: "54%", delay: "1s", size: "3px" },
    { left: "17%", top: "48%", delay: "3.4s", size: "2px" },
    { left: "84%", top: "86%", delay: "1.4s", size: "3px" },
  ];

  return (
    <section
      className={`
        relative min-h-[620px] w-full overflow-hidden
        transition-colors duration-500
        sm:min-h-[650px]
        ${dark ? "bg-[#080908] text-white" : "bg-[#f6f5ef] text-black"}
      `}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`
            absolute -inset-20 scale-110
            transition-opacity duration-500
            ${dark ? "opacity-[0.055]" : "opacity-[0.035]"}
          `}
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(72, 62, 43, 0.55) 1px,
                transparent 1px
              ),
              linear-gradient(
                0deg,
                rgba(72, 62, 43, 0.55) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "150px 76px",
            backgroundPosition: "0 0, 75px 38px",
          }}
        />

        <div
          className={`
            absolute -inset-20 scale-110
            transition-opacity duration-500
            ${dark ? "opacity-[0.025]" : "opacity-[0.012]"}
          `}
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(212, 175, 55, 0.5) 1px,
                transparent 1px
              ),
              linear-gradient(
                0deg,
                rgba(212, 175, 55, 0.5) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "150px 76px",
            backgroundPosition: "0 0, 75px 38px",
            filter: "blur(1px)",
          }}
        />

        <div
          className={`
            absolute -inset-20 scale-110
            blur-[8px]
            transition-opacity duration-500
            ${dark ? "opacity-[0.025]" : "opacity-[0.018]"}
          `}
          style={{
            backgroundImage: `
              radial-gradient(
                ellipse at center,
                rgba(93, 72, 35, 0.5) 0%,
                rgba(93, 72, 35, 0.15) 35%,
                transparent 70%
              )
            `,
            backgroundSize: "180px 95px",
            backgroundPosition: "20px 10px",
          }}
        />

        <div
          className={`
            absolute inset-0 transition-all duration-500
            ${
              dark
                ? "bg-[radial-gradient(circle_at_center,rgba(8,9,8,0.20)_0%,rgba(8,9,8,0.45)_48%,rgba(8,9,8,0.72)_100%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(246,245,239,0.62)_0%,rgba(246,245,239,0.3)_48%,rgba(246,245,239,0.08)_100%)]"
            }
          `}
        />

        <div
          className={`
            absolute left-[-180px] top-[8%]
            h-[380px] w-[380px]
            rounded-full
            bg-[#D4AF37]
            blur-[130px]
            transition-opacity duration-500
            ${dark ? "opacity-[0.035]" : "opacity-[0.018]"}
          `}
        />

        <div
          className={`
            absolute bottom-[-180px] right-[-100px]
            h-[400px] w-[400px]
            rounded-full
            bg-[#D4AF37]
            blur-[140px]
            transition-opacity duration-500
            ${dark ? "opacity-[0.035]" : "opacity-[0.018]"}
          `}
        />

        <div
          className={`
            absolute inset-0 transition-opacity duration-500
            ${dark ? "opacity-[0.032]" : "opacity-[0.022]"}
          `}
          style={{
            backgroundImage:
              "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
            backgroundSize: "38px 38px",
          }}
        />

        {backgroundDots.map((dot, index) => (
          <span
            key={index}
            className="hero-bg-dot absolute rounded-full bg-[#D4AF37]"
            style={{
              left: dot.left,
              top: dot.top,
              width: dot.size,
              height: dot.size,
              animationDelay: dot.delay,
            }}
          />
        ))}

        <div
          className={`
            absolute inset-x-0 bottom-0 h-32
            bg-gradient-to-t
            transition-all duration-500
            ${
              dark
                ? "from-[#080908] to-transparent"
                : "from-[#f6f5ef] to-transparent"
            }
          `}
        />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}
      <div className="relative z-10 mx-auto flex w-full min-h-[620px] max-w-full items-center overflow-hidden px-5 py-12 sm:min-h-[650px] sm:px-8 sm:py-16 lg:px-10">
        <div className="grid w-full min-w-0 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="mx-auto w-full min-w-0 max-w-2xl text-center sm:text-left">
            <div
              className={`
                mb-5 inline-flex items-center gap-2
                rounded-full border
                px-4 py-2
                transition-all duration-500
                ${
                  dark
                    ? "border-[#D4AF37]/30 bg-[#121212] shadow-[0_5px_25px_rgba(0,0,0,0.25)]"
                    : "border-[#D4AF37]/25 bg-white shadow-[0_5px_20px_rgba(17,17,17,0.04)]"
                }
              `}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
              </span>

              <span
                className={`
                  text-xs font-bold tracking-wide
                  transition-colors duration-500
                  ${dark ? "text-white" : "text-black"}
                `}
              >
                Built for Arc
              </span>
            </div>

            <div className="space-y-0">
              <h1
                className={`
                  text-4xl font-extrabold
                  leading-[0.98]
                  tracking-tight
                  transition-colors duration-500
                  sm:text-5xl
                  md:text-6xl
                  lg:text-[4.2rem]
                  ${dark ? "text-white" : "text-black"}
                `}
              >
                Make a
              </h1>

              <h1
                className={`
                  text-4xl font-extrabold
                  leading-[0.98]
                  tracking-tight
                  transition-colors duration-500
                  sm:text-5xl
                  md:text-6xl
                  lg:text-[4.2rem]
                  ${dark ? "text-white" : "text-black"}
                `}
              >
                living from
              </h1>

              <div className="relative mt-1 flex min-h-[52px] w-full min-w-0 items-start justify-center overflow-hidden sm:min-h-[64px] sm:justify-start md:min-h-[80px]">
                <div className="flex max-w-full min-w-0 items-center whitespace-nowrap text-3xl font-extrabold leading-[1] sm:text-4xl md:text-6xl lg:text-[4.2rem]">
                  <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                    {displayText}
                  </span>

                  <span className="ml-1 inline-block h-[0.8em] w-[3px] shrink-0 rounded-full bg-[#D4AF37]" />
                </div>
              </div>
            </div>

            <p
              className={`
                mx-auto mt-3 w-full min-w-0 max-w-xl
                text-sm font-semibold
                leading-relaxed
                transition-colors duration-500
                sm:mx-0 sm:text-base md:mt-4
                ${dark ? "text-white/60" : "text-black/65"}
              `}
            >
              Complete quests and earn USDC, tokens, and digital rewards. Post
              bounties and get quality work done — fully on-chain.
            </p>

            <div className="mt-6 flex w-full flex-wrap justify-center gap-3 sm:justify-start">
              <Link
                to="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/dashboard");
                }}
                className={`
                  group relative overflow-hidden
                  rounded-lg
                  px-6 py-3
                  text-sm font-bold
                  transition-all duration-300
                  hover:-translate-y-0.5
                  ${
                    dark
                      ? "bg-[#D4AF37] text-[#080908] shadow-[0_8px_25px_rgba(212,175,55,0.22)] hover:bg-[#E1BE4A] hover:shadow-[0_12px_30px_rgba(212,175,55,0.32)]"
                      : "bg-[#D4AF37] text-white shadow-[0_8px_25px_rgba(212,175,55,0.18)] hover:bg-[#B8962E] hover:shadow-[0_12px_30px_rgba(212,175,55,0.28)]"
                  }
                `}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Bounties
                  <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>

                <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[100%]" />
              </Link>

              <Link
                to="/create"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/create");
                }}
                className={`
                  group flex items-center gap-2
                  rounded-lg
                  border-2
                  px-6 py-3
                  text-sm font-bold
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-0.5
                  ${
                    dark
                      ? "border-white/[0.12] bg-[#121212] text-white hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      : "border-black/10 bg-white text-black hover:border-[#D4AF37] hover:text-[#B8860B]"
                  }
                `}
              >
                Create a Bounty
                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 sm:justify-start">
              <div className="flex gap-1.5">
                {heroMessages.map((_, index) => (
                  <span
                    key={index}
                    className={`
                      h-1.5 rounded-full
                      transition-all duration-500
                      ${
                        index === heroText
                          ? "w-7 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.25)]"
                          : dark
                            ? "w-1.5 bg-white/15"
                            : "w-1.5 bg-black/15"
                      }
                    `}
                  />
                ))}
              </div>

              <span
                className={`
                  text-[11px] font-bold
                  transition-colors duration-500
                  ${dark ? "text-white/45" : "text-black/55"}
                `}
              >
                New opportunities every day
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — ARC + USDC FLOATING VISUAL
          ================================================= */}
          <div
            ref={visualRef}
            className="
              usdc-visual
              relative
              flex
              min-h-[390px]
              w-full
              min-w-0
              items-center
              justify-center
              overflow-visible
              sm:min-h-[470px]
              lg:min-h-[540px]
            "
          >
            <div className="usdc-scene relative flex h-[350px] w-full max-w-[560px] items-center justify-center sm:h-[450px] lg:h-[520px]">
              {/* ARC LABEL */}
              <div className="arc-visual-badge">
                <span className="arc-badge-dot" />

                <FiZap className="arc-badge-icon" />

                <div className="arc-badge-text">
                  <strong>ARC</strong>
                  <span>ON-CHAIN BOUNTIES</span>
                </div>
              </div>

              {/* LARGE SOFT GOLD GLOW */}
              <div className="visual-glow absolute h-[230px] w-[230px] rounded-full bg-[#D4AF37]/10 blur-[90px] sm:h-[320px] sm:w-[320px]" />

              {/* ARC LOGO */}
              <div className="arc-logo-element" aria-hidden="true">
                <div className="arc-logo-halo" />

                <div className="arc-logo-container">
                  <img
                    src={ArcLogo}
                    alt="Arc"
                    draggable="false"
                    className="arc-logo-image"
                  />
                </div>
              </div>

              {/* ORBITS */}
              <div className="usdc-orbit usdc-orbit-main" />
              <div className="usdc-orbit usdc-orbit-secondary" />

              {/* BACK COIN — LEFT */}
              <div className="floating-coin coin-left">
                <img
                  src={ArcLogo}
                  alt="Arc"
                  draggable="false"
                />
              </div>

              {/* BACK COIN — TOP RIGHT */}
              <div className="floating-coin coin-top">
                <img
                  src={ArcLogo}
                  alt="Arc"
                  draggable="false"
                />
              </div>

              {/* BACK COIN — BOTTOM RIGHT */}
              <div className="floating-coin coin-bottom">
                <img
                  src={ArcLogo}
                  alt="Arc"
                  draggable="false"
                />
              </div>

              {/* MAIN FLOATING CARD */}
              <div className="hero-finance-card">
                {/* ARC CARD TOP LABEL */}
                <div className="arc-card-label">
                  <span className="arc-card-pulse" />
                  BUILT FOR ARC
                </div>

                {/* CARD TOP */}
                <div className="finance-card-top">
                  <div className="finance-user">
                    <div className="finance-avatar">
                      <img
                        src={ArcLogo}
                        alt="Arc"
                        draggable="false"
                      />
                    </div>

                    <div>
                      <span className="finance-small-text">
                        Welcome back
                      </span>

                      <strong>ARC Wallet</strong>
                    </div>
                  </div>

                  <div className="finance-usdc-badge">
                    <img
                      src={ArcLogo}
                      alt="Arc"
                      draggable="false"
                    />

                    <span>USDC</span>
                  </div>
                </div>

                {/* BALANCE */}
                <div className="finance-balance-area">
                  <span className="finance-balance-label">
                    Available balance
                  </span>

                  <div className="finance-balance">
                    <span>$</span>
                    12,580
                    <small>.45</small>
                  </div>

                  <div className="finance-growth">
                    <span>↗</span>
                    +8.42%
                  </div>
                </div>

                {/* SMALL GRAPH */}
                <div className="finance-chart">
                  <div className="chart-line">
                    <span className="chart-point p1" />
                    <span className="chart-point p2" />
                    <span className="chart-point p3" />
                    <span className="chart-point p4" />
                    <span className="chart-point p5" />
                    <span className="chart-point p6" />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="finance-actions">
                  <div className="finance-action">
                    <span>
                      <FiPlus />
                    </span>
                    <small>Deposit</small>
                  </div>

                  <div className="finance-action">
                    <span>
                      <FiSend />
                    </span>
                    <small>Send</small>
                  </div>

                  <div className="finance-action">
                    <span>
                      <FiDownload />
                    </span>
                    <small>Receive</small>
                  </div>
                </div>

                {/* ARC BOTTOM LABEL */}
                <div className="arc-card-footer">
                  <span>ARC</span>
                  <span className="arc-footer-line" />
                  <span>ON-CHAIN</span>
                </div>
              </div>

              {/* FRONT FLOATING MINI CARD */}
              <div className="mini-usdc-card">
                <div className="mini-usdc-icon">
                  <img
                    src={ArcLogo}
                    alt="Arc"
                    draggable="false"
                  />
                </div>

                <div className="mini-usdc-content">
                  <span>USDC Earned</span>
                  <strong>+$240.80</strong>
                </div>

                <span className="mini-usdc-arrow">↗</span>
              </div>

              {/* ARC FLOATING CHIP */}
              <div className="arc-floating-chip">
                <FiZap />
                <span>ARC</span>
              </div>

              {/* SMALL FLOATING DOTS */}
              <span className="visual-dot visual-dot-one" />
              <span className="visual-dot visual-dot-two" />
              <span className="visual-dot visual-dot-three" />
              <span className="visual-dot visual-dot-four" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}
      <style>{`

        /* =====================================================
           BACKGROUND DOTS
        ===================================================== */

        .hero-bg-dot {
          opacity: ${dark ? "0.20" : "0.14"};
          box-shadow: 0 0 7px rgba(212, 175, 55, 0.22);
          animation: heroDotFloat 5s ease-in-out infinite;
          transition: opacity 0.5s ease;
        }

        @keyframes heroDotFloat {
          0%,
          100% {
            opacity: 0.08;
            transform: translate3d(0, 0, 0) scale(0.8);
          }

          50% {
            opacity: 0.45;
            transform: translate3d(8px, -18px, 0) scale(1.15);
          }
        }

        /* =====================================================
           VISUAL CONTAINER
        ===================================================== */

        .usdc-visual {
          --rotate-x: 0deg;
          --rotate-y: 0deg;
          perspective: 1400px;
        }

        .usdc-scene {
          transform-style: preserve-3d;
          transform:
            rotateX(var(--rotate-x))
            rotateY(var(--rotate-y));
          transition:
            transform 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .visual-glow {
          animation: visualGlow 5s ease-in-out infinite;
        }

        @keyframes visualGlow {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.65;
          }

          50% {
            transform: scale(1.12);
            opacity: 1;
          }
        }

        /* =====================================================
           ARC LOGO
        ===================================================== */

        .arc-logo-element {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 3;
          width: 185px;
          height: 185px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          transform: translate(-50%, -50%) translateZ(5px);
          animation: arcLogoFloat 5s ease-in-out infinite;
        }

        .arc-logo-halo {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(212,175,55,0.13) 0%,
            rgba(212,175,55,0.05) 42%,
            transparent 72%
          );
          filter: blur(18px);
          animation: arcLogoHalo 4.5s ease-in-out infinite;
        }

        .arc-logo-container {
          position: relative;
          z-index: 2;
          width: 135px;
          height: 135px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: ${dark ? "rgba(8,9,8,0.48)" : "rgba(246,245,239,0.42)"};
          border: 1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"};
          box-shadow:
            0 0 35px rgba(212,175,55,0.08),
            inset 0 1px 0 rgba(255,255,255,0.10);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .arc-logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.18));
          animation: arcLogoPulse 4.5s ease-in-out infinite;
        }

        @keyframes arcLogoFloat {
          0%, 100% {
            transform:
              translate(-50%, -50%)
              translateZ(5px)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateZ(5px)
              translateY(-8px);
          }
        }

        @keyframes arcLogoHalo {
          0%, 100% {
            transform: scale(0.88);
            opacity: 0.55;
          }

          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes arcLogoPulse {
          0%, 100% {
            transform: scale(0.96);
          }

          50% {
            transform: scale(1.03);
          }
        }

        /* =====================================================
           ARC VISUAL BADGE
        ===================================================== */

        .arc-visual-badge {
          position: absolute;
          z-index: 30;
          top: 3%;
          left: 50%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border-radius: 999px;
          background:
            ${dark ? "rgba(18,18,15,0.92)" : "rgba(255,255,255,0.92)"};
          border: 1px solid rgba(212,175,55,0.30);
          box-shadow:
            0 12px 30px rgba(0,0,0,0.12),
            0 0 25px rgba(212,175,55,0.06);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transform:
            translateX(-50%)
            translateZ(90px);
          animation:
            arcBadgeFloat 4.5s ease-in-out infinite;
          white-space: nowrap;
        }

        .arc-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #D4AF37;
          box-shadow:
            0 0 12px rgba(212,175,55,0.75);
          animation:
            arcPulse 2s ease-in-out infinite;
        }

        .arc-badge-icon {
          width: 14px;
          height: 14px;
          color: #D4AF37;
        }

        .arc-badge-text {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .arc-badge-text strong {
          color: ${dark ? "#ffffff" : "#111111"};
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .arc-badge-text span {
          color: ${dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)"};
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        @keyframes arcBadgeFloat {
          0%,
          100% {
            transform:
              translateX(-50%)
              translateZ(90px)
              translateY(0);
          }

          50% {
            transform:
              translateX(-50%)
              translateZ(90px)
              translateY(-6px);
          }
        }

        @keyframes arcPulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.55;
          }

          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        /* =====================================================
           ORBIT
        ===================================================== */

        .usdc-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          pointer-events: none;
          transform:
            translate(-50%, -50%);
        }

        .usdc-orbit-main {
          width: 460px;
          height: 285px;
          border:
            1px solid
            rgba(212, 175, 55, 0.20);
          box-shadow:
            0 0 25px rgba(212, 175, 55, 0.05),
            inset 0 0 25px rgba(212, 175, 55, 0.025);
          transform:
            translate(-50%, -50%)
            rotate(-10deg);
        }

        .usdc-orbit-secondary {
          width: 380px;
          height: 225px;
          border:
            1px solid
            rgba(212, 175, 55, 0.09);
          transform:
            translate(-50%, -50%)
            rotate(12deg);
        }

        /* =====================================================
           MAIN FINANCE CARD
        ===================================================== */

        .hero-finance-card {
          position: relative;
          z-index: 10;
          width: min(430px, 78%);
          min-height: 305px;
          padding: 22px;
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              ${dark ? "rgba(30,30,25,0.96)" : "rgba(255,255,255,0.94)"}
              0%,
              ${dark ? "rgba(15,15,13,0.91)" : "rgba(249,247,237,0.91)"}
              100%
            );
          border: 1px solid
            ${dark ? "rgba(212,175,55,0.25)" : "rgba(212,175,55,0.22)"};
          box-shadow:
            0 35px 80px rgba(0, 0, 0, 0.24),
            0 15px 35px rgba(0, 0, 0, 0.10),
            inset 0 1px 0 rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transform:
            translateZ(40px)
            rotate(-3deg);
          animation:
            financeCardFloat 5s ease-in-out infinite;
          transition:
            transform 400ms ease,
            box-shadow 400ms ease;
        }

        .hero-finance-card:hover {
          transform:
            translateZ(55px)
            rotate(-1deg)
            translateY(-5px);
          box-shadow:
            0 45px 95px rgba(0, 0, 0, 0.30),
            0 20px 40px rgba(0, 0, 0, 0.12),
            0 0 40px rgba(212, 175, 55, 0.10);
        }

        @keyframes financeCardFloat {
          0%,
          100% {
            transform:
              translateZ(40px)
              rotate(-3deg)
              translateY(0);
          }

          50% {
            transform:
              translateZ(40px)
              rotate(-2deg)
              translateY(-9px);
          }
        }

        /* =====================================================
           ARC CARD LABEL
        ===================================================== */

        .arc-card-label {
          display: flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
          margin-bottom: 12px;
          color: #D4AF37;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .arc-card-pulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D4AF37;
          box-shadow:
            0 0 9px rgba(212,175,55,0.7);
          animation:
            arcPulse 2s ease-in-out infinite;
        }

        /* =====================================================
           CARD TOP
        ===================================================== */

        .finance-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .finance-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .finance-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background:
            ${dark ? "rgba(212,175,55,0.10)" : "rgba(212,175,55,0.12)"};
          border:
            1px solid
            rgba(212, 175, 55, 0.25);
          overflow: hidden;
        }

        .finance-avatar img {
          width: 30px;
          height: 30px;
          object-fit: contain;
        }

        .finance-small-text {
          display: block;
          margin-bottom: 2px;
          font-size: 10px;
          font-weight: 600;
          color:
            ${dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)"};
        }

        .finance-user strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          color:
            ${dark ? "#ffffff" : "#171717"};
        }

        .finance-usdc-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          background:
            rgba(212, 175, 55, 0.10);
          border:
            1px solid
            rgba(212, 175, 55, 0.18);
          color:
            ${dark ? "#D4AF37" : "#8f741d"};
          font-size: 10px;
          font-weight: 800;
        }

        .finance-usdc-badge img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        /* =====================================================
           BALANCE
        ===================================================== */

        .finance-balance-area {
          position: relative;
          margin-top: 25px;
        }

        .finance-balance-label {
          display: block;
          margin-bottom: 5px;
          font-size: 10px;
          font-weight: 600;
          color:
            ${dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)"};
        }

        .finance-balance {
          display: flex;
          align-items: baseline;
          color:
            ${dark ? "#ffffff" : "#111111"};
          font-size: clamp(30px, 4vw, 43px);
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 1;
        }

        .finance-balance > span {
          margin-right: 2px;
          font-size: 22px;
          color: #D4AF37;
        }

        .finance-balance small {
          font-size: 18px;
          letter-spacing: -1px;
          opacity: 0.55;
        }

        .finance-growth {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 9px;
          color: #D4AF37;
          font-size: 11px;
          font-weight: 800;
        }

        .finance-growth span {
          font-size: 15px;
        }

        /* =====================================================
           CHART
        ===================================================== */

        .finance-chart {
          position: relative;
          width: 100%;
          height: 45px;
          margin-top: 13px;
          overflow: hidden;
          border-bottom:
            1px solid
            ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
        }

        .chart-line {
          position: absolute;
          left: -5%;
          bottom: -12px;
          width: 110%;
          height: 50px;
          border-top:
            2px solid
            rgba(212, 175, 55, 0.65);
          border-radius: 50%;
          transform:
            rotate(-4deg)
            scaleY(1.1);
        }

        .chart-point {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #D4AF37;
          box-shadow:
            0 0 10px rgba(212, 175, 55, 0.5);
        }

        .chart-point.p1 {
          left: 8%;
          top: 25px;
        }

        .chart-point.p2 {
          left: 25%;
          top: 16px;
        }

        .chart-point.p3 {
          left: 42%;
          top: 20px;
        }

        .chart-point.p4 {
          left: 58%;
          top: 8px;
        }

        .chart-point.p5 {
          left: 76%;
          top: 11px;
        }

        .chart-point.p6 {
          left: 91%;
          top: 2px;
        }

        /* =====================================================
           ACTION BUTTONS
        ===================================================== */

        .finance-actions {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 8px;
          margin-top: 15px;
        }

        .finance-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 40px;
          border-radius: 11px;
          background:
            ${dark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.035)"};
          border:
            1px solid
            ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
          color:
            ${dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.70)"};
          transition:
            all 250ms ease;
        }

        .finance-action:hover {
          transform:
            translateY(-2px);
          border-color:
            rgba(212, 175, 55, 0.25);
          color:
            #D4AF37;
          background:
            rgba(212, 175, 55, 0.07);
        }

        .finance-action span {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .finance-action small {
          font-size: 9px;
          font-weight: 800;
        }

        /* =====================================================
           ARC CARD FOOTER
        ===================================================== */

        .arc-card-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 10px;
          color:
            ${dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.38)"};
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .arc-card-footer span:first-child {
          color: #D4AF37;
        }

        .arc-footer-line {
          width: 28px;
          height: 1px;
          background:
            rgba(212,175,55,0.30);
        }

        /* =====================================================
           FLOATING ARC LOGOS
        ===================================================== */

        .floating-coin {
          position: absolute;
          z-index: 14;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 66px;
          height: 66px;
          transform-style: preserve-3d;
          filter:
            drop-shadow(
              0 15px 18px rgba(0, 0, 0, 0.18)
            )
            drop-shadow(
              0 0 20px rgba(212, 175, 55, 0.14)
            );
          pointer-events: none;
        }

        .floating-coin img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .coin-left {
          left: 4%;
          top: 30%;
          animation:
            coinFloatLeft 5s ease-in-out infinite;
        }

        .coin-top {
          right: 8%;
          top: 8%;
          width: 58px;
          height: 58px;
          animation:
            coinFloatTop 4.5s ease-in-out infinite;
        }

        .coin-bottom {
          right: 7%;
          bottom: 10%;
          width: 70px;
          height: 70px;
          animation:
            coinFloatBottom 5.5s ease-in-out infinite;
        }

        @keyframes coinFloatLeft {
          0%,
          100% {
            transform:
              translate3d(0, 0, 25px)
              rotate(-8deg);
          }

          50% {
            transform:
              translate3d(-8px, -15px, 40px)
              rotate(5deg);
          }
        }

        @keyframes coinFloatTop {
          0%,
          100% {
            transform:
              translate3d(0, 0, 20px)
              rotate(6deg);
          }

          50% {
            transform:
              translate3d(8px, -12px, 35px)
              rotate(-7deg);
          }
        }

        @keyframes coinFloatBottom {
          0%,
          100% {
            transform:
              translate3d(0, 0, 30px)
              rotate(-5deg);
          }

          50% {
            transform:
              translate3d(8px, 13px, 45px)
              rotate(7deg);
          }
        }

        /* =====================================================
           MINI ARC CARD
        ===================================================== */

        .mini-usdc-card {
          position: absolute;
          z-index: 18;
          right: 4%;
          bottom: 13%;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 180px;
          padding: 10px 12px;
          border-radius: 14px;
          background:
            ${dark ? "rgba(20,20,17,0.94)" : "rgba(255,255,255,0.94)"};
          border:
            1px solid
            rgba(212, 175, 55, 0.20);
          box-shadow:
            0 18px 35px rgba(0, 0, 0, 0.16);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          transform:
            translateZ(70px)
            rotate(3deg);
          animation:
            miniCardFloat 4.5s ease-in-out infinite;
          transition:
            transform 300ms ease;
        }

        .mini-usdc-card:hover {
          transform:
            translateZ(80px)
            rotate(1deg)
            translateY(-3px);
        }

        @keyframes miniCardFloat {
          0%,
          100% {
            transform:
              translateZ(70px)
              rotate(3deg)
              translateY(0);
          }

          50% {
            transform:
              translateZ(70px)
              rotate(2deg)
              translateY(-7px);
          }
        }

        .mini-usdc-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 11px;
          background:
            rgba(212, 175, 55, 0.10);
          border:
            1px solid
            rgba(212, 175, 55, 0.16);
        }

        .mini-usdc-icon img {
          width: 27px;
          height: 27px;
          object-fit: contain;
        }

        .mini-usdc-content {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .mini-usdc-content span {
          font-size: 8px;
          font-weight: 700;
          color:
            ${dark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.45)"};
        }

        .mini-usdc-content strong {
          margin-top: 2px;
          font-size: 13px;
          font-weight: 900;
          color: #D4AF37;
        }

        .mini-usdc-arrow {
          margin-left: auto;
          font-size: 17px;
          font-weight: 900;
          color: #D4AF37;
        }

        /* =====================================================
           ARC FLOATING CHIP
        ===================================================== */

        .arc-floating-chip {
          position: absolute;
          z-index: 24;
          left: 7%;
          bottom: 16%;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          border-radius: 999px;
          background:
            ${dark ? "rgba(18,18,15,0.92)" : "rgba(255,255,255,0.94)"};
          border:
            1px solid
            rgba(212,175,55,0.22);
          box-shadow:
            0 12px 28px rgba(0,0,0,0.12);
          color: #D4AF37;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transform:
            translateZ(80px)
            rotate(-4deg);
          animation:
            arcChipFloat 4s ease-in-out infinite;
        }

        .arc-floating-chip svg {
          width: 11px;
          height: 11px;
        }

        @keyframes arcChipFloat {
          0%,
          100% {
            transform:
              translateZ(80px)
              rotate(-4deg)
              translateY(0);
          }

          50% {
            transform:
              translateZ(80px)
              rotate(-2deg)
              translateY(-6px);
          }
        }

        /* =====================================================
           DECORATIVE DOTS
        ===================================================== */

        .visual-dot {
          position: absolute;
          z-index: 5;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D4AF37;
          box-shadow:
            0 0 14px rgba(212, 175, 55, 0.65);
        }

        .visual-dot-one {
          left: 17%;
          top: 18%;
          animation:
            smallDotOne 4s ease-in-out infinite;
        }

        .visual-dot-two {
          right: 18%;
          top: 31%;
          width: 4px;
          height: 4px;
          animation:
            smallDotTwo 4.5s ease-in-out infinite;
        }

        .visual-dot-three {
          left: 25%;
          bottom: 19%;
          width: 4px;
          height: 4px;
          animation:
            smallDotThree 5s ease-in-out infinite;
        }

        .visual-dot-four {
          right: 28%;
          bottom: 24%;
          width: 6px;
          height: 6px;
          animation:
            smallDotFour 4.2s ease-in-out infinite;
        }

        @keyframes smallDotOne {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(8px, -14px);
          }
        }

        @keyframes smallDotTwo {
          0%,
          100% {
            opacity: 0.25;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(-10px, 12px);
          }
        }

        @keyframes smallDotThree {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(0, 0);
          }

          50% {
            opacity: 0.9;
            transform: translate(12px, 8px);
          }
        }

        @keyframes smallDotFour {
          0%,
          100% {
            opacity: 0.25;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(-8px, -13px);
          }
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (min-width: 641px) and (max-width: 1100px) {

          .usdc-scene {
            transform:
              scale(0.88)
              rotateX(var(--rotate-x))
              rotateY(var(--rotate-y));
          }

          .hero-finance-card {
            width: 390px;
          }

          .usdc-orbit-main {
            width: 400px;
            height: 250px;
          }

          .usdc-orbit-secondary {
            width: 330px;
            height: 200px;
          }

          .arc-logo-element {
            width: 165px;
            height: 165px;
          }

          .arc-logo-container {
            width: 120px;
            height: 120px;
            padding: 18px;
          }

          .coin-left {
            left: 1%;
          }

          .coin-top {
            right: 2%;
          }

          .coin-bottom {
            right: 1%;
          }

          .mini-usdc-card {
            right: 2%;
          }

          .arc-floating-chip {
            left: 4%;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 640px) {

          .usdc-visual {
            min-height: 350px;
            margin-top: -8px;
          }

          .usdc-scene {
            height: 350px;
            transform:
              scale(0.74)
              rotateX(var(--rotate-x))
              rotateY(var(--rotate-y));
          }

          .hero-finance-card {
            width: 410px;
            min-height: 300px;
            padding: 20px;
            border-radius: 22px;
          }

          .usdc-orbit-main {
            width: 390px;
            height: 245px;
          }

          .usdc-orbit-secondary {
            width: 325px;
            height: 195px;
          }

          .arc-logo-element {
            width: 155px;
            height: 155px;
          }

          .arc-logo-container {
            width: 112px;
            height: 112px;
            padding: 17px;
          }

          .floating-coin {
            width: 58px;
            height: 58px;
          }

          .coin-left {
            left: 0%;
            top: 28%;
          }

          .coin-top {
            right: 0%;
            top: 9%;
            width: 52px;
            height: 52px;
          }

          .coin-bottom {
            right: 0%;
            bottom: 8%;
            width: 58px;
            height: 58px;
          }

          .mini-usdc-card {
            right: 0%;
            bottom: 11%;
            min-width: 165px;
            padding: 9px 10px;
          }

          .arc-visual-badge {
            top: 1%;
            padding:
              7px 10px;
          }

          .arc-badge-text span {
            display: none;
          }

          .arc-floating-chip {
            left: 0%;
            bottom: 14%;
          }

          .arc-card-footer {
            margin-top: 8px;
          }
        }

        /* =====================================================
           VERY SMALL PHONES
        ===================================================== */

        @media (max-width: 390px) {

          .usdc-visual {
            min-height: 320px;
          }

          .usdc-scene {
            height: 320px;
            transform:
              scale(0.65)
              rotateX(var(--rotate-x))
              rotateY(var(--rotate-y));
          }

          .hero-finance-card {
            width: 415px;
          }

          .mini-usdc-card {
            right: -2%;
          }

          .coin-left {
            left: -4%;
          }

          .coin-top {
            right: -3%;
          }

          .coin-bottom {
            right: -3%;
          }

          .arc-visual-badge {
            transform:
              translateX(-50%)
              translateZ(90px)
              scale(0.92);
          }

          .arc-floating-chip {
            left: -3%;
            transform:
              translateZ(80px)
              rotate(-4deg)
              scale(0.9);
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {

          .hero-bg-dot,
          .visual-glow,
          .hero-finance-card,
          .floating-coin,
          .mini-usdc-card,
          .visual-dot,
          .arc-visual-badge,
          .arc-floating-chip,
          .arc-logo-element,
          .arc-logo-halo,
          .arc-logo-image,
          .arc-badge-dot,
          .arc-card-pulse {
            animation: none !important;
          }

          .usdc-scene {
            transform: none !important;
          }
        }

      `}</style>
    </section>
  );
}