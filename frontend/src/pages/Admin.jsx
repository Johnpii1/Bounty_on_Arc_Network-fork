
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits, isAddress } from "viem";
import {
  getBountyCounterConfig,
  getOwnerConfig,
  getTotalFeesConfig,
  prepareTransferOwnershipTx,
  prepareWithdrawTx,
} from "../services/bountyService";
import { getBountyContract } from "../utils/chains.address";
import Skeleton from "../components/UI/Skeleton";

const ARC_MAINNET_ID = 5042;
const GOLD = "#D4A017";

const shortAddress = (address) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—";

const number = (value) =>
  value == null ? "—" : Number(value).toLocaleString();

function Icon({ children, className = "" }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/10 text-[#a77b08] dark:text-[#e3b52e] ${className}`}
    >
      {children}
    </span>
  );
}

function Panel({ children, className = "", id }) {
  return (
    <section
      id={id}
      className={`min-w-0 scroll-mt-6 rounded-xl border border-[#eeece6] bg-white p-4 shadow-[0_2px_8px_rgba(20,20,10,0.025)] dark:border-white/10 dark:bg-[#141614] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelHeading({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-[#25251f] dark:text-white">
        {title}
      </h2>
      {action}
    </div>
  );
}

function StatCard({ icon, label, value, note, color = "gold" }) {
  const iconColor =
    color === "green"
      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      : color === "blue"
        ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        : color === "purple"
          ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
          : "bg-[#D4A017]/10 text-[#a77b08] dark:text-[#e3b52e]";

  return (
    <article className="min-w-0 rounded-xl border border-[#eeece6] bg-white p-3.5 dark:border-white/10 dark:bg-[#141614]">
      <div className="flex items-center gap-2.5">
        <Icon className={iconColor}>{icon}</Icon>
        <p className="min-w-0 text-[11px] font-medium leading-4 text-[#68675f] dark:text-white/60">
          {label}
        </p>
      </div>
      <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-[#202019] dark:text-white">
        {value}
      </p>
      <p className="mt-1.5 truncate text-[10px] text-[#8c8a80] dark:text-white/40">
        {note}
      </p>
    </article>
  );
}

function OverviewChart({ total }) {
  const created =
    "10,82 48,55 85,42 123,52 160,37 198,18 235,41 273,31 310,40 348,10 385,24 422,21 450,44";
  const completed =
    "10,87 48,81 85,64 123,78 160,62 198,68 235,84 273,74 310,79 348,69 385,82 422,78 450,84";
  const active =
    "10,93 48,88 85,83 123,91 160,60 198,51 235,73 273,62 310,67 348,43 385,65 422,55 450,64";

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-[10px] text-[#77756d] dark:text-white/55">
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-[#D4A017]" /> Created
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-emerald-500" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-violet-500" /> Active
        </span>
      </div>

      <svg
        viewBox="0 0 470 130"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label="Illustrative chart layout; historical series unavailable"
      >
        {[20, 45, 70, 95, 120].map((y) => (
          <line
            key={y}
            x1="10"
            y1={y}
            x2="458"
            y2={y}
            stroke="currentColor"
            opacity=".09"
            strokeDasharray="3 3"
          />
        ))}

        {[created, completed, active].map((series, i) => {
          const colors = [GOLD, "#28ad79", "#8b75ed"];
          const points = series.split(" ").map((point) => point.split(","));

          return (
            <g key={i}>
              <polyline
                points={series}
                fill="none"
                stroke={colors[i]}
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points.map(([cx, cy], j) => (
                <circle key={j} cx={cx} cy={cy} r="2" fill={colors[i]} />
              ))}
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex justify-between text-[9px] text-[#88867e] dark:text-white/40">
        <span>Historical data unavailable</span>
        <span>{total == null ? "—" : `${number(total)} total`}</span>
      </div>
    </div>
  );
}

function Funnel() {
  const steps = [
    { name: "Views", width: "100%", color: "#8874ed" },
    { name: "Enrolled", width: "85%", color: "#9584ee" },
    { name: "Submitted", width: "68%", color: "#77a6e8" },
    { name: "Completed", width: "48%", color: "#36b483" },
  ];

  return (
    <div className="space-y-2.5 py-1">
      {steps.map((step) => (
        <div key={step.name} className="flex items-center gap-3">
          <div className="flex flex-1 justify-center">
            <div
              className="flex h-9 items-center justify-center text-[10px] font-medium text-white"
              style={{
                width: step.width,
                backgroundColor: step.color,
                clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)",
              }}
            >
              {step.name}
            </div>
          </div>
          <span className="w-10 text-right text-[10px] text-[#8c8a80] dark:text-white/45">
            —
          </span>
        </div>
      ))}

      <p className="pt-1 text-[10px] text-[#88867e] dark:text-white/40">
        Connect analytics data to populate conversion counts.
      </p>
    </div>
  );
}

function RewardChart({ total }) {
  return (
    <div>
      <p className="text-[10px] text-[#77756d] dark:text-white/50">
        Total USDC fees
      </p>
      <p className="mt-1 text-lg font-semibold">
        {total == null ? "—" : `${total} USDC`}
      </p>

      <svg
        viewBox="0 0 230 95"
        className="mt-3 h-auto w-full"
        role="img"
        aria-label="Reward history unavailable"
      >
        <defs>
          <linearGradient id="rewardFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity=".2" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M4 78 L22 65 L37 72 L53 48 L69 59 L87 41 L103 53 L121 35 L139 42 L155 27 L173 31 L191 17 L208 22 L226 8 L226 92 L4 92 Z"
          fill="url(#rewardFill)"
        />
        <path
          d="M4 78 L22 65 L37 72 L53 48 L69 59 L87 41 L103 53 L121 35 L139 42 L155 27 L173 31 L191 17 L208 22 L226 8"
          fill="none"
          stroke={GOLD}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="mt-2 text-[10px] text-[#88867e] dark:text-white/40">
        Illustrative style; historical reward data unavailable.
      </p>
    </div>
  );
}

function EmptyTable({ columns, message }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[360px] text-left text-[10px]">
        <thead>
          <tr className="border-b border-[#eeece6] text-[#88867e] dark:border-white/10 dark:text-white/45">
            {columns.map((column) => (
              <th
                key={column}
                className="whitespace-nowrap py-3 pr-3 font-medium"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="py-8 text-center text-xs text-[#88867e] dark:text-white/45"
            >
              {message}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SidebarItem({ href, children, active = false }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] transition ${
        active
          ? "bg-[#D4A017]/10 font-semibold text-[#8b6508] dark:text-[#e3b52e]"
          : "text-[#5e5d56] hover:bg-[#f7f6f0] dark:text-white/65 dark:hover:bg-white/5"
      }`}
    >
      {children}
    </a>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { address: connectedWallet } = useAccount();
  const chainId = useChainId();

  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [formError, setFormError] = useState("");

  const isArcMainnet = chainId === ARC_MAINNET_ID;
  const contractAddress = getBountyContract(chainId);

  const {
    data: ownerAddress,
    refetch: refetchOwner,
    isLoading: ownerLoading,
  } = useReadContract({
    ...getOwnerConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });

  const {
    data: totalFeesRaw,
    refetch: refetchFees,
    isLoading: feesLoading,
  } = useReadContract({
    ...getTotalFeesConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });

  const {
    data: bountyCountRaw,
    refetch: refetchBountyCount,
    isLoading: bountyCountLoading,
  } = useReadContract({
    ...getBountyCounterConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });

  const isOwner =
    !!connectedWallet &&
    !!ownerAddress &&
    connectedWallet.toLowerCase() === ownerAddress.toLowerCase();

  const {
    writeContract: writeWithdraw,
    data: withdrawTxHash,
    isPending: isWithdrawPending,
    error: withdrawError,
  } = useWriteContract();

  const {
    isLoading: isWithdrawConfirming,
    isSuccess: withdrawSuccess,
  } = useWaitForTransactionReceipt({ hash: withdrawTxHash });

  const {
    writeContract: writeTransfer,
    data: transferTxHash,
    isPending: isTransferPending,
    error: transferError,
  } = useWriteContract();

  const {
    isLoading: isTransferConfirming,
    isSuccess: transferSuccess,
  } = useWaitForTransactionReceipt({ hash: transferTxHash });

  const txLoading =
    isWithdrawPending ||
    isWithdrawConfirming ||
    isTransferPending ||
    isTransferConfirming;

  useEffect(() => {
    if (withdrawSuccess || transferSuccess) {
      refetchOwner();
      refetchFees();
      refetchBountyCount();

      if (withdrawSuccess) setWithdrawAddress("");
      if (transferSuccess) setNewOwnerAddress("");
    }
  }, [
    withdrawSuccess,
    transferSuccess,
    refetchOwner,
    refetchFees,
    refetchBountyCount,
  ]);

  const handleWithdraw = () => {
    setFormError("");

    if (!isAddress(withdrawAddress)) {
      setFormError("Enter a valid recipient wallet address.");
      return;
    }
    if (!isOwner) {
      setFormError("Connect the contract owner wallet to withdraw fees.");
      return;
    }
    if (!isArcMainnet) {
      setFormError("Connect to Arc Mainnet before withdrawing USDC.");
      return;
    }

    writeWithdraw(
      prepareWithdrawTx({
        tokenType: 1,
        recipient: withdrawAddress,
        account: connectedWallet,
        chainId,
      })
    );
  };

  const handleTransferOwnership = () => {
    setFormError("");

    if (!isAddress(newOwnerAddress)) {
      setFormError("Enter a valid new owner wallet address.");
      return;
    }
    if (!isOwner) {
      setFormError("Connect the contract owner wallet to transfer ownership.");
      return;
    }
    if (!isArcMainnet) {
      setFormError("Connect to Arc Mainnet before transferring ownership.");
      return;
    }
    if (newOwnerAddress.toLowerCase() === ownerAddress?.toLowerCase()) {
      setFormError("That address is already the contract owner.");
      return;
    }

    writeTransfer(
      prepareTransferOwnershipTx({
        newOwner: newOwnerAddress,
        account: connectedWallet,
        chainId,
      })
    );
  };

  const totalUsdcFees =
    totalFeesRaw == null
      ? null
      : Number(formatUnits(totalFeesRaw, 6)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        });

  return (
    <main className="theme-page min-h-screen scroll-smooth bg-[#fbfaf7] text-[#202019] transition-colors dark:bg-[#080908] dark:text-white">
      <div className="flex min-h-screen">
        {/* Sidebar: links now jump to sections on this page instead of missing routes. */}
        <aside className="hidden w-[205px] shrink-0 flex-col border-r border-[#eeece6] bg-white px-3 py-4 dark:border-white/10 dark:bg-[#111311] lg:flex">
          <button
            onClick={() => navigate("/")}
            className="mb-7 flex items-center gap-2 px-2 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D4A017] text-lg font-semibold text-[#b1810a]">
              H
            </span>
            <span>
              <span className="block text-sm font-semibold">Happy Bounty</span>
              <span className="block text-[10px] text-[#88867e] dark:text-white/45">
                on Arc
              </span>
            </span>
          </button>

          <p className="mb-2 px-3 text-[9px] font-medium uppercase tracking-wider text-[#98958b]">
            Overview
          </p>
          <SidebarItem href="#dashboard-overview" active>
            <FiHome size={14} /> Dashboard
          </SidebarItem>

          <p className="mb-2 mt-5 px-3 text-[9px] font-medium uppercase tracking-wider text-[#98958b]">
            Bounties
          </p>
          <SidebarItem href="#bounties-overview">▧ All Bounties</SidebarItem>
          <SidebarItem href="#bounties-overview">◷ Active Bounties</SidebarItem>
          <SidebarItem href="#bounties-overview">✓ Completed</SidebarItem>
          <SidebarItem href="#bounties-overview">⊗ Cancelled</SidebarItem>

          <p className="mb-2 mt-5 px-3 text-[9px] font-medium uppercase tracking-wider text-[#98958b]">
            Analytics
          </p>
          <SidebarItem href="#bounties-overview">♙ Creator Analytics</SidebarItem>
          <SidebarItem href="#top-contributors">♧ Contributor Analytics</SidebarItem>

          <p className="mb-2 mt-5 px-3 text-[9px] font-medium uppercase tracking-wider text-[#98958b]">
            Transactions
          </p>
          <SidebarItem href="#recent-payouts">▣ Payouts</SidebarItem>
          <SidebarItem href="#escrow-overview">▤ Escrow</SidebarItem>

          <p className="mb-2 mt-5 px-3 text-[9px] font-medium uppercase tracking-wider text-[#98958b]">
            Community
          </p>
          <SidebarItem href="#top-contributors">♧ Contributors</SidebarItem>
          <SidebarItem href="#top-contributors">♜ Leaderboard</SidebarItem>

          <p className="mb-2 mt-5 px-3 text-[9px] font-medium uppercase tracking-wider text-[#98958b]">
            Settings
          </p>
          <SidebarItem href="#admin-controls">⚙ Admin Settings</SidebarItem>

          <div className="mt-auto rounded-xl border border-[#eeece6] p-3 dark:border-white/10">
            <p className="text-xs font-semibold">
              {shortAddress(connectedWallet)}
            </p>
            <p className="mt-1 text-[10px] text-[#88867e] dark:text-white/45">
              {isArcMainnet ? "Arc Mainnet" : "Wallet status"}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-7">
          <header
            id="dashboard-overview"
            className="mb-5 scroll-mt-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#D4A017]/40 bg-[#D4A017]/10 px-3 py-2 text-xs font-semibold text-[#8b6508] transition hover:bg-[#D4A017]/20 dark:text-[#e3b52e]"
                  aria-label="Return to the main dashboard"
                >
                  <FiArrowLeft size={16} />
                  <span>Back to Dashboard</span>
                </Link>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-[27px]">
                    Analytics Dashboard
                  </h1>
                  <p className="mt-1 text-xs text-[#77756d] dark:text-white/50">
                    Real-time insights and performance metrics for Happy Bounty
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/create")}
                className="rounded-lg px-4 py-2.5 text-xs font-semibold shadow-sm transition hover:brightness-95"
                style={{ backgroundColor: GOLD, color: "#171714" }}
              >
                + Create Bounty
              </button>
            </div>
          </header>

          {!connectedWallet && (
            <div className="mb-4 rounded-lg border border-[#e9e5da] bg-white p-3 text-xs dark:border-white/10 dark:bg-[#141614]">
              Connect your wallet to load on-chain statistics and use admin controls.
            </div>
          )}

          {!isArcMainnet && (
            <div className="mb-4 rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              Connect to Arc Mainnet to load contract data and submit admin transactions.
            </div>
          )}

          <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
            <StatCard
              icon="▤"
              label="Total Bounties"
              value={bountyCountLoading ? "…" : number(bountyCountRaw)}
              note="From the contract"
            />
            <StatCard
              icon="▣"
              label="Active Bounties"
              value="—"
              note="Analytics source needed"
              color="green"
            />
            <StatCard
              icon="✓"
              label="Completed Bounties"
              value="—"
              note="Analytics source needed"
            />
            <StatCard
              icon="$"
              label="Total Rewards (USDC)"
              value="—"
              note="Reward totals unavailable"
              color="green"
            />
            <StatCard
              icon="$"
              label="Total Paid (USDC)"
              value={feesLoading ? "…" : totalUsdcFees ?? "—"}
              note="Contract fee data"
              color="green"
            />
            <StatCard
              icon="♧"
              label="Total Contributors"
              value="—"
              note="Analytics source needed"
              color="purple"
            />
          </section>

          <section
            id="bounties-overview"
            className="mb-4 grid scroll-mt-6 grid-cols-1 gap-4 xl:grid-cols-[1.45fr_1fr_1fr]"
          >
            <Panel>
              <PanelHeading
                title="Bounties Overview"
                action={
                  <select className="rounded-lg border border-[#eeece6] bg-white px-2 py-1.5 text-[10px] outline-none dark:border-white/10 dark:bg-[#111311]">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                }
              />
              <OverviewChart total={bountyCountRaw} />
            </Panel>

            <Panel>
              <PanelHeading title="Funnel Conversion (All Bounties)" />
              <Funnel />
            </Panel>

            <Panel>
              <PanelHeading title="Reward Analytics (USDC)" />
              <RewardChart total={totalUsdcFees} />
            </Panel>
          </section>

          <section className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr_1fr]">
            <Panel>
              <PanelHeading title="Top Bounties by Submissions" />
              <EmptyTable
                columns={["#", "Bounty", "Reward", "Submissions", "Views"]}
                message="Bounty analytics data is not connected yet."
              />
            </Panel>

            <Panel id="top-contributors">
              <PanelHeading title="Top Contributors" />
              <EmptyTable
                columns={["#", "Contributor", "Completed", "Earned"]}
                message="Contributor statistics are not available yet."
              />
            </Panel>

            <Panel id="recent-payouts">
              <PanelHeading
                title="Recent Payouts"
                action={
                  <button
                    onClick={() =>
                      document
                        .getElementById("recent-payouts")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="text-[10px] font-medium text-[#a17a13]"
                  >
                    View all
                  </button>
                }
              />
              <EmptyTable
                columns={["Wallet", "Amount", "Status"]}
                message="Payout history is not connected yet."
              />
            </Panel>
          </section>

          <Panel id="escrow-overview" className="mb-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <Icon className="h-10 w-10 bg-violet-50 text-violet-500">▣</Icon>
                <div>
                  <p className="text-[10px] text-[#88867e] dark:text-white/45">
                    Escrow Balance
                  </p>
                  <p className="mt-1 text-sm font-semibold">— USDC</p>
                  <p className="mt-1 text-[9px] text-[#88867e] dark:text-white/40">
                    Balance source unavailable
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon className="h-10 w-10 bg-blue-50 text-blue-500">⇄</Icon>
                <div>
                  <p className="text-[10px] text-[#88867e] dark:text-white/45">
                    Total Transactions
                  </p>
                  <p className="mt-1 text-sm font-semibold">—</p>
                  <p className="mt-1 text-[9px] text-[#88867e] dark:text-white/40">
                    Transaction index needed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon className="h-10 w-10 bg-orange-50 text-orange-500">♧</Icon>
                <div>
                  <p className="text-[10px] text-[#88867e] dark:text-white/45">
                    Unique Wallets
                  </p>
                  <p className="mt-1 text-sm font-semibold">—</p>
                  <p className="mt-1 text-[9px] text-[#88867e] dark:text-white/40">
                    Wallet analytics needed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Icon className="h-10 w-10 bg-emerald-50 text-emerald-600">◇</Icon>
                <div>
                  <p className="text-[10px] text-[#88867e] dark:text-white/45">
                    Network
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {isArcMainnet ? "Arc Mainnet" : "Not connected"}
                  </p>
                  <p className="mt-1 text-[9px] text-[#88867e] dark:text-white/40">
                    Chain ID: {chainId ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel id="admin-controls">
            <PanelHeading title="Admin Controls" />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div>
                <h3 className="mb-3 text-xs font-semibold">
                  Withdraw USDC Fees
                </h3>

                <label
                  htmlFor="withdraw-address"
                  className="mb-2 block text-[11px] text-[#77756d] dark:text-white/55"
                >
                  Recipient address
                </label>
                <input
                  id="withdraw-address"
                  value={withdrawAddress}
                  onChange={(event) => {
                    setWithdrawAddress(event.target.value);
                    setFormError("");
                  }}
                  placeholder="0x..."
                  className="w-full rounded-lg border border-[#e3dfd3] bg-[#fcfbf7] px-3 py-2.5 text-xs outline-none focus:border-[#D4A017] dark:border-white/10 dark:bg-[#0d0f0d]"
                />

                <button
                  onClick={handleWithdraw}
                  disabled={
                    !isArcMainnet ||
                    !isOwner ||
                    txLoading ||
                    !withdrawAddress
                  }
                  className="mt-3 rounded-lg px-4 py-2.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: GOLD, color: "#171714" }}
                >
                  {txLoading ? "Transaction pending…" : "Withdraw USDC"}
                </button>

                <p className="mt-2 text-[10px] text-[#88867e] dark:text-white/45">
                  {isOwner
                    ? "Contract owner connected"
                    : "Owner wallet required to transact"}
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold">
                  Transfer Ownership
                </h3>

                <p className="mb-3 break-all text-[10px] text-[#77756d] dark:text-white/50">
                  Current owner:{" "}
                  {ownerLoading ? "Loading…" : shortAddress(ownerAddress)}
                </p>

                <label
                  htmlFor="new-owner-address"
                  className="mb-2 block text-[11px] text-[#77756d] dark:text-white/55"
                >
                  New owner address
                </label>
                <input
                  id="new-owner-address"
                  value={newOwnerAddress}
                  onChange={(event) => {
                    setNewOwnerAddress(event.target.value);
                    setFormError("");
                  }}
                  placeholder="0x..."
                  className="w-full rounded-lg border border-[#e3dfd3] bg-[#fcfbf7] px-3 py-2.5 text-xs outline-none focus:border-[#D4A017] dark:border-white/10 dark:bg-[#0d0f0d]"
                />

                <button
                  onClick={handleTransferOwnership}
                  disabled={
                    !isArcMainnet ||
                    !isOwner ||
                    txLoading ||
                    !newOwnerAddress
                  }
                  className="mt-3 rounded-lg border border-[#D4A017]/60 px-4 py-2.5 text-xs font-semibold text-[#8b6508] disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#e3b52e]"
                >
                  Transfer Ownership
                </button>
              </div>
            </div>

            {(formError || withdrawError || transferError) && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-300"
              >
                {formError ||
                  withdrawError?.shortMessage ||
                  transferError?.shortMessage ||
                  "Transaction failed. Check your wallet and try again."}
              </p>
            )}

            {(withdrawSuccess || transferSuccess) && (
              <p
                role="status"
                className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                {withdrawSuccess
                  ? "USDC withdrawal confirmed."
                  : "Ownership transfer confirmed."}
              </p>
            )}
          </Panel>

          {txLoading && (
            <div className="app-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
              <div className="app-modal-panel w-full max-w-sm rounded-2xl border border-[#ddd8ca] bg-[#f9f8f3] p-6 dark:border-white/10 dark:bg-[#111311]">
                <div className="mb-5 flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <p className="mt-4 text-sm font-medium text-[#625e55] dark:text-white/60">
                  Transaction pending. Confirm it in your wallet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
