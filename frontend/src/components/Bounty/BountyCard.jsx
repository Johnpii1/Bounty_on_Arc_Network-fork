import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNav } from "../../hooks/useNav";
import { showToast } from "../UI/Toast";
import { useAccount } from "wagmi";
import {
  FiArrowUpRight,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiLayers,
} from "react-icons/fi";
import { formatAmount } from "../../utils/format";

const BountyCard = ({ bounty, enrolledBountyIds = [] }) => {
  const { handleNavigate } = useNav();
  const { address, isConnected } = useAccount();
  const [isEnrolling, setIsEnrolling] = useState(false);
  // const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolledLocal, setIsEnrolledLocal] = useState(false);
  const enrolledFromServer = enrolledBountyIds.includes(String(bounty._id));
  const isEnrolled = enrolledFromServer || isEnrolledLocal;

  const API_URL = import.meta.env.VITE_API_URL;

  const isCreator =
    isConnected &&
    address &&
    bounty.creator?.toLowerCase() === address.toLowerCase();

  // Derive status client-side as a fallback if the backend omits it
  const deriveStatus = () => {
    if (bounty.status) return bounty.status;
    if (bounty.lifecycleStatus === "completed") return "completed";
    if (bounty.lifecycleStatus === "cancelled") return "cancelled";

    const now = new Date();

    if (now < new Date(bounty.startDate)) return "upcoming";
    if (now <= new Date(bounty.deadline)) return "active";

    return "ended";
  };

  const status = deriveStatus();

  const statusConfig = {
    active: {
      color: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/20",
      dot: "bg-emerald-500",
      label: "Active",
    },

    upcoming: {
      color: "text-[#8f6c12] dark:text-[#D4AF37]",
      bg: "bg-[#f4ecd5] dark:bg-[#D4AF37]/10",
      border: "border-[#e5d9b8] dark:border-[#D4AF37]/20",
      dot: "bg-[#D4AF37]",
      label: "Upcoming",
    },

    ended: {
      color: "text-slate-600 dark:text-white/45",
      bg: "bg-slate-100 dark:bg-white/[0.04]",
      border: "border-slate-200 dark:border-white/[0.08]",
      dot: "bg-slate-400 dark:bg-white/30",
      label: "Ended",
    },

    completed: {
      color: "text-[#8f6c12] dark:text-[#D4AF37]",
      bg: "bg-[#f4ecd5] dark:bg-[#D4AF37]/10",
      border: "border-[#e5d9b8] dark:border-[#D4AF37]/20",
      dot: "bg-[#D4AF37]",
      label: "Completed",
    },

    cancelled: {
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20",
      dot: "bg-red-500",
      label: "Cancelled",
    },
  }[status] || {
    color: "text-slate-500 dark:text-white/40",
    bg: "bg-slate-100 dark:bg-white/[0.04]",
    border: "border-slate-200 dark:border-white/[0.08]",
    dot: "bg-slate-400 dark:bg-white/30",
    label: "Draft",
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return null;

    const now = new Date();
    const end = new Date(deadline);
    const diffMs = end - now;

    // Already past
    if (diffMs <= 0) return { past: true };

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // More than 2 days away — show days only
    if (diffDays >= 2) {
      return { label: `${diffDays} days left`, urgent: false };
    }

    // 1 day exactly
    if (diffDays === 1) {
      return { label: `1 day left`, urgent: true };
    }

    // Less than 24 hours
    if (diffHours >= 1) {
      return {
        label: `${diffHours}h ${diffMinutes}m left`,
        urgent: true,
      };
    }

    // Less than an hour
    return { label: `${diffMinutes}m left`, urgent: true };
  };

  const timeRemaining = getTimeRemaining(bounty.deadline);
  const deadlineDate = new Date(bounty.deadline);
  const sameYear = deadlineDate.getFullYear() === new Date().getFullYear();

  const deadline = deadlineDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });

  const tags = bounty.tags || [];

  const rewardDisplay = `${formatAmount(bounty.reward)} ${
    bounty.token || "USDC"
  }`;

  const description = bounty.description || "No description provided";

  // Refresh the time remaining every minute to keep it up-to-date
  // const [, forceTick] = useState(0);
  //
  // useEffect(() => {
  // const id = setInterval(() => forceTick((t) => t + 1), 60000);
  // return () => clearInterval(id);
  // }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();

    if (!isConnected || !address) {
      showToast.error("Please connect your wallet first");
      return;
    }

    setIsEnrolling(true);

    const loadingshowToast = showToast.loading("Enrolling in bounty...");

    try {
      const response = await axios.post(`${API_URL}/user/enrollment`, {
        bountyId: bounty._id,
        user: address,
      });

      if (response.status === 200 || response.status === 201) {
        showToast.success("Enrolled! Redirecting...", {
          id: loadingshowToast,
          duration: 2000,
        });

        setIsEnrolledLocal(true);
        // navigate(`/bounty/${bounty._id}`);
        handleNavigate(`/bounty/${bounty._id}`); // Ensure navigation is handled correctly
      }
    } catch (error) {
      console.error("Enrollment error:", error);

      showToast.error(
        error.response?.status === 400
          ? "You are already enrolled in this bounty"
          : "Failed to enroll. Please try again.",
        {
          id: loadingshowToast,
          duration: 3000,
        },
      );
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div
      className="
        group relative flex h-full w-full min-w-0 flex-col overflow-hidden
        rounded-2xl

        border border-slate-200 dark:border-white/[0.08]

        bg-white dark:bg-[#171a17]

        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        dark:shadow-[0_8px_30px_rgba(0,0,0,0.32)]

        transition-all duration-300 ease-out

        hover:-translate-y-1
        hover:border-[#d4af37]/30
        dark:hover:border-[#d4af37]/40

        hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]
        dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
      "
    >
      {/* GOLD TOP LINE */}
      <div
        className="
          absolute left-0 right-0 top-0 h-[2px]
          bg-gradient-to-r from-transparent via-[#d4af37] to-transparent
          opacity-50
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      {/* SUBTLE GOLD GLOW */}
      <div
        className="
          pointer-events-none absolute -right-20 -top-20 h-40 w-40
          rounded-full
          bg-[#d4af37]/[0.035]
          blur-3xl
          opacity-0
          transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      {/* DARK MODE INNER GLOW */}
      <div
        className="
          pointer-events-none absolute inset-0
          rounded-2xl
          opacity-0
          transition-opacity duration-500
          group-hover:opacity-100
          dark:bg-[radial-gradient(circle_at_80%_0%,rgba(212,175,55,0.045),transparent_35%)]
        "
      />

      <div className="relative z-10 flex h-full min-w-0 flex-col p-5 sm:p-6">
        {/* HEADER */}
        <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="
                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg

                border border-slate-200
                dark:border-white/[0.08]

                bg-slate-50
                dark:bg-white/[0.04]

                text-slate-500
                dark:text-[#D4AF37]

                transition-colors
                group-hover:border-[#d4af37]/30
              "
            >
              <FiLayers size={14} />
            </div>

            <span
              className="
                min-w-0 max-w-[140px] overflow-hidden text-ellipsis
                whitespace-nowrap

                text-[11px] font-semibold uppercase
                tracking-[0.1em]

                text-slate-500
                dark:text-white/50
              "
              title={bounty.category || "Uncategorized"}
            >
              {bounty.category || "Uncategorized"}
            </span>
          </div>

          {/* STATUS */}
          <div
            className={`
              flex shrink-0 items-center gap-1.5
              rounded-full border
              px-2.5 py-1
              ${statusConfig.bg}
              ${statusConfig.border}
            `}
          >
            <span
              className={`
                h-1.5 w-1.5 shrink-0 rounded-full
                ${statusConfig.dot}
                ${
                  status === "active"
                    ? "animate-pulse shadow-[0_0_6px_currentColor]"
                    : ""
                }
              `}
            />

            <span
              className={`
                text-[10px] font-semibold uppercase
                tracking-[0.08em]
                ${statusConfig.color}
              `}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h3
          className="
            mb-3 min-w-0 overflow-hidden text-ellipsis
            text-[19px] font-bold leading-[1.35]
            tracking-[-0.02em]

            text-slate-900
            dark:text-white

            line-clamp-2

            transition-colors duration-200

            group-hover:text-[#8f6c12]
            dark:group-hover:text-[#d4af37]

            sm:text-xl
          "
        >
          {bounty.title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="
            min-w-0 min-h-[72px] overflow-hidden
            text-sm leading-6

            text-slate-500
            dark:text-white/50

            line-clamp-3
          "
        >
          {description}
        </p>

        {/* TAGS */}
        <div className="mt-4 min-h-[29px] min-w-0">
          {tags.length > 0 && (
            <div className="flex min-w-0 flex-wrap gap-1.5 overflow-hidden">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="
                    max-w-full overflow-hidden text-ellipsis
                    whitespace-nowrap
                    rounded-md

                    border border-slate-200
                    dark:border-white/[0.08]

                    bg-slate-50
                    dark:bg-white/[0.04]

                    px-2.5 py-1

                    text-[11px] font-medium

                    text-slate-500
                    dark:text-white/50

                    transition-colors

                    group-hover:border-[#d4af37]/30
                    group-hover:text-[#8f6c12]

                    dark:group-hover:text-[#d4af37]
                  "
                >
                  #{tag}
                </span>
              ))}

              {tags.length > 3 && (
                <span
                  className="
                    shrink-0 rounded-md

                    border border-slate-200
                    dark:border-white/[0.08]

                    bg-white
                    dark:bg-white/[0.03]

                    px-2.5 py-1

                    text-[11px] font-medium

                    text-slate-400
                    dark:text-white/35
                  "
                >
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* REWARD + DEADLINE */}
        <div
          className="
    my-5 grid grid-cols-2 gap-3
    rounded-xl

    border border-slate-200
    dark:border-white/[0.08]

    bg-[#fbfaf6]
    dark:bg-[#20231f]

    p-3
  "
        >
          {/* REWARD */}
          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35">
              Reward
            </p>
            <p
              className="truncate text-sm font-bold tracking-[-0.01em] text-slate-900 dark:text-white sm:text-base"
              title={rewardDisplay}
            >
              {rewardDisplay}
            </p>
          </div>

          {/* DEADLINE */}
          {/* DEADLINE */}
          <div className="min-w-0 border-l border-slate-200 dark:border-white/[0.08] pl-3">
            <p className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-white/35">
              <FiCalendar size={10} />
              Deadline
            </p>

            <p className="truncate text-sm font-semibold text-slate-700 dark:text-white/70">
              {deadline}
            </p>

            {timeRemaining?.label && (
              <p
                className={`
        mt-0.5 text-[10px] font-medium
        ${
          timeRemaining.urgent
            ? "text-red-600 dark:text-red-400"
            : "text-[#8f6c12] dark:text-[#D4AF37]"
        }
      `}
              >
                {timeRemaining.label}
              </p>
            )}

            {timeRemaining?.past &&
              status !== "completed" &&
              status !== "cancelled" && (
                <p className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-white/35">
                  Awaiting selection
                </p>
              )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto grid grid-cols-2 gap-2.5">
          {/* VIEW DETAILS */}
          <Link
            to={`/bounty/${bounty._id}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate(`/bounty/${bounty._id}`);
            }}
            className="
              group/details
              flex min-w-0 items-center justify-center
              gap-2 overflow-hidden rounded-xl

              border border-slate-200
              dark:border-white/[0.08]

              bg-white
              dark:bg-white/[0.03]

              px-3 py-3

              text-xs font-semibold

              text-slate-600
              dark:text-white/65

              transition-all duration-200

              hover:border-[#d4af37]/40
              hover:bg-[#fbfaf6]

              dark:hover:bg-[#d4af37]/[0.06]

              hover:text-[#8f6c12]
              dark:hover:text-[#d4af37]

              sm:text-sm
            "
          >
            <span className="truncate">View Details</span>

            <FiArrowUpRight
              size={14}
              className="
                shrink-0
                transition-transform duration-200

                group-hover/details:translate-x-0.5
                group-hover/details:-translate-y-0.5
              "
            />
          </Link>

          {/* CREATOR */}
          {isCreator ? (
            <Link
              to={`/bounty/${bounty._id}`}
              className="
                relative
                flex min-w-0 items-center justify-center
                gap-1.5 overflow-hidden rounded-xl

                bg-[#d4af37]
                dark:bg-[#e0bd45]

                px-3 py-3

                text-xs font-bold

                text-[#171714]
                dark:text-[#171714]

                shadow-sm

                transition-all duration-300

                hover:bg-[#c49b2c]
                dark:hover:bg-[#d2ac2f]

                active:scale-[0.98]

                sm:text-sm
              "
            >
              <span
                className="
                  absolute bottom-0 left-0
                  h-[2px] w-full

                  bg-[#d4af37]
                  dark:bg-[#171714]

                  opacity-80
                "
              />

              <span className="truncate">Manage</span>
            </Link>
          ) : isEnrolled ? (
            /* ENROLLED */
            <div
              className="
      relative
      flex min-w-0 items-center justify-center
      gap-1.5 overflow-hidden rounded-xl

      border border-[#d4af37]/30
      dark:border-[#d4af37]/25

      bg-[#f4ecd5]/60
      dark:bg-[#d4af37]/[0.08]

      px-3 py-3

      text-xs font-semibold

      text-[#8f6c12]
      dark:text-[#d4af37]/80

      cursor-default

      sm:text-sm
    "
              aria-label="You are enrolled in this bounty"
            >
              <FiCheckCircle size={14} className="shrink-0" />
              <span className="truncate">Enrolled</span>
            </div>
          ) : status === "active" ? (
            /* ACTIVE */
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              // aria-busy={isEnrolling}
              className="
                relative
                min-w-0 overflow-hidden rounded-xl

                bg-[#d4af37]
                dark:bg-[#e0bd45]

                px-3 py-3

                text-xs font-bold

                text-[#171714]
                dark:text-[#171714]

                shadow-sm

                transition-all duration-300

                hover:bg-[#c49b2c]
                dark:hover:bg-[#d2ac2f]

                hover:shadow-md

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:text-sm
              "
            >
              <span
                className="
                  absolute bottom-0 left-0
                  h-[2px] w-full

                  bg-[#d4af37]
                  dark:bg-[#171714]

                  opacity-80
                "
              />

              {isEnrolling ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="
                      h-3.5 w-3.5 shrink-0
                      animate-spin rounded-full

                      border-2
                      border-[#171714]/30
                      border-t-[#171714]

                      dark:border-[#171714]/30
                      dark:border-t-[#171714]
                    "
                  />

                  <span className="truncate">Enrolling</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <span className="truncate">Start Task</span>

                  <FiArrowUpRight
                    size={14}
                    className="
                      shrink-0

                      text-[#d4af37]
                      dark:text-[#171714]
                    "
                  />
                </span>
              )}
            </button>
          ) : (
            /* DISABLED */
            <button
              disabled
              className="
                flex min-w-0 items-center justify-center
                gap-1.5 overflow-hidden rounded-xl

                border border-slate-200
                dark:border-white/[0.08]

                bg-slate-100
                dark:bg-white/[0.04]

                px-3 py-3

                text-xs font-semibold

                text-slate-400
                dark:text-white/30

                cursor-not-allowed

                sm:text-sm
              "
            >
              {status === "completed" ? (
                <FiCheckCircle size={14} className="shrink-0" />
              ) : (
                <FiClock size={14} className="shrink-0" />
              )}

              <span className="truncate">
                {status === "completed"
                  ? "Ended"
                  : status === "cancelled"
                    ? "Cancelled"
                    : status === "ended"
                      ? "Ended"
                      : "Coming Soon"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BountyCard;
