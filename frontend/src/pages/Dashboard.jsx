import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import axios from "axios";
import { showToast } from "../components/UI/Toast";
import {
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

import NavBar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";
import BountyCard from "../components/Bounty/BountyCard";

function Dashboard({ dark, setDark }) {
  const { address, isConnected } = useAccount();

  const [loading, setLoading] = useState(true);
  const [bounties, setBounties] = useState([]);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    earnings: 0,
  });
  const [enrolledBountyIds, setEnrolledBountyIds] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const bountyApi = `${API_URL}/bounty/bounties`;
  const userInfoApi = `${API_URL}/user/details/${address}`;

  const loadBounties = async () => {
    setLoading(true);

    try {
      const response = await axios.get(bountyApi, {
        params: {
          page: currentPage,
          limit: 6,
          status: filter !== "all" ? filter : undefined,
        },
      });

      setBounties(response.data.bounties || []);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Error loading bounties:", err);
      showToast.error("Couldn't fetch bounties");
    } finally {
      setLoading(false);
    }
  };

  // const [rewards, setRewards] = useState([]);

  const loadDashboardStats = async () => {
    try {
      const { data } = await axios.get(userInfoApi);

      setStats({
        completed: data.user?.tasksCompleted || 0,
        inProgress: data.submissions?.pending || 0,
        earnings: data.user?.totalEarnings || 0,
      });
      setEnrolledBountyIds(data.enrolledBountyIds || []);
    } catch (err) {
      console.error("Error loading userInfo:", err);
      showToast.error("Couldn't fetch user info");
    }
  };

  useEffect(() => {
    loadBounties();

    if (isConnected && address) {
      loadDashboardStats();
    }
  }, [address, isConnected, currentPage, filter]);

  const formatEarnings = (value) => {
    const num = Number(value) || 0;
    const dollars = Math.floor(num);
    const cents = (num % 1).toFixed(2).split(".")[1] || "00";

    return {
      dollars,
      cents,
    };
  };

  const { dollars, cents } = formatEarnings(stats.earnings);

  const handleFilterChange = (status) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    await loadBounties();

    if (isConnected && address) {
      await loadDashboardStats();
    }
  };

  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${
        dark ? "bg-[#080908] text-white" : "bg-[#f6f5ef] text-[#111111]"
      }`}
    >
      <NavBar dark={dark} setDark={setDark} />

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        {/* Gold glow */}
        <div
          className={`absolute left-[5%] top-[8%] h-[420px] w-[420px] animate-[pulse_8s_ease-in-out_infinite] rounded-full blur-[140px] ${
            dark ? "bg-[#D4A017]/[0.035]" : "bg-[#D4A017]/[0.045]"
          }`}
        />

        {/* Soft gold glow */}
        <div
          className={`absolute right-[3%] top-[25%] h-[450px] w-[450px] animate-[pulse_10s_ease-in-out_infinite] rounded-full blur-[150px] ${
            dark ? "bg-[#D4A017]/[0.025]" : "bg-[#D4A017]/[0.035]"
          }`}
        />

        {/* Small gold accent */}
        <div
          className={`absolute bottom-[8%] left-[35%] h-[300px] w-[300px] animate-[pulse_9s_ease-in-out_infinite] rounded-full blur-[130px] ${
            dark ? "bg-[#D4A017]/[0.02]" : "bg-[#D4A017]/[0.025]"
          }`}
        />

        {/* Subtle grid */}
        <div
          className={`absolute inset-0 ${
            dark ? "opacity-[0.025]" : "opacity-[0.035]"
          }`}
          style={{
            backgroundImage: dark
              ? "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)"
              : "linear-gradient(rgba(17,17,17,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.16) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative z-10 min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          {/* =====================================================
              HEADER
          ====================================================== */}

          <section className="mb-10 animate-[fadeInUp_0.7s_ease-out_both]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4A017] opacity-30" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4A017] shadow-[0_0_12px_rgba(212,160,23,0.5)]" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4A017]">
                    Contributor Dashboard
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1
                    className={`bg-gradient-to-r bg-clip-text text-4xl font-black tracking-[-0.045em] text-transparent sm:text-5xl ${
                      dark
                        ? "from-white via-white to-[#D4A017]"
                        : "from-[#111111] to-[#D4A017]"
                    }`}
                  >
                    Dashboard
                  </h1>

                  <span className="mt-2 h-2 w-2 animate-pulse rounded-full bg-[#D4A017]" />
                </div>

                <p
                  className={`mt-3 max-w-2xl text-sm leading-6 sm:text-[15px] ${
                    dark ? "text-white/50" : "text-black/50"
                  }`}
                >
                  Discover opportunities, track your submissions, and monitor
                  your earnings across the Happy Bounty network.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Refresh */}

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`group flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A017]/50 hover:bg-[#D4A017] hover:text-white hover:shadow-[0_10px_30px_rgba(212,160,23,0.2)] disabled:cursor-not-allowed disabled:opacity-40 ${
                    dark
                      ? "border-white/[0.08] bg-[#111311]/90 text-white/60"
                      : "border-black/[0.09] bg-white/80 text-black/60"
                  }`}
                >
                  <FiRefreshCw
                    className={`text-base ${
                      loading ? "animate-spin" : "group-hover:rotate-180"
                    } transition-transform duration-500`}
                  />
                  Refresh
                </button>

                {/* Create */}

                <Link
                  to="/create"
                  className={`group relative flex h-11 items-center gap-2 overflow-hidden rounded-xl px-5 text-sm font-bold shadow-[0_10px_30px_rgba(17,17,17,0.14)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#B28B20] hover:text-white hover:shadow-[0_14px_35px_rgba(212,160,23,0.25)] ${
                    dark ? "bg-[#D4A017] text-white" : "bg-gold-700 text-black"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FiPlus className="text-base" />
                    Create Bounty
                    <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-[#B28B20] transition-transform duration-500 group-hover:translate-x-0" />
                </Link>
              </div>
            </div>

            <div className="mt-8 h-px bg-gradient-to-r from-[#D4A017]/50 via-[#D4A017]/25 to-transparent" />
          </section>

          {/* =====================================================
              STATS
          ====================================================== */}

          <section className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* =====================================================
                EARNINGS
            ====================================================== */}

            <div
              className={`group relative animate-[fadeInUp_0.7s_ease-out_0.1s_both] overflow-hidden rounded-2xl border shadow-[0_10px_35px_rgba(17,17,17,0.035)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4A017]/40 hover:shadow-[0_20px_50px_rgba(212,160,23,0.12)] ${
                dark
                  ? "border-white/[0.07] bg-[#111311]/90 shadow-[0_10px_35px_rgba(0,0,0,0.2)]"
                  : "border-black/[0.08] bg-white/90"
              }`}
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4A017]/[0.07] blur-[60px] transition-all duration-500 group-hover:scale-125 group-hover:bg-[#D4A017]/[0.12]" />

              <div className="relative p-6">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4A017]/20 bg-[#D4A017]/[0.08] text-[#D4A017] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4A017] group-hover:text-white group-hover:shadow-[0_8px_25px_rgba(212,160,23,0.25)]">
                    <FiDollarSign className="text-xl" />
                  </div>

                  <span
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                      dark
                        ? "border-white/[0.07] bg-white/[0.04] text-white/40"
                        : "border-black/[0.07] bg-[#f6f5ef] text-black/40"
                    }`}
                  >
                    <FiTrendingUp className="text-[10px] text-[#D4A017]" />
                    Lifetime
                  </span>
                </div>

                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    dark ? "text-white/40" : "text-black/40"
                  }`}
                >
                  Total Earnings
                </p>

                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-black tracking-tight ${
                      dark ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    ${dollars}
                  </span>

                  <span
                    className={`text-lg font-bold ${
                      dark ? "text-white/30" : "text-black/30"
                    }`}
                  >
                    .{cents}
                  </span>

                  <span className="ml-1 text-xs font-bold text-[#D4A017]">
                    USDC
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <div
                    className={`h-1 flex-1 overflow-hidden rounded-full ${
                      dark ? "bg-white/[0.06]" : "bg-black/[0.06]"
                    }`}
                  >
                    <div className="h-full w-3/4 rounded-full bg-[#D4A017] transition-all duration-700 group-hover:w-full" />
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      dark ? "text-white/30" : "text-black/30"
                    }`}
                  >
                    Earnings
                  </span>
                </div>
              </div>
            </div>

            {/* =====================================================
                COMPLETED
            ====================================================== */}

            <div
              className={`group relative animate-[fadeInUp_0.7s_ease-out_0.2s_both] overflow-hidden rounded-2xl border shadow-[0_10px_35px_rgba(17,17,17,0.035)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4A017]/40 hover:shadow-[0_20px_50px_rgba(212,160,23,0.1)] ${
                dark
                  ? "border-white/[0.07] bg-[#111311]/90 shadow-[0_10px_35px_rgba(0,0,0,0.2)]"
                  : "border-black/[0.08] bg-white/90"
              }`}
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4A017]/[0.055] blur-[60px] transition-all duration-500 group-hover:scale-125 group-hover:bg-[#D4A017]/[0.1]" />

              <div className="relative p-6">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4A017]/20 bg-[#D4A017]/[0.08] text-[#D4A017] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4A017] group-hover:text-white group-hover:shadow-[0_8px_25px_rgba(212,160,23,0.22)]">
                    <FiCheckCircle className="text-xl" />
                  </div>

                  <span className="rounded-full border border-[#D4A017]/20 bg-[#D4A017]/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#D4A017]">
                    Achieved
                  </span>
                </div>

                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    dark ? "text-white/40" : "text-black/40"
                  }`}
                >
                  Bounty Won
                </p>

                <p
                  className={`mt-2 text-3xl font-black tracking-tight ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {stats.completed}
                </p>

                <div className="mt-6 flex items-center gap-2">
                  <div
                    className={`h-1 flex-1 overflow-hidden rounded-full ${
                      dark ? "bg-white/[0.06]" : "bg-black/[0.06]"
                    }`}
                  >
                    <div className="h-full w-2/3 rounded-full bg-[#D4A017] transition-all duration-700 group-hover:w-full" />
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      dark ? "text-white/30" : "text-black/30"
                    }`}
                  >
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* =====================================================
                IN PROGRESS
            ====================================================== */}

            <div
              className={`group relative animate-[fadeInUp_0.7s_ease-out_0.3s_both] overflow-hidden rounded-2xl border shadow-[0_10px_35px_rgba(17,17,17,0.035)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D4A017]/40 hover:shadow-[0_20px_50px_rgba(212,160,23,0.1)] ${
                dark
                  ? "border-white/[0.07] bg-[#111311]/90 shadow-[0_10px_35px_rgba(0,0,0,0.2)]"
                  : "border-black/[0.08] bg-white/90"
              }`}
            >
              <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4A017]/[0.055] blur-[60px] transition-all duration-500 group-hover:scale-125 group-hover:bg-[#D4A017]/[0.1]" />

              <div className="relative p-6">
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4A017]/20 bg-[#D4A017]/[0.08] text-[#D4A017] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4A017] group-hover:text-white group-hover:shadow-[0_8px_25px_rgba(212,160,23,0.22)]">
                    <FiActivity className="text-xl" />
                  </div>

                  <span className="rounded-full border border-[#D4A017]/20 bg-[#D4A017]/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#D4A017]">
                    Active
                  </span>
                </div>

                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    dark ? "text-white/40" : "text-black/40"
                  }`}
                >
                  In Progress / Submitted
                </p>

                <p
                  className={`mt-2 text-3xl font-black tracking-tight ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {stats.inProgress}
                </p>

                <div className="mt-6 flex items-center gap-2">
                  <div
                    className={`h-1 flex-1 overflow-hidden rounded-full ${
                      dark ? "bg-white/[0.06]" : "bg-black/[0.06]"
                    }`}
                  >
                    <div className="h-full w-1/2 rounded-full bg-[#D4A017] transition-all duration-700 group-hover:w-full" />
                  </div>

                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      dark ? "text-white/30" : "text-black/30"
                    }`}
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
              BOUNTIES HEADER
          ====================================================== */}

          <section className="animate-[fadeInUp_0.7s_ease-out_0.4s_both]">
            <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FiSearch className="text-[#D4A017]" />

                  <h2
                    className={`text-lg font-bold tracking-tight ${
                      dark ? "text-white" : "text-[#111111]"
                    }`}
                  >
                    Explore Bounties
                  </h2>
                </div>

                <p
                  className={`mt-1 text-xs ${
                    dark ? "text-white/40" : "text-black/40"
                  }`}
                >
                  Find opportunities that match your skills.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["all", "active", "completed", "upcoming"].map((status) => {
                  const active = filter === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleFilterChange(status)}
                      className={`group rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 ${
                        active
                          ? "bg-[#D4A017] text-white shadow-[0_5px_20px_rgba(212,160,23,0.2)]"
                          : dark
                            ? "border border-white/[0.08] bg-[#111311]/80 text-white/45 hover:-translate-y-0.5 hover:border-[#D4A017]/40 hover:bg-[#D4A017] hover:text-white hover:shadow-[0_8px_22px_rgba(212,160,23,0.16)]"
                            : "border border-black/[0.08] bg-white/80 text-black/45 hover:-translate-y-0.5 hover:border-[#D4A017]/40 hover:bg-[#D4A017] hover:text-white hover:shadow-[0_8px_22px_rgba(212,160,23,0.16)]"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}

                      {status === "all" && pagination && (
                        <span
                          className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] transition-colors ${
                            active
                              ? "bg-white/20 text-white"
                              : dark
                                ? "bg-white/[0.05] text-white/35 group-hover:bg-white/15 group-hover:text-white"
                                : "bg-black/[0.05] text-black/35 group-hover:bg-white/15 group-hover:text-white"
                          }`}
                        >
                          {pagination.total}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            {loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className={`relative overflow-hidden rounded-2xl border p-6 shadow-[0_10px_35px_rgba(17,17,17,0.035)] ${
                      dark
                        ? "border-white/[0.07] bg-[#111311]/90"
                        : "border-black/[0.08] bg-white/80"
                    }`}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 -translate-x-full animate-[skeletonShimmer_1.8s_infinite] bg-gradient-to-r from-transparent ${
                        dark
                          ? "via-white/[0.04] to-transparent"
                          : "via-black/[0.025] to-transparent"
                      }`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`h-6 w-2/3 animate-pulse rounded-lg ${
                          dark ? "bg-white/[0.07]" : "bg-[#e9e6dd]"
                        }`}
                      />

                      <div
                        className={`h-6 w-20 animate-pulse rounded-full ${
                          dark ? "bg-white/[0.06]" : "bg-[#e9e6dd]"
                        }`}
                      />
                    </div>

                    <div className="mt-5 space-y-2">
                      <div
                        className={`h-3.5 w-full animate-pulse rounded ${
                          dark ? "bg-white/[0.06]" : "bg-[#e9e6dd]"
                        }`}
                      />

                      <div
                        className={`h-3.5 w-11/12 animate-pulse rounded ${
                          dark ? "bg-white/[0.06]" : "bg-[#e9e6dd]"
                        }`}
                      />

                      <div
                        className={`h-3.5 w-2/3 animate-pulse rounded ${
                          dark ? "bg-white/[0.06]" : "bg-[#e9e6dd]"
                        }`}
                      />
                    </div>

                    <div className="mt-7 grid grid-cols-2 gap-4">
                      <div>
                        <div
                          className={`mb-2 h-2.5 w-16 animate-pulse rounded ${
                            dark ? "bg-white/[0.05]" : "bg-[#e5e1d7]"
                          }`}
                        />

                        <div
                          className={`h-5 w-24 animate-pulse rounded ${
                            dark ? "bg-white/[0.07]" : "bg-[#e9e6dd]"
                          }`}
                        />
                      </div>

                      <div>
                        <div
                          className={`mb-2 h-2.5 w-16 animate-pulse rounded ${
                            dark ? "bg-white/[0.05]" : "bg-[#e5e1d7]"
                          }`}
                        />

                        <div
                          className={`h-5 w-20 animate-pulse rounded ${
                            dark ? "bg-white/[0.07]" : "bg-[#e9e6dd]"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <div
                        className={`h-6 w-16 animate-pulse rounded-full ${
                          dark ? "bg-white/[0.05]" : "bg-[#e9e6dd]"
                        }`}
                      />

                      <div
                        className={`h-6 w-20 animate-pulse rounded-full ${
                          dark ? "bg-white/[0.05]" : "bg-[#e9e6dd]"
                        }`}
                      />

                      <div
                        className={`h-6 w-14 animate-pulse rounded-full ${
                          dark ? "bg-white/[0.05]" : "bg-[#e9e6dd]"
                        }`}
                      />
                    </div>

                    <div
                      className={`mt-6 border-t pt-5 ${
                        dark ? "border-white/[0.06]" : "border-black/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`h-3 w-24 animate-pulse rounded ${
                            dark ? "bg-white/[0.05]" : "bg-[#e9e6dd]"
                          }`}
                        />

                        <div
                          className={`h-9 w-24 animate-pulse rounded-xl ${
                            dark ? "bg-[#D4A017]/20" : "bg-[#e8e1c9]"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bounties.length === 0 ? (
              <div
                className={`flex min-h-[420px] flex-col items-center justify-center rounded-2xl border px-6 text-center shadow-[0_10px_35px_rgba(17,17,17,0.035)] ${
                  dark
                    ? "border-white/[0.07] bg-[#111311]/80"
                    : "border-black/[0.08] bg-white/80"
                }`}
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 hover:border-[#D4A017]/40 hover:bg-[#D4A017] hover:text-white ${
                    dark
                      ? "border-white/[0.08] bg-[#151715] text-white/30"
                      : "border-black/[0.08] bg-[#f6f5ef] text-black/30"
                  }`}
                >
                  <FiSearch className="text-xl" />
                </div>

                <h3
                  className={`mt-5 text-lg font-bold ${
                    dark ? "text-white" : "text-[#111111]"
                  }`}
                >
                  No bounties found
                </h3>

                <p
                  className={`mt-2 max-w-sm text-sm leading-6 ${
                    dark ? "text-white/40" : "text-black/40"
                  }`}
                >
                  There are no opportunities matching your current filter. Try
                  another category or create a new bounty.
                </p>

                <Link
                  to="/create"
                  className="group mt-6 flex items-center gap-2 rounded-xl bg-gold-700 px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-[#D4A017] hover:text-white hover:shadow-[0_10px_25px_rgba(212,160,23,0.2)]"
                >
                  <FiPlus />
                  Create Bounty
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
                  {bounties.map((bounty) => (
                    <BountyCard
                      key={bounty._id}
                      bounty={bounty}
                      enrolledBountyIds={enrolledBountyIds}
                    />
                  ))}
                </div>

                {/* =================================================
                    PAGINATION
                ================================================== */}

                {pagination && pagination.pages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div
                      className={`flex items-center gap-1 rounded-xl border p-1.5 shadow-sm transition-all duration-300 hover:border-[#D4A017]/30 ${
                        dark
                          ? "border-white/[0.07] bg-[#111311]/80"
                          : "border-black/[0.08] bg-white/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-[#D4A017] hover:text-white disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent ${
                          dark
                            ? "text-white/40 disabled:hover:text-white/40"
                            : "text-black/40 disabled:hover:text-black/40"
                        }`}
                      >
                        <FiChevronLeft />
                      </button>

                      <div
                        className={`px-4 text-[11px] font-semibold ${
                          dark ? "text-white/45" : "text-black/45"
                        }`}
                      >
                        <span className="text-[#D4A017]">{currentPage}</span>

                        <span
                          className={`mx-2 ${
                            dark ? "text-white/20" : "text-black/20"
                          }`}
                        >
                          /
                        </span>

                        {pagination.pages}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(pagination.pages, prev + 1),
                          )
                        }
                        disabled={currentPage >= pagination.pages}
                        aria-label="Next page"
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:bg-[#D4A017] hover:text-white disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:bg-transparent ${
                          dark
                            ? "text-white/40 disabled:hover:text-white/40"
                            : "text-black/40 disabled:hover:text-black/40"
                        }`}
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* =====================================================
          LOCAL ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes skeletonShimmer {
          100% {
            transform: translateX(100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
