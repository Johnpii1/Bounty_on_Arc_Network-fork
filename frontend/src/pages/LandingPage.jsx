
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNav } from "../hooks/useNav";
import axios from "axios";
import {
  FiZap,
  FiShield,
  FiArrowRight,
  FiArrowUp,
  FiGlobe,
  FiBriefcase,
} from "react-icons/fi";

import NavBar from "../components/Layout/NavBar";
import LiveTricker from "../components/Layout/LiveTricker";
import BountyCard from "../components/Bounty/BountyCard";
import Hero from "./Hero";
import HowItWorks from "./Howitwork";
import PlatformStats from "./PlatformStats";
import Features from "./Features";
import Testimonials from "./Testimonials";
import CallToAction from "./CallToAction";
import BuiltForWeb3 from "./BuiltForWeb3";
import Footer from "../components/Layout/Footer";

function LandingPage({ dark, setDark }) {
  const [featuredBounties, setFeaturedBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleNavigate } = useNav();

  const [stats, setStats] = useState({
    totalBounties: 0,
    totalRewards: 0,
    totalUsers: 0,
  });

  const [heroText, setHeroText] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const heroMessages = [
    "Web3",
    "Complete Tasks",
    "Earn Crypto",
    "Build Your Skills",
  ];

  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // HERO TEXT ROTATION
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroText((prev) => (prev + 1) % heroMessages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // FETCH FEATURED BOUNTIES AND STATS
  useEffect(() => {
    const fetchFeaturedBounties = async () => {
      try {
        const response = await axios.get(`${API_URL}/bounty/bounties`, {
          params: {
            status: "active",
            limit: 3,
            page: 1,
          },
        });

        let bounties = response.data.bounties || [];

        // 2. Fall back to recent if no active
        if (bounties.length === 0) {
          const recentRes = await axios.get(`${API_URL}/bounty/bounties`, {
            params: { limit: 3, page: 1 }, // no status filter → newest first
          });
          bounties = recentRes.data.bounties || [];
        }

        setFeaturedBounties(bounties);
      } catch (err) {
        console.error("Error fetching featured bounties:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const allBounties = await axios.get(`${API_URL}/bounty/bounties`, {
          params: {
            limit: 1,
          },
        });

        const totalBounties = allBounties.data.pagination?.total || 0;

        setStats({
          totalBounties,
          totalRewards: 124500,
          totalUsers: 845,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchFeaturedBounties();
    fetchStats();
  }, []);

  // INTERSECTION OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");

            entry.target.classList.remove("opacity-0", "translate-y-10");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    if (card1Ref.current) observer.observe(card1Ref.current);
    if (card2Ref.current) observer.observe(card2Ref.current);
    if (card3Ref.current) observer.observe(card3Ref.current);
    if (statsRef.current) observer.observe(statsRef.current);

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // SCROLL TO TOP BUTTON
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`
        relative z-10 flex min-h-screen flex-col
        overflow-x-hidden
        transition-colors duration-500
        ${dark ? "bg-[#080908] text-white" : "bg-[#f6f5ef] text-[#111111]"}
      `}
    >
      {/* =========================================
          NAVIGATION
      ========================================== */}
      <div className="relative z-50 mt-5 w-full py-6">
        <NavBar dark={dark} setDark={setDark} />
      </div>

      {/* =========================================
          LIVE TICKER
      ========================================== */}
      <LiveTricker />

      {/* =========================================
          HERO SECTION
      ========================================== */}
      <div
        className={`
          relative z-10 mx-4 my-2 mt-5
          overflow-hidden rounded-xl
          transition-colors duration-500
          md:mx-8 lg:mx-14
          ${dark ? "bg-[#080908]" : "bg-[#f6f5ef]"}
        `}
      >
        {/* HERO BACKGROUND */}
        <div
          className={`
            absolute inset-0
            transition-colors duration-500
            ${dark ? "bg-[#080908]" : "bg-[#f6f5ef]"}
          `}
        />

        {/* HERO CONTENT */}
        <div className="relative z-10">
          <Hero dark={dark} setDark={setDark} />
        </div>
      </div>

      {/* =========================================
          HOW IT WORKS
      ========================================== */}
      <div>
        <HowItWorks />
      </div>

      {/* =========================================
          PLATFORM STATS
      ========================================== */}
      <div>
        <PlatformStats />
      </div>

      {/* =========================================
          FEATURED BOUNTIES
      ========================================== */}
      <section
        className={`
          relative z-10 my-16
          overflow-hidden px-6
          transition-colors duration-500
          md:px-10 lg:px-16
        `}
      >
        {/* =========================================
            HEADER
        ========================================== */}
        <div className="relative z-10 mx-auto mb-9 flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* ARC LABEL */}
            <div className="mb-4 flex items-center gap-2">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center
                  rounded-xl border
                  transition-all duration-500
                  ${
                    dark
                      ? "border-[#D4AF37]/25 bg-[#121212] text-[#D4AF37]"
                      : "border-[#D4AF37]/20 bg-white text-[#B28B20]"
                  }
                `}
              >
                <FiZap className="h-4 w-4" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B28B20]">
                  Arc Opportunities
                </span>

                <span
                  className={`
                    h-1 w-1 rounded-full
                    transition-colors duration-500
                    ${dark ? "bg-white/20" : "bg-black/20"}
                  `}
                />

                <span
                  className={`
                    text-[10px] font-semibold uppercase tracking-[0.16em]
                    transition-colors duration-500
                    ${dark ? "text-white/45" : "text-[#8b8880]"}
                  `}
                >
                  USDC Bounties
                </span>
              </div>
            </div>

            {/* TITLE */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <h2
                className={`
                  text-[42px] font-black
                  leading-none tracking-[-0.055em]
                  transition-colors duration-500
                  sm:text-[52px] md:text-[58px] lg:text-[64px]
                  ${dark ? "text-white" : "text-[#111111]"}
                `}
              >
                Featured
              </h2>

              <span className="text-[42px] font-black leading-none tracking-[-0.055em] text-[#B28B20] sm:text-[52px] md:text-[58px] lg:text-[64px]">
                Bounties
              </span>
            </div>

            {/* DESCRIPTION */}
            <p
              className={`
                mt-5 max-w-xl text-sm leading-7
                transition-colors duration-500
                ${dark ? "text-white/50" : "text-[#77736b]"}
              `}
            >
              Discover active opportunities, contribute your skills, and work
              toward earning rewards through the Arc-powered bounty experience.
            </p>
          </div>

          {/* VIEW ALL */}
          <Link
            to="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate("/dashboard");
            }}
            className={`
              group inline-flex w-fit items-center gap-2
              rounded-xl border px-4 py-2.5
              text-sm font-semibold
              backdrop-blur-xl
              transition-all duration-300
              hover:-translate-y-0.5
              ${
                dark
                  ? `
                    border-white/[0.08]
                    bg-[#121212]/80
                    text-white/80
                    shadow-[0_8px_30px_rgba(0,0,0,0.25)]
                    hover:border-[#D4AF37]/35
                    hover:bg-[#181818]
                    hover:text-[#D4AF37]
                  `
                  : `
                    border-black/[0.08]
                    bg-white/75
                    text-[#383631]
                    shadow-[0_8px_30px_rgba(35,31,22,0.04)]
                    hover:border-[#D4AF37]/35
                    hover:bg-white
                    hover:text-[#B28B20]
                  `
              }
            `}
          >
            <span>View all bounties</span>

            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* =========================================
            BOUNTIES
        ========================================== */}
        {loading ? (
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`
                  relative h-[280px]
                  overflow-hidden rounded-[24px]
                  border p-5
                  backdrop-blur-xl
                  transition-colors duration-500
                  ${
                    dark
                      ? `
                        border-white/[0.07]
                        bg-[#121212]/80
                        shadow-[0_15px_45px_rgba(0,0,0,0.25)]
                      `
                      : `
                        border-black/[0.07]
                        bg-white/65
                        shadow-[0_15px_45px_rgba(35,31,22,0.05)]
                      `
                  }
                `}
              >
                <div
                  className={`
                    absolute inset-0
                    -translate-x-full
                    animate-[featuredLoading_1.8s_ease-in-out_infinite]
                    bg-gradient-to-r
                    from-transparent
                    ${dark ? "via-white/[0.04]" : "via-white/60"}
                    to-transparent
                  `}
                />

                <div className="relative">
                  <div className="mb-6 flex justify-between">
                    <div
                      className={`
                        h-10 w-10 rounded-xl
                        ${dark ? "bg-white/[0.06]" : "bg-black/[0.055]"}
                      `}
                    />

                    <div
                      className={`
                        h-6 w-20 rounded-full
                        ${dark ? "bg-white/[0.05]" : "bg-black/[0.045]"}
                      `}
                    />
                  </div>

                  <div
                    className={`
                      mb-3 h-5 w-3/4 rounded
                      ${dark ? "bg-white/[0.06]" : "bg-black/[0.055]"}
                    `}
                  />

                  <div
                    className={`
                      mb-2 h-3 w-full rounded
                      ${dark ? "bg-white/[0.04]" : "bg-black/[0.035]"}
                    `}
                  />

                  <div
                    className={`
                      mb-6 h-3 w-5/6 rounded
                      ${dark ? "bg-white/[0.04]" : "bg-black/[0.035]"}
                    `}
                  />

                  <div className="flex gap-2">
                    <div
                      className={`
                        h-7 w-16 rounded-lg
                        ${dark ? "bg-white/[0.05]" : "bg-black/[0.04]"}
                      `}
                    />

                    <div
                      className={`
                        h-7 w-20 rounded-lg
                        ${dark ? "bg-white/[0.05]" : "bg-black/[0.04]"}
                      `}
                    />
                  </div>

                  <div
                    className={`
                      mt-8 h-9 w-full rounded-xl
                      ${dark ? "bg-white/[0.05]" : "bg-black/[0.045]"}
                    `}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : featuredBounties.length === 0 ? (
          /* EMPTY STATE */
          <div
            className={`
              relative z-10 mx-auto max-w-7xl
              overflow-hidden rounded-[26px]
              border backdrop-blur-xl
              transition-all duration-500
              ${
                dark
                  ? `
                    border-white/[0.07]
                    bg-[#121212]/80
                    shadow-[0_20px_60px_rgba(0,0,0,0.3)]
                  `
                  : `
                    border-black/[0.07]
                    bg-white/75
                    shadow-[0_20px_60px_rgba(35,31,22,0.06)]
                  `
              }
            `}
          >
            <div className="relative flex flex-col items-center justify-center px-6 py-20 text-center">
              <div
                className={`
                  mb-5 flex h-16 w-16
                  items-center justify-center
                  rounded-2xl border
                  transition-all duration-500
                  ${
                    dark
                      ? "border-[#D4AF37]/25 bg-[#181818] text-[#D4AF37] shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
                      : "border-[#D4AF37]/20 bg-white text-[#B28B20] shadow-[0_12px_35px_rgba(35,31,22,0.06)]"
                  }
                `}
              >
                <FiBriefcase className="h-7 w-7" />
              </div>

              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#B28B20]">
                  Arc Marketplace
                </span>
              </div>

              <h3
                className={`
                  text-lg font-bold
                  transition-colors duration-500
                  ${dark ? "text-white" : "text-[#171717]"}
                `}
              >
                No active bounties
              </h3>

              <p
                className={`
                  mt-2 max-w-md text-sm leading-6
                  transition-colors duration-500
                  ${dark ? "text-white/45" : "text-[#77736b]"}
                `}
              >
                There are no featured opportunities available right now. New
                bounties will appear here as they are posted.
              </p>

              <Link
                to="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate("/dashboard");
                }}
                className={`
                  mt-6 inline-flex items-center gap-2
                  rounded-xl border px-5 py-2.5
                  text-sm font-semibold
                  transition-all duration-300
                  hover:-translate-y-0.5
                  ${
                    dark
                      ? `
                        border-[#D4AF37]/40
                        bg-[#181818]
                        text-[#D4AF37]
                        shadow-[0_10px_25px_rgba(0,0,0,0.25)]
                        hover:border-[#D4AF37]
                      `
                      : `
                        border-[#D4AF37]/40
                        bg-white
                        text-[#8F6D12]
                        shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                        hover:border-[#D4AF37]
                        hover:text-[#B28B20]
                      `
                  }
                `}
              >
                Browse bounties
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE BOUNTIES */
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredBounties.map((bounty, index) => (
              <div
                key={bounty._id}
                className="featured-bounty-card group relative"
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* HOVER AURA */}
                <div className="pointer-events-none absolute -inset-2 rounded-[28px] bg-[#D4AF37]/[0.06] opacity-0 blur-2xl transition-all duration-700 group-hover:opacity-100" />

                {/* TOP ARC INDICATOR */}
                <div className="pointer-events-none absolute left-8 right-8 top-0 z-20 h-px overflow-hidden">
                  <div className="featured-bounty-line h-full w-1/3 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                </div>

                {/* BOUNTY CARD */}
                <div className="relative transition-all duration-500 group-hover:-translate-y-1.5">
                  <BountyCard bounty={bounty} />
                </div>

                {/* ARC / USDC LABEL */}
                <div
                  className={`
                    pointer-events-none absolute bottom-3 right-3 z-30
                    flex items-center gap-1.5
                    rounded-full border
                    px-2 py-1
                    opacity-0 shadow-sm
                    backdrop-blur-md
                    transition-all duration-300
                    group-hover:opacity-100
                    ${
                      dark
                        ? "border-[#D4AF37]/20 bg-[#121212]/90"
                        : "border-[#D4AF37]/15 bg-white/90"
                    }
                  `}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />

                  <span className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#B28B20]">
                    Arc / USDC
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================
            BOTTOM MICRO INFO
        ========================================== */}
        <div
          className={`
            relative z-10 mx-auto mt-6
            flex max-w-7xl flex-wrap
            items-center justify-between gap-3
            border-t pt-5
            transition-colors duration-500
            ${dark ? "border-white/[0.07]" : "border-black/[0.06]"}
          `}
        >
          <div className="flex items-center gap-2">
            <FiGlobe
              className={`h-3.5 w-3.5 ${
                dark ? "text-white/35" : "text-[#8b8880]"
              }`}
            />

            <span
              className={`
                text-[9px] font-semibold uppercase tracking-[0.16em]
                ${dark ? "text-white/35" : "text-[#97938a]"}
              `}
            >
              Open Web3 Opportunities
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FiShield className="h-3.5 w-3.5 text-[#B28B20]" />

            <span
              className={`
                text-[9px] font-semibold uppercase tracking-[0.16em]
                ${dark ? "text-white/35" : "text-[#97938a]"}
              `}
            >
              On-chain • USDC • Arc
            </span>
          </div>
        </div>
      </section>

      {/* =========================================
          LIVE TICKER
      ========================================== */}
      <LiveTricker />

      {/* =========================================
          WHY HAPPY BOUNTY
      ========================================== */}
      <div>
        <Features />
      </div>

      {/* =========================================
          TESTIMONIALS
      ========================================== */}
      <div>
        <Testimonials />
      </div>

      {/* =========================================
          BUILT FOR WEB3
      ========================================== */}
      <div>
        <BuiltForWeb3 />
      </div>

      {/* =========================================
          LIVE TICKER
      ========================================== */}
      <LiveTricker />

      {/* =========================================
          FINAL CTA
      ========================================== */}
      <div>
        <CallToAction />
      </div>

      {/* =========================================
          FOOTER
      ========================================== */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* =========================================
          SCROLL TO TOP BUTTON
      ========================================== */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
        className={`group fixed bottom-7 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition-all duration-500 sm:bottom-8 sm:right-8 ${
          showScrollTop
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-5 scale-75 opacity-0"
        } ${
          dark
            ? "border-white/[0.1] bg-[#111311]/90 text-white/70 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
            : "border-black/[0.09] bg-white/90 text-black/60 shadow-[0_10px_35px_rgba(17,17,17,0.12)]"
        } hover:-translate-y-1 hover:border-[#D4A017]/50 hover:bg-[#D4A017] hover:text-white hover:shadow-[0_12px_35px_rgba(212,160,23,0.3)]`}
      >
        <FiArrowUp className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5" />

        <span className="pointer-events-none absolute inset-0 rounded-full border border-[#D4A017]/0 transition-all duration-500 group-hover:scale-125 group-hover:border-[#D4A017]/20" />
      </button>

      {/* =========================================
          FEATURED BOUNTY ANIMATIONS
      ========================================== */}
      <style>{`
        @keyframes featuredLoading {
          0% {
            transform: translateX(-100%);
          }

          55%,
          100% {
            transform: translateX(220%);
          }
        }

        .featured-bounty-card {
          opacity: 0;
          transform: translateY(18px);
          animation:
            featuredBountyReveal
            0.75s
            cubic-bezier(.22, 1, .36, 1)
            forwards;
        }

        @keyframes featuredBountyReveal {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.985);
          }

          70% {
            opacity: 1;
            transform: translateY(-2px) scale(1.002);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .featured-bounty-line {
          animation:
            bountyLineMove
            3.8s
            ease-in-out
            infinite;
        }

        @keyframes bountyLineMove {
          0% {
            transform: translateX(-140%);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          60% {
            opacity: 1;
          }

          100% {
            transform: translateX(420%);
            opacity: 0;
          }
        }

        @media (max-width: 767px) {
          .featured-bounty-card {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-bounty-card,
          .featured-bounty-line,
          .featured-bounty-card *::before,
          .featured-bounty-card *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }

          .featured-bounty-card {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
