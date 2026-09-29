import { useEffect, useRef, useState } from "react";
import {
  FiBriefcase,
  FiCheck,
  FiGlobe,
  FiLock,
  FiShield,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Detect global dark mode from <html class="dark">
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  /* =====================================================
     DARK MODE OBSERVER
  ===================================================== */
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

  /* =====================================================
     SCROLL REVEAL
  ===================================================== */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

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
    <section
      ref={sectionRef}
      className={`how-it-works-section ${
        isVisible ? "how-it-works-visible" : ""
      }`}
    >
      {/* =====================================================
          BACKGROUND DETAILS
      ===================================================== */}

      <div className="section-glow section-glow-blue" />
      <div className="section-glow section-glow-gold" />

      <div className="section-grid-pattern" />

      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="how-it-works-header">
        <span className="how-it-works-label">
          <span className="label-dot" />
          BUILT FOR ARC
        </span>

        <h2>
          Discover.{" "}
          <span>Contribute.</span>{" "}
          <strong>Earn USDC.</strong>
        </h2>

        <p>
          A simple way to discover Web3 opportunities, complete meaningful
          work, and receive rewards through an Arc-powered bounty experience.
        </p>
      </div>

      {/* =====================================================
          CARDS
      ===================================================== */}

      <div className="how-it-works-grid">
        {/* ===================================================
            CARD 1 — DISCOVER
        =================================================== */}

        <div className="how-it-works-card">
          <div className="card-top-line" />

          <div className="card-number">01</div>

          <div className="visual-area">
            <div className="discover-visual">
              <div className="discover-wallet">
                <div className="wallet-top">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="wallet-screen">
                  <FiGlobe className="wallet-icon" />

                  <div className="wallet-content">
                    <span className="wallet-title" />

                    <div className="wallet-lines">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>

              <div className="discover-orbit orbit-one">
                <span className="orbit-dot blue-dot" />
              </div>

              <div className="discover-orbit orbit-two">
                <span className="orbit-dot gold-dot" />
              </div>

              <div className="visual-pulse pulse-one" />
              <div className="visual-pulse pulse-two" />

              <FiZap className="discover-icon" />
            </div>
          </div>

          <div className="card-content">
            <div className="card-icon blue-icon">
              <FiGlobe />
            </div>

            <div className="card-step">STEP 01</div>

            <h3>Discover Bounties</h3>

            <p>
              Explore opportunities from Web3 projects and find bounties
              that match your skills and interests.
            </p>
          </div>
        </div>

        {/* ===================================================
            CARD 2 — CONNECT
        =================================================== */}

        <div className="how-it-works-card">
          <div className="card-top-line" />

          <div className="card-number">02</div>

          <div className="visual-area">
            <div className="connect-visual">
              <div className="dashboard-window">
                <div className="dashboard-header">
                  <span />
                  <span />
                  <span />

                  <div className="dashboard-status">
                    <i />
                    ARC
                  </div>
                </div>

                <div className="dashboard-body">
                  <div className="dashboard-sidebar">
                    <span />
                    <span className="active" />
                    <span />
                    <span />
                  </div>

                  <div className="dashboard-main">
                    <div className="dashboard-title" />

                    <div className="dashboard-cards">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="dashboard-line" />
                    <div className="dashboard-line short" />
                  </div>
                </div>
              </div>

              <div className="user-node user-one">
                <FiUser />
              </div>

              <div className="user-node user-two">
                <FiUsers />
              </div>

              <div className="connection-line line-one" />
              <div className="connection-line line-two" />

              <div className="connection-dot connection-dot-one" />
              <div className="connection-dot connection-dot-two" />
            </div>
          </div>

          <div className="card-content">
            <div className="card-icon purple-icon">
              <FiUsers />
            </div>

            <div className="card-step">STEP 02</div>

            <h3>Connect & Contribute</h3>

            <p>
              Join projects, connect your wallet, submit your work, and
              collaborate with teams building on-chain.
            </p>
          </div>
        </div>

        {/* ===================================================
            CARD 3 — COMPLETE
        =================================================== */}

        <div className="how-it-works-card">
          <div className="card-top-line" />

          <div className="card-number">03</div>

          <div className="visual-area">
            <div className="complete-visual">
              <div className="task-window">
                <div className="task-header">
                  <span>BOUNTY TASK</span>

                  <div className="task-status">
                    <span />
                    ACTIVE
                  </div>
                </div>

                <div className="task-title">
                  <span />
                  <span />
                </div>

                <div className="task-progress">
                  <div />
                </div>

                <div className="task-bottom">
                  <FiCheck />

                  <span>Submission verified</span>
                </div>
              </div>

              <div className="completion-ring ring-one" />
              <div className="completion-ring ring-two" />

              <div className="completion-check">
                <FiCheck />
              </div>

              <div className="verified-badge">
                <FiShield />
                VERIFIED
              </div>
            </div>
          </div>

          <div className="card-content">
            <div className="card-icon gold-icon">
              <FiCheck />
            </div>

            <div className="card-step">STEP 03</div>

            <h3>Complete the Work</h3>

            <p>
              Deliver quality work, meet the bounty requirements, and have
              your contribution reviewed by the project.
            </p>
          </div>
        </div>

        {/* ===================================================
            CARD 4 — EARN
        =================================================== */}

        <div className="how-it-works-card">
          <div className="card-top-line" />

          <div className="card-number">04</div>

          <div className="visual-area">
            <div className="earn-visual">
              <div className="earning-box">
                <div className="earning-icon">
                  <span>$</span>
                </div>

                <div className="earning-info">
                  <span>BOUNTY REWARD</span>
                  <strong>+450 USDC</strong>
                </div>

                <div className="earning-check">
                  <FiCheck />
                </div>
              </div>

              <div className="energy-ring energy-one" />
              <div className="energy-ring energy-two" />

              <div className="energy-particle particle-one" />
              <div className="energy-particle particle-two" />
              <div className="energy-particle particle-three" />

              <FiShield className="earn-shield" />
            </div>
          </div>

          <div className="card-content">
            <div className="card-icon blue-icon">
              <FiLock />
            </div>

            <div className="card-step">STEP 04</div>

            <h3>Get Rewarded in USDC</h3>

            <p>
              Complete the bounty, receive your reward, and build your
              reputation through meaningful Web3 contributions.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          ARC FOOTER STRIP
      ===================================================== */}

      <div className="arc-strip">
        <div className="arc-strip-line" />

        <div className="arc-strip-content">
          <div className="arc-strip-item">
            <span className="arc-strip-dot blue" />
            <span>ARC</span>
          </div>

          <div className="arc-strip-divider" />

          <div className="arc-strip-item">
            <span className="arc-strip-dot gold" />
            <span>USDC REWARDS</span>
          </div>

          <div className="arc-strip-divider" />

          <div className="arc-strip-item">
            <span className="arc-strip-dot pink" />
            <span>ON-CHAIN BOUNTIES</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`
        /* =====================================================
           SECTION
        ===================================================== */

        .how-it-works-section {
          position: relative;
          width: 100%;
          padding: 95px 24px 85px;
          overflow: hidden;

          background: ${
            dark
              ? "linear-gradient(180deg, #080908 0%, #0d0d0d 48%, #0a0b0a 100%)"
              : "linear-gradient(180deg, #faf9f5 0%, #ffffff 48%, #f7f3e7 100%)"
          };

          color: ${dark ? "#ffffff" : "#111111"};

          transition:
            background 0.4s ease,
            color 0.4s ease;
        }

        /* =====================================================
           BACKGROUND
        ===================================================== */

        .section-glow {
          position: absolute;
          pointer-events: none;
          border-radius: 9999px;
          filter: blur(100px);
        }

        .section-glow-blue {
          top: 5%;
          left: -160px;
          width: 430px;
          height: 430px;

          background: ${
            dark
              ? "rgba(212, 175, 55, 0.035)"
              : "rgba(212, 175, 55, 0.055)"
          };
        }

        .section-glow-gold {
          right: -150px;
          bottom: -130px;
          width: 430px;
          height: 430px;

          background: ${
            dark
              ? "rgba(212, 175, 55, 0.045)"
              : "rgba(212, 175, 55, 0.065)"
          };
        }

        .section-grid-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: ${dark ? "0.65" : "0.35"};

          background-image:
            linear-gradient(
              ${
                dark
                  ? "rgba(255, 255, 255, 0.025)"
                  : "rgba(20, 20, 20, 0.035)"
              } 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              ${
                dark
                  ? "rgba(255, 255, 255, 0.025)"
                  : "rgba(20, 20, 20, 0.035)"
              } 1px,
              transparent 1px
            );

          background-size: 55px 55px;

          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .how-it-works-header {
          position: relative;
          z-index: 2;
          max-width: 780px;
          margin: 0 auto 58px;
          text-align: center;
        }

        .how-it-works-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 8px 14px;

          border: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(20, 20, 20, 0.1)"
          };

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.035)"
              : "rgba(255, 255, 255, 0.78)"
          };

          color: ${dark ? "#a8ada8" : "#6b6b6b"};

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.17em;

          box-shadow:
            0 8px 25px ${
              dark ? "rgba(0, 0, 0, 0.22)" : "rgba(0, 0, 0, 0.035)"
            },
            inset 0 1px ${
              dark
                ? "rgba(255, 255, 255, 0.035)"
                : "rgba(255, 255, 255, 0.8)"
            };

          transition:
            background 0.35s ease,
            border-color 0.35s ease,
            color 0.35s ease;
        }

        .label-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;

          background: #d4af37;

          box-shadow:
            0 0 8px rgba(212, 175, 55, 0.55),
            0 0 18px rgba(212, 175, 55, 0.22);
        }

        .how-it-works-header h2 {
          margin: 19px 0 13px;

          font-size: clamp(2.1rem, 5vw, 3.7rem);
          line-height: 0.98;

          font-weight: 800;
          letter-spacing: -0.055em;

          color: ${dark ? "#f5f5f5" : "#101010"};

          transition: color 0.35s ease;
        }

        .how-it-works-header h2 span {
          background:
            linear-gradient(
              90deg,
              ${dark ? "#c79d24" : "#a98218"},
              #d4af37,
              #e3c765
            );

          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .how-it-works-header h2 strong {
          color: ${dark ? "#d4af37" : "#a98218"};
          font-weight: 800;
        }

        .how-it-works-header p {
          max-width: 610px;
          margin: 0 auto;

          color: ${dark ? "#9a9f9a" : "#6e6e6e"};

          font-size: 14px;
          line-height: 1.75;

          transition: color 0.35s ease;
        }

        /* =====================================================
           GRID
        ===================================================== */

        .how-it-works-grid {
          position: relative;
          z-index: 2;

          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));

          gap: 17px;

          max-width: 1400px;
          margin: 0 auto;
        }

        /* =====================================================
           CARD
        ===================================================== */

        .how-it-works-card {
          position: relative;

          min-height: 390px;
          padding: 22px 20px 24px;

          overflow: hidden;

          border: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(25, 25, 25, 0.11)"
          };

          border-radius: 22px;

          background: ${
            dark
              ? "linear-gradient(145deg, rgba(21, 23, 21, 0.97), rgba(17, 19, 17, 0.9))"
              : "linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(249, 248, 243, 0.8))"
          };

          box-shadow:
            0 10px 35px ${
              dark ? "rgba(0, 0, 0, 0.28)" : "rgba(0, 0, 0, 0.045)"
            },
            inset 0 1px ${
              dark
                ? "rgba(255, 255, 255, 0.025)"
                : "rgba(255, 255, 255, 0.95)"
            };

          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.35s ease,
            box-shadow 0.35s ease,
            background 0.35s ease;
        }

        .how-it-works-card::before {
          content: "";

          position: absolute;
          inset: 0;

          pointer-events: none;

          background:
            radial-gradient(
              circle at 50% 20%,
              rgba(212, 175, 55, ${dark ? "0.075" : "0.065"}),
              transparent 45%
            );

          opacity: 0;

          transition: opacity 0.4s ease;
        }

        .how-it-works-card:hover {
          transform: translateY(-8px);

          border-color: rgba(212, 175, 55, 0.3);

          box-shadow:
            0 22px 55px ${
              dark ? "rgba(0, 0, 0, 0.42)" : "rgba(0, 0, 0, 0.08)"
            },
            0 0 0 1px rgba(212, 175, 55, 0.045),
            0 10px 35px rgba(212, 175, 55, ${dark ? "0.045" : "0.055"});
        }

        .how-it-works-card:hover::before {
          opacity: 1;
        }

        .card-top-line {
          position: absolute;

          top: 0;
          left: 15%;
          right: 15%;

          height: 1px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(212, 175, 55, 0.2),
              rgba(212, 175, 55, 0.75),
              rgba(212, 175, 55, 0.2),
              transparent
            );

          opacity: 0.7;
        }

        .card-number {
          position: absolute;

          top: 17px;
          right: 18px;

          color: ${
            dark
              ? "rgba(255, 255, 255, 0.28)"
              : "rgba(20, 20, 20, 0.28)"
          };

          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        /* =====================================================
           VISUAL AREA
        ===================================================== */

        .visual-area {
          position: relative;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          height: 170px;

          margin-bottom: 17px;
        }

        /* =====================================================
           CARD CONTENT
        ===================================================== */

        .card-content {
          position: relative;
          z-index: 2;
        }

        .card-step {
          margin-bottom: 5px;

          color: ${dark ? "#858b85" : "#99948a"};

          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.16em;
        }

        .card-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 32px;
          height: 32px;

          margin-bottom: 11px;

          border-radius: 9px;

          font-size: 14px;

          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .how-it-works-card:hover .card-icon {
          transform: translateY(-2px) scale(1.04);
        }

        .blue-icon,
        .purple-icon,
        .gold-icon {
          border: 1px solid rgba(212, 175, 55, 0.22);
          background: rgba(212, 175, 55, 0.075);
          color: ${dark ? "#d4af37" : "#b08a1e"};

          box-shadow:
            0 5px 20px rgba(212, 175, 55, 0.06);
        }

        .card-content h3 {
          margin: 0 0 8px;

          color: ${dark ? "#f4f4f4" : "#151515"};

          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.015em;

          transition: color 0.35s ease;
        }

        .card-content p {
          margin: 0;

          color: ${dark ? "#9a9f9a" : "#737373"};

          font-size: 12px;
          line-height: 1.7;

          transition: color 0.35s ease;
        }

        /* =====================================================
           DISCOVER VISUAL
        ===================================================== */

        .discover-visual {
          position: relative;

          width: 185px;
          height: 115px;
        }

        .discover-wallet {
          position: absolute;

          left: 50%;
          top: 50%;

          z-index: 3;

          width: 116px;
          height: 72px;

          transform: translate(-50%, -50%);

          border: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(20, 20, 20, 0.1)"
          };

          border-radius: 13px;

          background: ${
            dark
              ? "rgba(17, 19, 17, 0.96)"
              : "rgba(255, 255, 255, 0.94)"
          };

          box-shadow:
            0 20px 35px ${
              dark ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.08)"
            },
            0 0 30px rgba(212, 175, 55, ${dark ? "0.045" : "0.06"});

          backdrop-filter: blur(15px);
        }

        .wallet-top {
          display: flex;
          align-items: center;
          gap: 4px;

          height: 18px;
          padding: 0 8px;

          border-bottom: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.055)"
              : "rgba(20, 20, 20, 0.06)"
          };
        }

        .wallet-top span {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(20, 20, 20, 0.22)"
          };
        }

        .wallet-screen {
          display: flex;
          align-items: center;
          gap: 9px;

          padding: 12px;
        }

        .wallet-icon {
          color: #c09a27;

          font-size: 17px;

          filter:
            drop-shadow(
              0 0 8px rgba(212, 175, 55, 0.35)
            );
        }

        .wallet-content {
          flex: 1;
        }

        .wallet-title {
          display: block;

          width: 55%;
          height: 4px;

          margin-bottom: 7px;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.16)"
              : "rgba(20, 20, 20, 0.15)"
          };
        }

        .wallet-lines {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .wallet-lines span {
          height: 3px;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.075)"
              : "rgba(20, 20, 20, 0.08)"
          };
        }

        .wallet-lines span:nth-child(1) {
          width: 85%;
        }

        .wallet-lines span:nth-child(2) {
          width: 65%;
        }

        .wallet-lines span:nth-child(3) {
          width: 45%;
        }

        .discover-orbit {
          position: absolute;

          left: 50%;
          top: 50%;

          border: 1px solid rgba(212, 175, 55, 0.15);

          border-radius: 50%;

          transform: translate(-50%, -50%);
        }

        .orbit-one {
          width: 150px;
          height: 65px;

          transform:
            translate(-50%, -50%)
            rotate(-15deg);

          animation: arcOrbitOne 7s linear infinite;
        }

        .orbit-two {
          width: 170px;
          height: 78px;

          border-color: rgba(212, 175, 55, 0.18);

          transform:
            translate(-50%, -50%)
            rotate(25deg);

          animation: arcOrbitTwo 10s linear infinite reverse;
        }

        .orbit-dot {
          position: absolute;

          top: -4px;
          left: 50%;

          width: 7px;
          height: 7px;

          border-radius: 50%;

          transform: translateX(-50%);
        }

        .blue-dot,
        .gold-dot {
          background: #d4af37;

          box-shadow:
            0 0 8px rgba(212, 175, 55, 0.6),
            0 0 18px rgba(212, 175, 55, 0.25);
        }

        .discover-icon {
          position: absolute;

          right: 4px;
          top: 10px;

          color: rgba(184, 145, 31, 0.7);

          font-size: 13px;

          animation: softFloat 3.5s ease-in-out infinite;
        }

        .visual-pulse {
          position: absolute;

          left: 50%;
          top: 50%;

          border-radius: 50%;

          transform: translate(-50%, -50%);

          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .pulse-one {
          width: 100px;
          height: 100px;

          animation: pulseRing 3s ease-out infinite;
        }

        .pulse-two {
          width: 125px;
          height: 125px;

          animation: pulseRing 3s ease-out infinite 1.2s;
        }

        /* =====================================================
           CONNECT VISUAL
        ===================================================== */

        .connect-visual {
          position: relative;

          width: 185px;
          height: 115px;
        }

        .dashboard-window {
          position: absolute;

          left: 50%;
          top: 50%;

          z-index: 2;

          width: 155px;
          height: 88px;

          overflow: hidden;

          transform: translate(-50%, -50%);

          border: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(20, 20, 20, 0.1)"
          };

          border-radius: 11px;

          background: ${
            dark
              ? "rgba(17, 19, 17, 0.96)"
              : "rgba(255, 255, 255, 0.94)"
          };

          box-shadow:
            0 18px 35px ${
              dark ? "rgba(0, 0, 0, 0.36)" : "rgba(0, 0, 0, 0.08)"
            },
            0 0 25px rgba(212, 175, 55, 0.055);

          backdrop-filter: blur(15px);

          animation: dashboardFloat 4.5s ease-in-out infinite;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          gap: 4px;

          height: 18px;
          padding: 0 7px;

          border-bottom: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.055)"
              : "rgba(20, 20, 20, 0.06)"
          };
        }

        .dashboard-header > span {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.18)"
              : "rgba(20, 20, 20, 0.2)"
          };
        }

        .dashboard-status {
          display: flex;
          align-items: center;
          gap: 4px;

          margin-left: auto;

          color: ${dark ? "#d4af37" : "#b08a1e"};

          font-size: 5px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .dashboard-status i {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #d4af37;

          box-shadow: 0 0 7px rgba(212, 175, 55, 0.55);
        }

        .dashboard-body {
          display: flex;

          height: calc(100% - 18px);
        }

        .dashboard-sidebar {
          display: flex;

          width: 29px;

          flex-direction: column;
          gap: 7px;

          padding: 8px 7px;

          border-right: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.045)"
              : "rgba(20, 20, 20, 0.05)"
          };
        }

        .dashboard-sidebar span {
          width: 100%;
          height: 3px;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.075)"
              : "rgba(20, 20, 20, 0.08)"
          };
        }

        .dashboard-sidebar .active {
          background: rgba(212, 175, 55, 0.7);
        }

        .dashboard-main {
          flex: 1;
          padding: 9px;
        }

        .dashboard-title {
          width: 48%;
          height: 5px;

          margin-bottom: 8px;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.14)"
              : "rgba(20, 20, 20, 0.14)"
          };
        }

        .dashboard-cards {
          display: flex;
          gap: 5px;

          margin-bottom: 8px;
        }

        .dashboard-cards span {
          flex: 1;

          height: 22px;

          border: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.055)"
              : "rgba(20, 20, 20, 0.055)"
          };

          border-radius: 5px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.025)"
              : "rgba(20, 20, 20, 0.025)"
          };
        }

        .dashboard-cards span:first-child {
          border-color: rgba(212, 175, 55, 0.18);
          background: rgba(212, 175, 55, 0.07);
        }

        .dashboard-line {
          width: 80%;
          height: 3px;

          margin-bottom: 5px;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.07)"
              : "rgba(20, 20, 20, 0.07)"
          };
        }

        .dashboard-line.short {
          width: 55%;
        }

        .user-node {
          position: absolute;

          z-index: 4;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 27px;
          height: 27px;

          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 50%;

          background: ${
            dark
              ? "rgba(21, 23, 21, 0.98)"
              : "rgba(255, 255, 255, 0.97)"
          };

          color: ${dark ? "#d4af37" : "#b08a1e"};

          font-size: 11px;

          box-shadow:
            0 8px 18px ${
              dark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.08)"
            },
            0 0 15px rgba(212, 175, 55, 0.1);
        }

        .user-one {
          left: -3px;
          top: 14px;

          animation: nodeFloat 3.5s ease-in-out infinite;
        }

        .user-two {
          right: -3px;
          bottom: 14px;

          color: ${dark ? "#d4af37" : "#b08a1e"};

          border-color: rgba(212, 175, 55, 0.22);

          animation: nodeFloat 4s ease-in-out infinite 0.7s;
        }

        .connection-line {
          position: absolute;

          z-index: 1;

          width: 38px;
          height: 1px;

          background:
            linear-gradient(
              90deg,
              rgba(212, 175, 55, 0),
              rgba(212, 175, 55, 0.5)
            );
        }

        .line-one {
          left: 3px;
          top: 31px;

          transform: rotate(20deg);
        }

        .line-two {
          right: 3px;
          bottom: 31px;

          transform: rotate(20deg);

          background:
            linear-gradient(
              90deg,
              rgba(212, 175, 55, 0.5),
              rgba(212, 175, 55, 0)
            );
        }

        .connection-dot {
          position: absolute;

          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #d4af37;

          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);

          animation: connectionMove 2.8s ease-in-out infinite;
        }

        .connection-dot-one {
          left: 26px;
          top: 38px;
        }

        .connection-dot-two {
          right: 27px;
          bottom: 37px;

          animation-delay: 1s;
        }

        /* =====================================================
           COMPLETE VISUAL
        ===================================================== */

        .complete-visual {
          position: relative;

          width: 185px;
          height: 115px;
        }

        .task-window {
          position: absolute;

          left: 50%;
          top: 50%;

          z-index: 3;

          width: 155px;
          height: 67px;

          padding: 9px 11px;

          transform: translate(-50%, -50%);

          border: 1px solid ${
            dark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(20, 20, 20, 0.1)"
          };

          border-radius: 11px;

          background: ${
            dark
              ? "rgba(17, 19, 17, 0.96)"
              : "rgba(255, 255, 255, 0.94)"
          };

          box-shadow:
            0 18px 35px ${
              dark ? "rgba(0, 0, 0, 0.36)" : "rgba(0, 0, 0, 0.08)"
            },
            0 0 25px rgba(212, 175, 55, 0.06);

          backdrop-filter: blur(15px);

          animation: taskFloat 5s ease-in-out infinite;
        }

        .task-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          color: ${dark ? "#8f958f" : "#8b8b8b"};

          font-size: 7px;
          font-weight: 600;

          letter-spacing: 0.12em;
        }

        .task-status {
          display: flex;
          align-items: center;
          gap: 4px;

          color: ${dark ? "#898f89" : "#777"};

          font-size: 6px;
        }

        .task-status span {
          width: 4px;
          height: 4px;

          border-radius: 50%;

          background: #d4af37;

          box-shadow: 0 0 7px rgba(212, 175, 55, 0.55);
        }

        .task-title {
          display: flex;
          flex-direction: column;
          gap: 4px;

          margin-top: 7px;
        }

        .task-title span {
          display: block;

          width: 60%;
          height: 4px;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.13)"
              : "rgba(20, 20, 20, 0.13)"
          };
        }

        .task-title span:last-child {
          width: 38%;
        }

        .task-progress {
          width: 100%;
          height: 3px;

          margin-top: 8px;

          overflow: hidden;

          border-radius: 999px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.06)"
              : "rgba(20, 20, 20, 0.06)"
          };
        }

        .task-progress div {
          width: 82%;
          height: 100%;

          border-radius: inherit;

          background:
            linear-gradient(
              90deg,
              #b08a1e,
              #d4af37,
              #e3c765
            );

          box-shadow:
            0 0 10px rgba(212, 175, 55, 0.3);
        }

        .task-bottom {
          display: flex;
          align-items: center;
          gap: 5px;

          margin-top: 7px;

          color: ${dark ? "#858a85" : "#777"};

          font-size: 6px;
        }

        .task-bottom svg {
          color: ${dark ? "#d4af37" : "#b08a1e"};
          font-size: 9px;
        }

        .completion-ring {
          position: absolute;

          left: 50%;
          top: 50%;

          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 50%;

          transform: translate(-50%, -50%);
        }

        .ring-one {
          width: 165px;
          height: 82px;

          transform:
            translate(-50%, -50%)
            rotate(-12deg);

          animation: ringRotate 10s linear infinite;
        }

        .ring-two {
          width: 145px;
          height: 100px;

          border-color: rgba(212, 175, 55, 0.13);

          transform:
            translate(-50%, -50%)
            rotate(25deg);

          animation: ringRotate 13s linear infinite reverse;
        }

        .completion-check {
          position: absolute;

          right: 1px;
          top: 4px;

          display: flex;
          align-items: center;
          justify-content: center;

          width: 25px;
          height: 25px;

          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 50%;

          background: rgba(212, 175, 55, 0.08);

          color: ${dark ? "#d4af37" : "#b08a1e"};

          font-size: 11px;

          box-shadow:
            0 8px 18px rgba(212, 175, 55, 0.09);

          animation: checkPulse 2.5s ease-in-out infinite;
        }

        .verified-badge {
          position: absolute;

          left: 0;
          bottom: 3px;

          display: flex;
          align-items: center;
          gap: 4px;

          padding: 5px 7px;

          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 999px;

          background: ${
            dark
              ? "rgba(17, 19, 17, 0.96)"
              : "rgba(255, 255, 255, 0.94)"
          };

          color: ${dark ? "#d4af37" : "#a17c16"};

          font-size: 5px;
          font-weight: 700;
          letter-spacing: 0.08em;

          box-shadow:
            0 7px 18px ${
              dark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.055)"
            };

          animation: badgeFloat 3.5s ease-in-out infinite;
        }

        .verified-badge svg {
          font-size: 8px;
        }

        /* =====================================================
           EARN VISUAL
        ===================================================== */

        .earn-visual {
          position: relative;

          width: 185px;
          height: 115px;
        }

        .earning-box {
          position: absolute;

          left: 50%;
          top: 50%;

          z-index: 3;

          display: flex;
          align-items: center;
          gap: 9px;

          width: 164px;
          height: 67px;

          padding: 10px;

          transform: translate(-50%, -50%);

          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;

          background: ${
            dark
              ? "rgba(17, 19, 17, 0.96)"
              : "rgba(255, 255, 255, 0.94)"
          };

          box-shadow:
            0 18px 35px ${
              dark ? "rgba(0, 0, 0, 0.36)" : "rgba(0, 0, 0, 0.08)"
            },
            0 0 30px rgba(212, 175, 55, 0.065);

          backdrop-filter: blur(15px);

          animation: earningFloat 4.2s ease-in-out infinite;
        }

        .earning-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 36px;
          height: 36px;

          flex-shrink: 0;

          border: 1px solid rgba(212, 175, 55, 0.24);
          border-radius: 10px;

          background: rgba(212, 175, 55, 0.085);

          color: ${dark ? "#d4af37" : "#b08a1e"};

          box-shadow:
            0 0 18px rgba(212, 175, 55, 0.08);
        }

        .earning-icon span {
          font-size: 18px;
          font-weight: 800;
        }

        .earning-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .earning-info span {
          color: ${dark ? "#858a85" : "#8a8a8a"};

          font-size: 7px;
          font-weight: 600;

          letter-spacing: 0.13em;
        }

        .earning-info strong {
          color: ${dark ? "#f5f5f5" : "#171717"};

          font-size: 12px;
          font-weight: 800;
        }

        .earning-check {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 18px;
          height: 18px;

          margin-left: auto;

          border-radius: 50%;

          background: rgba(212, 175, 55, 0.11);

          color: ${dark ? "#d4af37" : "#b08a1e"};

          font-size: 9px;
        }

        .energy-ring {
          position: absolute;

          left: 50%;
          top: 50%;

          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 50%;

          transform: translate(-50%, -50%);
        }

        .energy-one {
          width: 175px;
          height: 85px;

          transform:
            translate(-50%, -50%)
            rotate(-12deg);

          animation: ringRotate 11s linear infinite;
        }

        .energy-two {
          width: 145px;
          height: 65px;

          border-color: rgba(212, 175, 55, 0.13);

          transform:
            translate(-50%, -50%)
            rotate(28deg);

          animation: ringRotate 8s linear infinite reverse;
        }

        .energy-particle {
          position: absolute;

          width: 5px;
          height: 5px;

          border-radius: 50%;
        }

        .particle-one {
          top: 8px;
          left: 24px;

          background: #d4af37;

          box-shadow:
            0 0 10px rgba(212, 175, 55, 0.55);

          animation: particleDrift 3s ease-in-out infinite;
        }

        .particle-two {
          right: 20px;
          bottom: 8px;

          background: #b08a1e;

          box-shadow:
            0 0 10px rgba(176, 138, 30, 0.5);

          animation: particleDrift 3.8s ease-in-out infinite 0.7s;
        }

        .particle-three {
          right: 4px;
          top: 25px;

          width: 4px;
          height: 4px;

          background: #e0c25a;

          box-shadow:
            0 0 9px rgba(212, 175, 55, 0.45);

          animation: particleDrift 4.2s ease-in-out infinite 1s;
        }

        .earn-shield {
          position: absolute;

          left: 1px;
          bottom: 3px;

          color: rgba(176, 138, 30, 0.65);

          font-size: 14px;

          animation: softFloat 3.5s ease-in-out infinite;
        }

        /* =====================================================
           ARC STRIP
        ===================================================== */

        .arc-strip {
          position: relative;

          z-index: 2;

          max-width: 800px;

          margin: 55px auto 0;

          text-align: center;
        }

        .arc-strip-line {
          width: 100%;
          height: 1px;

          margin-bottom: 18px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(212, 175, 55, 0.35),
              transparent
            );
        }

        .arc-strip-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;

          flex-wrap: wrap;
        }

        .arc-strip-item {
          display: flex;
          align-items: center;
          gap: 7px;

          color: ${dark ? "#8e938e" : "#76736c"};

          font-size: 8px;
          font-weight: 700;

          letter-spacing: 0.14em;

          transition: color 0.35s ease;
        }

        .arc-strip-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;
        }

        .arc-strip-dot.blue,
        .arc-strip-dot.gold,
        .arc-strip-dot.pink {
          background: #d4af37;

          box-shadow:
            0 0 8px rgba(212, 175, 55, 0.42);
        }

        .arc-strip-divider {
          width: 1px;
          height: 13px;

          background: ${
            dark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(20, 20, 20, 0.1)"
          };
        }

        /* =====================================================
           NEW ANIMATIONS
        ===================================================== */

        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform:
              translateY(45px)
              scale(0.97);
          }

          60% {
            opacity: 1;
            transform:
              translateY(-5px)
              scale(1.005);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        @keyframes softFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes dashboardFloat {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateY(-5px);
          }
        }

        @keyframes taskFloat {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          50% {
            transform:
              translate(-50%, -52%)
              rotate(-1deg);
          }
        }

        @keyframes earningFloat {
          0%,
          100% {
            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          50% {
            transform:
              translate(-50%, -50%)
              translateY(-6px);
          }
        }

        @keyframes nodeFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes connectionMove {
          0%,
          100% {
            opacity: 0.25;
            transform: translateX(0);
          }

          50% {
            opacity: 1;
            transform: translateX(8px);
          }
        }

        @keyframes pulseRing {
          0% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(0.82);
          }

          40% {
            opacity: 0.65;
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(1.18);
          }
        }

        @keyframes checkPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 8px 18px rgba(212, 175, 55, 0.08);
          }

          50% {
            transform: scale(1.08);
            box-shadow:
              0 8px 24px rgba(212, 175, 55, 0.2);
          }
        }

        @keyframes badgeFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes particleDrift {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(0, 0);
          }

          50% {
            opacity: 1;
            transform: translate(8px, -10px);
          }
        }

        @keyframes ringRotate {
          from {
            transform:
              translate(-50%, -50%)
              rotate(0deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(360deg);
          }
        }

        @keyframes arcOrbitOne {
          from {
            transform:
              translate(-50%, -50%)
              rotate(-15deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(345deg);
          }
        }

        @keyframes arcOrbitTwo {
          from {
            transform:
              translate(-50%, -50%)
              rotate(25deg);
          }

          to {
            transform:
              translate(-50%, -50%)
              rotate(385deg);
          }
        }

        /* =====================================================
           DESKTOP SCROLL REVEAL
        ===================================================== */

        @media (min-width: 1024px) {
          .how-it-works-card {
            opacity: 0;

            transform:
              translateY(45px)
              scale(0.97);
          }

          .how-it-works-visible .how-it-works-card {
            animation:
              cardReveal
              0.85s
              cubic-bezier(0.22, 1, 0.36, 1)
              forwards;
          }

          .how-it-works-visible
            .how-it-works-card:nth-child(1) {
            animation-delay: 0.08s;
          }

          .how-it-works-visible
            .how-it-works-card:nth-child(2) {
            animation-delay: 0.2s;
          }

          .how-it-works-visible
            .how-it-works-card:nth-child(3) {
            animation-delay: 0.32s;
          }

          .how-it-works-visible
            .how-it-works-card:nth-child(4) {
            animation-delay: 0.44s;
          }
        }

        /* =====================================================
           TABLET
        ===================================================== */

        @media (max-width: 1023px) {
          .how-it-works-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .how-it-works-card {
            opacity: 1;
            transform: none;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 639px) {
          .how-it-works-section {
            padding: 70px 16px;
          }

          .how-it-works-header {
            margin-bottom: 38px;
          }

          .how-it-works-header h2 {
            font-size: 2.35rem;
          }

          .how-it-works-header p {
            font-size: 13px;
          }

          .how-it-works-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .how-it-works-card {
            min-height: 370px;
          }

          .arc-strip {
            margin-top: 40px;
          }

          .arc-strip-divider {
            display: none;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .how-it-works-card {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }

          .how-it-works-card *,
          .how-it-works-card::before {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}