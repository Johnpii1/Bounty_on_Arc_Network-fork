import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatEther } from "viem";
import {
  FiArrowLeft,
  FiShield,
  FiDollarSign,
  FiUser,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { showToast } from "../components/UI/Toast";
import {
  getBountyCounterConfig,
  getFeePercentConfig,
  getOwnerConfig,
  getTotalFeesConfig,
  prepareTransferOwnershipTx,
} from "../services/bountyService";
import { getBountyContract } from "../utils/chains.address";
import { formatAmount } from "../utils/format";

const ARC_MAINNET_ID = 5042;
const GOLD = "#D4A017";

const shortAddress = (address) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—";

const formatNumber = (value) =>
  value == null ? "—" : Number(value).toLocaleString();

function StatCard({ icon, label, value, note }) {
  return (
    <article className="min-w-0 rounded-2xl border border-[#e9e5da] bg-white p-4 shadow-[0_2px_10px_rgba(24,24,20,0.025)] transition-colors dark:border-white/10 dark:bg-[#141614] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#77756d] dark:text-white/55 sm:text-sm">{label}</p>
          <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-[#171714] dark:text-white sm:text-3xl">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4A017]/10 text-lg text-[#a77b08] dark:text-[#e3b52e]">{icon}</span>
      </div>
      {note && <p className="mt-3 text-xs text-[#8b887e] dark:text-white/45">{note}</p>}
    </article>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a17a13]">{eyebrow}</p>}
        <h2 className="text-base font-semibold text-[#171714] dark:text-white sm:text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { address: connectedWallet } = useAccount();
  const chainId = useChainId();

  const contractAddress = getBountyContract(chainId);

  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  /* ---------------- Reads ---------------- */

  const { data: ownerAddress, refetch: refetchOwner } = useReadContract({
    ...(chainId ? getOwnerConfig({ chainId }) : {}),
    query: { enabled: !!chainId && !!contractAddress },
  });

  const { data: totalFeesRaw, refetch: refetchFees } = useReadContract({
    ...(chainId ? getTotalFeesConfig({ chainId }) : {}),
    query: { enabled: !!chainId && !!contractAddress },
  });

  const { data: feePercentRaw } = useReadContract({
    ...(chainId ? getFeePercentConfig({ chainId }) : {}),
    query: { enabled: !!chainId && !!contractAddress },
  });

  const isOwner =
    connectedWallet &&
    ownerAddress &&
    connectedWallet.toLowerCase() === ownerAddress.toLowerCase();

  /* ---------------- Writes ---------------- */

  const {
    writeContract: writeWithdraw,
    data: withdrawTxHash,
    isPending: isWithdrawPending,
    error: withdrawError,
  } = useWriteContract();

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } =
    useWaitForTransactionReceipt({ hash: withdrawTxHash });

  const {
    writeContract: writeTransfer,
    data: transferTxHash,
    isPending: isTransferPending,
    error: transferError,
  } = useWriteContract();

  const { isLoading: isTransferConfirming, isSuccess: isTransferSuccess } =
    useWaitForTransactionReceipt({ hash: transferTxHash });

  const txLoading =
    isWithdrawPending ||
    isWithdrawConfirming ||
    isTransferPending ||
    isTransferConfirming;

  /* ---------------- Handlers ---------------- */

  const handleWithdraw = () => {
    if (!withdrawAddress) return;
    const config = prepareWithdrawTx({
      recipient: withdrawAddress,
      account: connectedWallet,
      chainId,
    });
    writeWithdraw(config);
    setShowWithdrawConfirm(false);
  };

  const handleTransferOwnership = () => {
    if (!newOwnerAddress) return;
    const config = prepareTransferOwnershipTx({
      newOwner: newOwnerAddress,
      account: connectedWallet,
      chainId,
    }));
  };

  /* ---------------- Post-transaction effects ---------------- */

  useEffect(() => {
    if (isWithdrawSuccess) {
      showToast.success("Fees withdrawn");
      refetchFees();
      setWithdrawAddress("");
    }
  }, [isWithdrawSuccess]);

  useEffect(() => {
    if (isTransferSuccess) {
      showToast.success("Ownership transferred");
      refetchOwner();
      setNewOwnerAddress("");
    }
  }, [isTransferSuccess]);

  useEffect(() => {
    if (withdrawError) {
      showToast.error(withdrawError.shortMessage || "Withdraw failed");
    }
  }, [withdrawError]);

  useEffect(() => {
    if (transferError) {
      showToast.error(transferError.shortMessage || "Transfer failed");
    }
  }, [transferError]);

  /* ---------------- Formatting ---------------- */

  const totalFees = totalFeesRaw
    ? formatAmount(formatEther(totalFeesRaw))
    : "0";
  const feePercent = feePercentRaw ? Number(feePercentRaw) / 100 : 0;

  /* ---------------- UI classes ---------------- */

  const cardClass =
    "relative overflow-hidden rounded-3xl border border-[#dedbd1] dark:border-white/10 bg-white dark:bg-[#111311] shadow-[0_18px_60px_rgba(34,31,24,0.07)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-colors duration-300";

  const inputClass =
    "w-full bg-white dark:bg-[#111311] border border-[#ddd9ce] dark:border-white/10 rounded-xl px-4 py-3 text-[#171714] dark:text-white placeholder:text-[#99958a] dark:placeholder:text-white/35 outline-none transition focus:border-[#c49b2c] dark:focus:border-[#D4AF37] focus:ring-2 focus:ring-[#d4af37]/10";

  /* ---------------- Loading / Access control ---------------- */

  if (!connectedWallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f0] dark:bg-[#080908] px-4">
        <div className={cardClass}>
          <div className="p-8 text-center max-w-md">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#f5f1e4] dark:bg-[#151715] border border-[#e5ddc8] dark:border-white/10 flex items-center justify-center text-[#b28b20] dark:text-[#D4AF37]">
              <FiShield size={22} />
            </div>
            <h1 className="text-lg font-bold text-[#171714] dark:text-white">
              Connect your wallet
            </h1>
            <p className="text-sm text-[#777267] dark:text-white/55 mt-1.5">
              The admin panel is only accessible to the contract owner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (ownerAddress === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f0] dark:bg-[#080908] px-4">
        <div className={cardClass}>
          <div className="p-8 text-center max-w-md">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#e5ddc8] dark:border-white/10 border-t-[#d4af37] animate-spin" />
            <p className="text-sm text-[#777267] dark:text-white/55 mt-4">
              Loading contract state...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f0] dark:bg-[#080908] px-4">
        <div className={cardClass}>
          <div className="p-8 text-center max-w-md">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#fbe9e7] dark:bg-[#351b1b] border border-[#ef9a9a] dark:border-[#c62828]/40 flex items-center justify-center text-[#c62828] dark:text-[#ef9a9a]">
              <FiAlertTriangle size={22} />
            </div>
            <h1 className="text-lg font-bold text-[#171714] dark:text-white">
              Access denied
            </h1>
            <p className="text-sm text-[#777267] dark:text-white/55 mt-1.5">
              Only the contract owner can access this page.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold text-sm hover:bg-[#292922] dark:hover:bg-[#B8962E] transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Main ---------------- */

  return (
    <div
      className="min-h-screen bg-[#f7f6f0] dark:bg-[#080908] text-[#171714] dark:text-white transition-colors duration-300 py-8 pt-28"
      style={{
        backgroundImage: `
          linear-gradient(rgba(112,105,88,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(112,105,88,0.035) 1px, transparent 1px)
        `,
        backgroundSize: "56px 28px",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111311] border border-[#dcd8ce] dark:border-white/10 text-[#4f4b43] dark:text-white/70 text-sm font-semibold hover:border-[#b28b20] dark:hover:border-[#D4AF37]/50 transition"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#171714] dark:bg-[#151715] text-[#d4af37]">
              <FiShield size={17} />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b8679] dark:text-white/50">
              Contract Admin
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Admin Panel
          </h1>
          <p className="text-sm text-[#777267] dark:text-white/55 mt-2">
            Manage protocol fees and contract ownership.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className={cardClass}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiUser
                  size={14}
                  className="text-[#b28b20] dark:text-[#D4AF37]"
                />
                <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40">
                  Owner
                </p>
              </div>
              <p className="font-mono text-sm font-semibold break-all">
                {ownerAddress.slice(0, 10)}...{ownerAddress.slice(-8)}
              </p>
              <p className="text-[10px] text-[#99958a] dark:text-white/35 mt-1">
                You are the owner
              </p>
            </div>
          </div>

          <div className={cardClass}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo
                  size={14}
                  className="text-[#b28b20] dark:text-[#D4AF37]"
                />
                <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40">
                  Protocol fee
                </p>
              </div>
              <p className="text-2xl font-bold text-[#8f6c12] dark:text-[#D4AF37]">
                {feePercent}%
              </p>
              <p className="text-[10px] text-[#99958a] dark:text-white/35 mt-1">
                Per bounty reward
              </p>
            </div>
          </div>

          <div className={cardClass}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign
                  size={14}
                  className="text-[#b28b20] dark:text-[#D4AF37]"
                />
                <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40">
                  Fees collected
                </p>
              </div>
              <p className="text-2xl font-bold text-[#8f6c12] dark:text-[#D4AF37]">
                {totalFees} USDC
              </p>
              <p className="text-[10px] text-[#99958a] dark:text-white/35 mt-1">
                Available to withdraw
              </p>
            </div>
          </div>
        </div>

        {/* Withdraw card */}
        <div className={cardClass}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f1e4] dark:bg-[#151715] border border-[#e5ddc8] dark:border-white/10 flex items-center justify-center text-[#b28b20] dark:text-[#D4AF37] shrink-0">
                <FiDollarSign size={17} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Withdraw fees</h2>
                <p className="text-sm text-[#777267] dark:text-white/55 mt-0.5">
                  Transfer accumulated protocol fees to any address.
                </p>
              </div>
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] dark:text-white/45 mb-2.5">
              Recipient address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className={`${inputClass} font-mono`}
            />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowWithdrawConfirm(true)}
                disabled={
                  txLoading ||
                  !withdrawAddress ||
                  Number(totalFees.replace(/,/g, "")) === 0
                }
                className="px-5 py-2.5 rounded-xl bg-[#d4af37] dark:bg-[#e0bd45] text-[#171714] font-semibold hover:bg-[#c49b2c] dark:hover:bg-[#d2ac2f] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {txLoading ? "Processing..." : "Withdraw"}
              </button>

              {Number(totalFees.replace(/,/g, "")) === 0 && (
                <p className="text-xs text-[#99958a] dark:text-white/40">
                  No fees accumulated yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Transfer ownership card */}
        <div className={`${cardClass} mt-6`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#c62828]" />
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#fbe9e7] dark:bg-[#351b1b] border border-[#ef9a9a] dark:border-[#c62828]/40 flex items-center justify-center text-[#c62828] dark:text-[#ef9a9a] shrink-0">
                <FiAlertTriangle size={17} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Transfer ownership</h2>
                <p className="text-sm text-[#777267] dark:text-white/55 mt-0.5">
                  Hand over admin rights to another address.
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-2xl bg-[#fbe9e7] dark:bg-[#351b1b] border border-[#ef9a9a] dark:border-[#c62828]/40 p-4">
              <p className="text-xs leading-relaxed text-[#c62828] dark:text-[#ef9a9a]">
                <strong>This action is irreversible.</strong> Once you transfer
                ownership, you will not be able to withdraw fees or assign
                winners on any bounty again. Double-check the address before
                confirming.
              </p>
            </div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] dark:text-white/45 mb-2.5">
              New owner address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={newOwnerAddress}
              onChange={(e) => setNewOwnerAddress(e.target.value)}
              className={`${inputClass} font-mono`}
            />

            <button
              onClick={handleTransferOwnership}
              disabled={txLoading || !newOwnerAddress}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {txLoading ? "Processing..." : "Transfer Ownership"}
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw confirmation modal */}
      {showWithdrawConfirm && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 bg-[#171714]/60 dark:bg-black/70"
          onClick={() => setShowWithdrawConfirm(false)}
        >
          <div
            className="bg-[#f9f8f3] dark:bg-[#111311] border border-[#ddd8ca] dark:border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#f1ead4] dark:bg-[#D4AF37]/10 flex items-center justify-center text-[#a17a17] dark:text-[#D4AF37] shrink-0">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Confirm withdrawal</h3>
                <p className="text-sm text-[#7c766b] dark:text-white/55 mt-1">
                  This will transfer all accumulated fees to the recipient
                  below.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#fbfaf6] dark:bg-[#151715] border border-[#e7e3da] dark:border-white/10 p-4 mb-5">
              <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-2">
                Recipient
              </p>
              <p className="font-mono text-sm break-all">{withdrawAddress}</p>

              <div className="mt-3 pt-3 border-t border-[#e7e3da] dark:border-white/10">
                <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-2">
                  Amount
                </p>
                <p className="text-lg font-bold text-[#8f6c12] dark:text-[#D4AF37]">
                  {totalFees} USDC
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#151715] border border-[#d9d4c8] dark:border-white/10 text-[#555047] dark:text-white/70 font-semibold hover:bg-[#f4f2ec] dark:hover:bg-[#1b1e1b] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-4 py-3 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {txLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#171714]/40 dark:bg-black/60">
          <div className="bg-[#f9f8f3] dark:bg-[#111311] border border-[#ddd8ca] dark:border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#e5ddc8] dark:border-white/10 border-t-[#d4af37] animate-spin" />
              <div>
                <p className="text-sm font-semibold">Transaction pending</p>
                <p className="text-xs text-[#777267] dark:text-white/55 mt-0.5">
                  Confirm it in your wallet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}