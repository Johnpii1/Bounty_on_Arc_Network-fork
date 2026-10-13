import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatEther, isAddress } from "viem";
import {
  getBountyCounterConfig,
  getFeePercentConfig,
  getOwnerConfig,
  getTotalFeesConfig,
  prepareTransferOwnershipTx,
  prepareWithdrawTx,
} from "../services/bountyService";
import { getBountyContract } from "../utils/chains.address";
import Skeleton from "../components/UI/Skeleton";

const ARC_MAINNET_ID = 5042;
const GOLD = "#D4A017";
const CONFIRM_TIMEOUT_MS = 6000; // #4 auto-revert confirmation state

const shortAddress = (address) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—";

const formatNumber = (value) =>
  value == null ? "—" : Number(value).toLocaleString();

function StatCard({ icon, label, value, note }) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#e9e5da] bg-white p-4 shadow-[0_2px_10px_rgba(24,24,20,0.025)] transition-colors dark:border-white/10 dark:bg-[#141614] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#77756d] dark:text-white/55 sm:text-sm">
            {label}
          </p>
          <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-[#171714] dark:text-white sm:text-3xl">
            {value}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/10 text-lg text-[#a77b08] dark:text-[#e3b52e]">
          {icon}
        </span>
      </div>
      {note && (
        <p className="mt-3 text-xs text-[#8b887e] dark:text-white/45">{note}</p>
      )}
    </article>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a17a13]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-base font-semibold text-[#171714] dark:text-white sm:text-lg">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function MobileNav({ onNavigate }) {
  return (
    <nav className="flex items-center justify-between border-b border-[#e9e5da] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#101210] lg:hidden">
      <button
        onClick={() => onNavigate("/")}
        className="flex items-center gap-2"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          H
        </span>
        <span className="text-sm font-bold">Happy Bounty</span>
      </button>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate("/dashboard")}
          className="rounded-lg px-3 py-2 text-xs font-medium text-[#656259] transition hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/5"
        >
          Bounties
        </button>
        <button
          onClick={() => onNavigate("/create")}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-[#171714] transition hover:brightness-95"
          style={{ backgroundColor: GOLD }}
        >
          ＋ Create
        </button>
      </div>
    </nav>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { address: connectedWallet } = useAccount();
  const chainId = useChainId();
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [formError, setFormError] = useState("");

  // #4 confirmation state for withdraw and transfer
  const [confirmAction, setConfirmAction] = useState(null); // "withdraw" | "transfer" | null

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
  const { data: feePercentRaw, isLoading: feePercentLoading } = useReadContract(
    {
      ...getFeePercentConfig({ chainId }),
      query: { enabled: isArcMainnet && !!contractAddress },
    },
  );

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
  const { isLoading: isWithdrawConfirming, isSuccess: withdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: withdrawTxHash,
    });

  const {
    writeContract: writeTransfer,
    data: transferTxHash,
    isPending: isTransferPending,
    error: transferError,
  } = useWriteContract();
  const { isLoading: isTransferConfirming, isSuccess: transferSuccess } =
    useWaitForTransactionReceipt({
      hash: transferTxHash,
    });

  const txLoading =
    isWithdrawPending ||
    isWithdrawConfirming ||
    isTransferPending ||
    isTransferConfirming;

  // #7 split refetch effect: withdraw only touches fees, transfer only touches owner
  useEffect(() => {
    if (withdrawSuccess) {
      refetchFees();
      setWithdrawAddress("");
      setFormError(""); // #9 clear stale errors on success
      setConfirmAction(null);
    }
  }, [withdrawSuccess, refetchFees]);

  useEffect(() => {
    if (transferSuccess) {
      refetchOwner();
      setNewOwnerAddress("");
      setFormError(""); // #9 clear stale errors on success
      setConfirmAction(null);
    }
  }, [transferSuccess, refetchOwner]);

  // #4 auto-revert the confirmation state after a few seconds
  useEffect(() => {
    if (!confirmAction) return;
    const timer = setTimeout(() => setConfirmAction(null), CONFIRM_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [confirmAction]);

  // #2 trim addresses before validation
  const validateWithdraw = () => {
    const trimmed = withdrawAddress.trim();
    if (!isAddress(trimmed)) {
      setFormError("Enter a valid recipient wallet address.");
      return null;
    }
    if (!isOwner) {
      setFormError("Connect the contract owner wallet to withdraw fees.");
      return null;
    }
    return trimmed;
  };

  const validateTransfer = () => {
    const trimmed = newOwnerAddress.trim();
    if (!isAddress(trimmed)) {
      setFormError("Enter a valid new owner wallet address.");
      return null;
    }
    if (trimmed.toLowerCase() === ownerAddress?.toLowerCase()) {
      setFormError("That address is already the contract owner.");
      return null;
    }
    if (!isOwner) {
      setFormError("Connect the contract owner wallet to transfer ownership.");
      return null;
    }
    return trimmed;
  };

  const handleWithdrawClick = () => {
    setFormError("");
    if (!validateWithdraw()) return;
    // #4 first click sets confirmation state; second click submits
    if (confirmAction !== "withdraw") {
      setConfirmAction("withdraw");
      return;
    }
    handleWithdraw();
  };

  const handleWithdraw = () => {
    const trimmed = validateWithdraw();
    if (!trimmed) return;
    writeWithdraw(
      prepareWithdrawTx({
        recipient: trimmed,
        account: connectedWallet,
        chainId,
      }),
    );
  };

  const handleTransferClick = () => {
    setFormError("");
    if (!validateTransfer()) return;
    if (confirmAction !== "transfer") {
      setConfirmAction("transfer");
      return;
    }
    handleTransferOwnership();
  };

  const handleTransferOwnership = () => {
    const trimmed = validateTransfer();
    if (!trimmed) return;
    writeTransfer(
      prepareTransferOwnershipTx({
        newOwner: trimmed,
        account: connectedWallet,
        chainId,
      }),
    );
  };

  const totalUsdcFees =
    totalFeesRaw == null
      ? "—"
      : Number(formatEther(totalFeesRaw)).toLocaleString(undefined, {
          maximumFractionDigits: 4,
        });

  // #5 handle decimal fee percent cleanly
  const rawFeePercent =
    feePercentRaw == null ? null : Number(feePercentRaw) / 100;
  const feePercent =
    rawFeePercent == null
      ? "—"
      : Number.isInteger(rawFeePercent)
        ? rawFeePercent.toString()
        : rawFeePercent.toFixed(2);

  // #11 gate the page in three explicit states with no flash

  // State 1: wallet not connected
  if (!connectedWallet) {
    return (
      <main className="theme-page flex min-h-screen items-center justify-center bg-[#f7f6f0] px-5 text-[#171714] transition-colors duration-300 dark:bg-[#080908] dark:text-white">
        <section className="w-full max-w-md rounded-3xl border border-[#e9e5da] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#141614]">
          <div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
            style={{ backgroundColor: "rgba(212,160,23,.12)", color: GOLD }}
          >
            H
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Connect your wallet</h1>
          <p className="mt-2 text-sm leading-6 text-[#77756d] dark:text-white/55">
            The admin panel is only accessible to the contract owner. Connect
            the owner wallet to continue.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-[#171714] transition hover:brightness-95"
            style={{ backgroundColor: GOLD }}
          >
            Return home
          </button>
        </section>
      </main>
    );
  }

  // State 2: owner address loading
  if (ownerLoading) {
    return (
      <main className="theme-page flex min-h-screen items-center justify-center bg-[#f7f6f0] px-5 text-[#171714] transition-colors duration-300 dark:bg-[#080908] dark:text-white">
        <section className="w-full max-w-md rounded-3xl border border-[#e9e5da] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#141614]">
          <div
            className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#e5ddc8] dark:border-white/10"
            style={{ borderTopColor: GOLD }}
          />
          <p className="mt-4 text-sm text-[#77756d] dark:text-white/55">
            Checking owner permissions…
          </p>
        </section>
      </main>
    );
  }

  // State 3: connected but not owner
  if (!isOwner) {
    return (
      <main className="theme-page flex min-h-screen items-center justify-center bg-[#f7f6f0] px-5 text-[#171714] transition-colors duration-300 dark:bg-[#080908] dark:text-white">
        <section className="w-full max-w-md rounded-3xl border border-[#e9e5da] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#141614]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-500">
            !
          </div>
          <h1 className="mt-5 text-2xl font-semibold">Access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-[#77756d] dark:text-white/55">
            Only the contract owner can access administration controls.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-[#171714] transition hover:brightness-95"
            style={{ backgroundColor: GOLD }}
          >
            Return home
          </button>
        </section>
      </main>
    );
  }

  // Main render — owner is confirmed
  return (
    <main className="theme-page min-h-screen bg-[#f7f6f0] text-[#171714] transition-colors duration-300 dark:bg-[#080908] dark:text-white">
      {/* #5 mobile nav — visible only below lg breakpoint */}
      <MobileNav onNavigate={navigate} />

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[230px] shrink-0 border-r border-[#e9e5da] bg-white/70 px-4 py-6 dark:border-white/10 dark:bg-[#101210] lg:flex lg:flex-col">
          <button
            onClick={() => navigate("/")}
            className="mb-10 flex items-center gap-3 px-2 text-left"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-bold"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              H
            </span>
            <span>
              <span className="block text-sm font-bold">Happy Bounty</span>
              <span className="block text-[11px] text-[#8b887e] dark:text-white/45">
                on Arc
              </span>
            </span>
          </button>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#969287]">
            Workspace
          </p>
          <button
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold"
            style={{ backgroundColor: "rgba(212,160,23,.12)", color: GOLD }}
          >
            <span>▦</span> Admin overview
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#656259] transition hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/5"
          >
            <span>◫</span> Bounties
          </button>
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#656259] transition hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/5"
          >
            <span>＋</span> Create bounty
          </button>
          <div className="mt-auto rounded-2xl border border-[#e9e5da] p-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold">Arc Mainnet</span>
            </div>
            <p className="mt-2 break-all text-[10px] leading-4 text-[#8b887e] dark:text-white/45">
              {contractAddress || "Contract unavailable on this network"}
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e5da] pb-6 dark:border-white/10">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="mb-3 text-xs font-medium text-[#8b887e] transition hover:text-[#a17a13]"
              >
                ← Back
              </button>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17a13]">
                Happy Bounty / Control center
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                Admin dashboard
              </h1>
              <p className="mt-2 text-sm text-[#77756d] dark:text-white/50">
                Manage contract fees and ownership from one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#e9e5da] bg-white px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-[#141614]">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Arc Mainnet
              </span>
              <button
                onClick={() => navigate("/create")}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:brightness-95"
                style={{ backgroundColor: GOLD, color: "#171714" }}
              >
                ＋ Create bounty
              </button>
            </div>
          </header>

          {!isArcMainnet && (
            <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              <p className="font-semibold">Switch to Arc Mainnet</p>
              <p className="mt-1 opacity-80">
                Admin contract actions are disabled on other networks. Connect
                to Arc Mainnet (chain ID {ARC_MAINNET_ID}) to continue.
              </p>
            </div>
          )}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon="▤"
              label="Total bounties"
              value={bountyCountLoading ? "…" : formatNumber(bountyCountRaw)}
              note="Read from the Arc Mainnet contract"
            />
            <StatCard
              icon="$"
              label="Total fees collected"
              value={
                feesLoading
                  ? "…"
                  : totalUsdcFees === "—"
                    ? "—"
                    : `${totalUsdcFees} USDC`
              }
              note="Native USDC-denominated contract balance"
            />
            <StatCard
              icon="％"
              label="Platform fee"
              value={feePercentLoading ? "…" : `${feePercent}%`}
              note="Configured on the bounty contract"
            />
            <StatCard
              icon="◎"
              label="Contract owner"
              value={ownerLoading ? "…" : shortAddress(ownerAddress)}
              note={
                connectedWallet
                  ? `Connected wallet: ${shortAddress(connectedWallet)}`
                  : "Wallet not connected"
              }
            />
          </section>

          <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-2xl border border-[#e9e5da] bg-white p-5 shadow-[0_2px_10px_rgba(24,24,20,0.025)] dark:border-white/10 dark:bg-[#141614] sm:p-6">
              <SectionHeading eyebrow="Treasury" title="Withdraw USDC fees" />
              <p className="mb-5 max-w-xl text-sm leading-6 text-[#77756d] dark:text-white/50">
                Send collected native USDC to a wallet address. This action
                requires the contract owner wallet and a transaction
                confirmation.
              </p>
              <label
                htmlFor="withdraw-address"
                className="mb-2 block text-xs font-semibold text-[#555249] dark:text-white/70"
              >
                Recipient wallet address
              </label>
              <input
                id="withdraw-address"
                value={withdrawAddress}
                onChange={(event) => {
                  setWithdrawAddress(event.target.value);
                  setFormError("");
                  setConfirmAction(null);
                }}
                placeholder="0x…"
                autoComplete="off"
                className="w-full rounded-xl border border-[#e3dfd3] bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa69a] focus:border-[#D4A017] dark:border-white/10 dark:bg-[#0d0f0d] dark:text-white dark:placeholder:text-white/25"
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleWithdrawClick}
                  disabled={
                    !isArcMainnet || !isOwner || txLoading || !withdrawAddress
                  }
                  className="rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    backgroundColor:
                      confirmAction === "withdraw" ? "#c04a1f" : GOLD,
                    color: "#171714",
                  }}
                >
                  {txLoading
                    ? "Transaction pending…"
                    : confirmAction === "withdraw"
                      ? "Click again to confirm"
                      : "Withdraw USDC"}
                </button>
                <span className="text-xs text-[#8b887e] dark:text-white/45">
                  USDC only · Arc Mainnet
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e9e5da] bg-white p-5 shadow-[0_2px_10px_rgba(24,24,20,0.025)] dark:border-white/10 dark:bg-[#141614] sm:p-6">
              <SectionHeading eyebrow="Security" title="Ownership" />
              <div className="rounded-xl bg-[#f7f6f0] p-4 dark:bg-[#0d0f0d]">
                <p className="text-xs text-[#8b887e] dark:text-white/45">
                  Current contract owner
                </p>
                <p className="mt-2 break-all font-mono text-sm">
                  {ownerAddress}
                </p>
              </div>
              <label
                htmlFor="new-owner-address"
                className="mb-2 mt-5 block text-xs font-semibold text-[#555249] dark:text-white/70"
              >
                New owner address
              </label>
              <input
                id="new-owner-address"
                value={newOwnerAddress}
                onChange={(event) => {
                  setNewOwnerAddress(event.target.value);
                  setFormError("");
                  setConfirmAction(null);
                }}
                placeholder="0x…"
                autoComplete="off"
                className="w-full rounded-xl border border-[#e3dfd3] bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa69a] focus:border-[#D4A017] dark:border-white/10 dark:bg-[#0d0f0d] dark:text-white dark:placeholder:text-white/25"
              />
              <button
                onClick={handleTransferClick}
                disabled={
                  !isArcMainnet || !isOwner || txLoading || !newOwnerAddress
                }
                className="mt-3 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
                style={
                  confirmAction === "transfer"
                    ? {
                        borderColor: "#c04a1f",
                        backgroundColor: "rgba(192,74,31,0.08)",
                        color: "#c04a1f",
                      }
                    : {
                        borderColor: "rgba(212,160,23,0.5)",
                        color: "#87620a",
                      }
                }
              >
                {txLoading
                  ? "Transaction pending…"
                  : confirmAction === "transfer"
                    ? "Click again to confirm transfer"
                    : "Transfer ownership"}
              </button>
              <p className="mt-3 text-xs leading-5 text-[#8b887e] dark:text-white/45">
                Warning: ownership transfer is a sensitive on-chain action.
                Verify the address before confirming.
              </p>
            </article>
          </section>

          {(formError || withdrawError || transferError) && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
            >
              {formError ||
                withdrawError?.shortMessage ||
                transferError?.shortMessage ||
                "Transaction failed. Please check your wallet and try again."}
            </div>
          )}
          {(withdrawSuccess || transferSuccess) && (
            <div
              role="status"
              className="mb-5 rounded-xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
            >
              {withdrawSuccess
                ? "USDC withdrawal confirmed on-chain."
                : "Ownership transfer confirmed on-chain."}
            </div>
          )}

          <section className="rounded-2xl border border-[#e9e5da] bg-white p-5 dark:border-white/10 dark:bg-[#141614] sm:p-6">
            <SectionHeading
              eyebrow="Network status"
              title="Contract connection"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-[#8b887e] dark:text-white/45">
                  Network
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {isArcMainnet
                    ? "Arc Mainnet"
                    : `Unsupported network · ${chainId ?? "not connected"}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8b887e] dark:text-white/45">
                  Contract
                </p>
                <p className="mt-1 break-all font-mono text-xs">
                  {contractAddress || "No contract configured for this network"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8b887e] dark:text-white/45">
                  Owner permissions
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {isOwner ? "Owner access verified" : "Owner wallet required"}
                </p>
              </div>
            </div>
          </section>

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
