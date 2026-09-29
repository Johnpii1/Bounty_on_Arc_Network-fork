
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Usdc from "../assets/images/usdc.png";

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

      const rotateY = (x / rect.width - 0.5) * 12;
      const rotateX = (y / rect.height - 0.5) * -12;

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
        ${
          dark
            ? "bg-[#080908] text-white"
            : "bg-[#f6f5ef] text-black"
        }
      `}
    >
      {/* =====================================================
          ARCHITECTURAL BRICK BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main architectural grid */}

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

        {/* Gold architectural grid */}

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

        {/* Soft architectural texture */}

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

        {/* Main center lighting */}

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

        {/* Gold glow — left */}

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

        {/* Gold glow — right */}

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

        {/* Dot matrix */}

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

        {/* Floating background dots */}

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

        {/* Bottom fade */}

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
            {/* BADGE */}

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

            {/* HERO TITLE */}

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

              {/* TYPING TEXT */}

              <div className="relative mt-1 flex min-h-[52px] w-full min-w-0 items-start justify-center overflow-hidden sm:min-h-[64px] sm:justify-start md:min-h-[80px]">
                <div className="flex max-w-full min-w-0 items-center whitespace-nowrap text-3xl font-extrabold leading-[1] sm:text-4xl md:text-6xl lg:text-[4.2rem]">
                  <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                    {displayText}
                  </span>

                  <span className="ml-1 inline-block h-[0.8em] w-[3px] shrink-0 rounded-full bg-[#D4AF37]" />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}

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

            {/* BUTTONS */}

            <div className="mt-6 flex w-full flex-wrap justify-center gap-3 sm:justify-start">
              {/* EXPLORE */}

              <Link
                to="/dashboard"
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

              {/* CREATE */}

              <Link
                to="/create"
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

            {/* INDICATORS */}

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
              RIGHT SIDE — ROTATING USDC
          ================================================= */}

          <div
            ref={visualRef}
            className="usdc-visual relative flex min-h-[360px] min-w-0 items-center justify-center overflow-visible sm:min-h-[430px] lg:min-h-[500px]"
          >
            <div className="usdc-scene relative flex h-[340px] w-[340px] max-w-full items-center justify-center sm:h-[430px] sm:w-[430px] lg:h-[500px] lg:w-[500px]">
              <div
                className={`
                  absolute h-[230px] w-[230px]
                  rounded-full
                  bg-[#D4AF37]/10
                  blur-[75px]
                  transition-opacity duration-500
                  sm:h-[300px] sm:w-[300px]
                  ${dark ? "opacity-100" : "opacity-80"}
                `}
              />

              <div
                className={`
                  absolute h-[270px] w-[270px]
                  rounded-full
                  border
                  transition-colors duration-500
                  sm:h-[350px] sm:w-[350px]
                  lg:h-[410px] lg:w-[410px]
                  ${
                    dark
                      ? "border-[#D4AF37]/20"
                      : "border-[#D4AF37]/15"
                  }
                `}
              />

              <div
                className={`
                  absolute h-[220px] w-[220px]
                  rounded-full
                  border
                  transition-colors duration-500
                  sm:h-[290px] sm:w-[290px]
                  lg:h-[340px] lg:w-[340px]
                  ${
                    dark
                      ? "border-[#D4AF37]/15"
                      : "border-[#D4AF37]/10"
                  }
                `}
              />

              <div className="usdc-wrapper relative z-10">
                <div className="usdc-image-container">
                  <img
                    src={Usdc}
                    alt="USDC"
                    className="usdc-image select-none object-contain"
                    draggable="false"
                  />

                  <div className="usdc-reflection" />
                </div>
              </div>

              <span className="usdc-dot usdc-dot-one" />
              <span className="usdc-dot usdc-dot-two" />
              <span className="usdc-dot usdc-dot-three" />

              <span className="usdc-particle particle-one" />
              <span className="usdc-particle particle-two" />
              <span className="usdc-particle particle-three" />
              <span className="usdc-particle particle-four" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style>{`
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
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .usdc-wrapper {
          transform-style: preserve-3d;
          animation: coinFloat 5s ease-in-out infinite;
        }

        .usdc-image-container {
          position: relative;
          width: 245px;
          height: 245px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          animation: coinRotate 10s ease-in-out infinite;
        }

        .usdc-image {
          width: 245px;
          height: 245px;
          transform-style: preserve-3d;
          filter:
            drop-shadow(0 25px 25px rgba(0, 0, 0, 0.12))
            drop-shadow(0 0 35px rgba(212, 175, 55, 0.16));
        }

        .usdc-reflection {
          position: absolute;
          top: 12%;
          left: 17%;
          width: 34%;
          height: 20%;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.45);
          filter: blur(18px);
          pointer-events: none;
          transform: rotate(-25deg);
          animation: reflectionMove 5s ease-in-out infinite;
        }

        .usdc-scene::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 1px solid ${
            dark
              ? "rgba(212, 175, 55, 0.18)"
              : "rgba(212, 175, 55, 0.12)"
          };
          animation: circleRotate 18s linear infinite;
        }

        .usdc-scene::after {
          content: "";
          position: absolute;
          width: 365px;
          height: 365px;
          border-radius: 50%;
          border: 1px dashed ${
            dark
              ? "rgba(212, 175, 55, 0.14)"
              : "rgba(212, 175, 55, 0.1)"
          };
          animation: circleRotateReverse 25s linear infinite;
        }

        .usdc-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          z-index: 20;
          border-radius: 50%;
          background: #D4AF37;
        }

        .usdc-dot-one {
          top: 17%;
          right: 25%;
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.65);
          animation: dotFloatOne 4s ease-in-out infinite;
        }

        .usdc-dot-two {
          bottom: 19%;
          left: 22%;
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.55);
          animation: dotFloatTwo 5s ease-in-out infinite;
        }

        .usdc-dot-three {
          top: 34%;
          left: 14%;
          width: 5px;
          height: 5px;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
          animation: dotFloatThree 4.5s ease-in-out infinite;
        }

        .usdc-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #D4AF37;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.45);
        }

        .particle-one {
          top: 23%;
          left: 29%;
          animation: particleOne 4s ease-in-out infinite;
        }

        .particle-two {
          top: 20%;
          right: 20%;
          animation: particleTwo 5s ease-in-out infinite;
        }

        .particle-three {
          bottom: 24%;
          right: 25%;
          animation: particleThree 4.5s ease-in-out infinite;
        }

        .particle-four {
          bottom: 19%;
          left: 30%;
          animation: particleFour 5s ease-in-out infinite;
        }

        @keyframes coinFloat {
          0%,
          100% {
            transform: translateY(0) translateZ(0);
          }

          50% {
            transform: translateY(-14px) translateZ(20px);
          }
        }

        @keyframes coinRotate {
          0% {
            transform: rotateY(-8deg) rotateZ(-2deg);
          }

          25% {
            transform: rotateY(8deg) rotateZ(1deg);
          }

          50% {
            transform: rotateY(-5deg) rotateZ(2deg);
          }

          75% {
            transform: rotateY(9deg) rotateZ(-1deg);
          }

          100% {
            transform: rotateY(-8deg) rotateZ(-2deg);
          }
        }

        @keyframes reflectionMove {
          0%,
          100% {
            opacity: 0.15;
            transform: translate(0, 0) rotate(-25deg);
          }

          50% {
            opacity: 0.45;
            transform: translate(12px, 10px) rotate(-20deg);
          }
        }

        @keyframes circleRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes circleRotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes dotFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(10px, -18px);
          }
        }

        @keyframes dotFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-14px, 12px);
          }
        }

        @keyframes dotFloatThree {
          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(12px, 15px);
          }
        }

        @keyframes particleOne {
          0%,
          100% {
            opacity: 0.25;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(15px, -20px);
          }
        }

        @keyframes particleTwo {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }

          50% {
            opacity: 0.9;
            transform: translate(-18px, 15px);
          }
        }

        @keyframes particleThree {
          0%,
          100% {
            opacity: 0.25;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(-15px, -18px);
          }
        }

        @keyframes particleFour {
          0%,
          100% {
            opacity: 0.2;
            transform: translate(0, 0);
          }

          50% {
            opacity: 0.9;
            transform: translate(16px, 18px);
          }
        }

        @media (max-width: 640px) {
          .usdc-image-container {
            width: 205px;
            height: 205px;
          }

          .usdc-image {
            width: 205px;
            height: 205px;
          }

          .usdc-scene::before {
            width: 235px;
            height: 235px;
          }

          .usdc-scene::after {
            width: 290px;
            height: 290px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg-dot,
          .usdc-wrapper,
          .usdc-image-container,
          .usdc-reflection,
          .usdc-scene::before,
          .usdc-scene::after,
          .usdc-dot,
          .usdc-particle {
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
