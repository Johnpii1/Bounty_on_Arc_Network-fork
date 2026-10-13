import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiCompass } from "react-icons/fi";
import NavBar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";

const GOLD = "#D4AF37";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f7f6f0] dark:bg-[#080908] text-[#171714] dark:text-white transition-colors duration-300"
      style={{
        backgroundImage: `
          linear-gradient(rgba(112,105,88,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(112,105,88,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "56px 28px",
      }}
    >
      <NavBar />

      <main className="flex-grow flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-lg">
          {/* Main card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#dedbd1] dark:border-white/10 bg-white dark:bg-[#111311] shadow-[0_18px_60px_rgba(34,31,24,0.07)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: GOLD }} />

            <div className="p-8 md:p-10 text-center">
              {/* Icon mark */}
              <div
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e5ddc8] dark:border-white/10 text-2xl"
                style={{
                  backgroundColor: "rgba(212,160,23,0.08)",
                  color: GOLD,
                }}
              >
                <FiCompass size={26} />
              </div>

              {/* Eyebrow */}
              <p
                className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#a17a13" }}
              >
                Error 404
              </p>

              {/* Title */}
              <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                Page not found
              </h1>

              {/* Body */}
              <p className="mt-3 text-sm md:text-base leading-relaxed text-[#777267] dark:text-white/55 max-w-md mx-auto">
                The page you're looking for doesn't exist, has been moved, or
                the link is broken. It happens.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition hover:brightness-95"
                  style={{ backgroundColor: GOLD, color: "#171714" }}
                >
                  <FiHome size={16} />
                  Go to Dashboard
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#151715] border border-[#dcd8ce] dark:border-white/10 text-sm font-semibold text-[#4f4b43] dark:text-white/70 hover:border-[#b28b20] dark:hover:border-[#D4AF37]/50 transition"
                >
                  <FiArrowLeft size={16} />
                  Go Back
                </button>
              </div>

              {/* Secondary hint */}
              <p className="mt-6 text-xs text-[#99958a] dark:text-white/35">
                Looking for a bounty? Check the dashboard for active
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}