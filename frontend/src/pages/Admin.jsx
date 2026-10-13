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
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [formError, setFormError] = useState("");

  const isArcMainnet = chainId === ARC_MAINNET_ID;
  const contractAddress = getBountyContract(chainId);

  const { data: ownerAddress, refetch: refetchOwner, isLoading: ownerLoading } = useReadContract({
    ...getOwnerConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });
  const { data: totalFeesRaw, refetch: refetchFees, isLoading: feesLoading } = useReadContract({
    ...getTotalFeesConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });
  const { data: bountyCountRaw, refetch: refetchBountyCount, isLoading: bountyCountLoading } = useReadContract({
    ...getBountyCounterConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });
  const { data: feePercentRaw, isLoading: feePercentLoading } = useReadContract({
    ...getFeePercentConfig({ chainId }),
    query: { enabled: isArcMainnet && !!contractAddress },
  });

  const isOwner = !!connectedWallet && !!ownerAddress &&
    connectedWallet.toLowerCase() === ownerAddress.toLowerCase();

  const {
    writeContract: writeWithdraw,
    data: withdrawTxHash,
    isPending: isWithdrawPending,
    error: withdrawError,
  } = useWriteContract();
  const { isLoading: isWithdrawConfirming, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
  });

  const {
    writeContract: writeTransfer,
    data: transferTxHash,
    isPending: isTransferPending,
    error: transferError,
  } = useWriteContract();
  const { isLoading: isTransferConfirming, isSuccess: transferSuccess } = useWaitForTransactionReceipt({
    hash: transferTxHash,
  });

  const txLoading = isWithdrawPending || isWithdrawConfirming || isTransferPending || isTransferConfirming;

  useEffect(() => {
    if (withdrawSuccess || transferSuccess) {
      refetchOwner();
      refetchFees();
      refetchBountyCount();
      if (withdrawSuccess) setWithdrawAddress("");
      if (transferSuccess) setNewOwnerAddress("");
    }
  }, [withdrawSuccess, transferSuccess, refetchOwner, refetchFees, refetchBountyCount]);

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
    writeWithdraw(prepareWithdrawTx({
      recipient: withdrawAddress,
      account: connectedWallet,
      chainId,
    }));
  };

  const handleTransferOwnership = () => {
    setFormError("");
    if (!isAddress(newOwnerAddress)) {
      setFormError("Enter a valid new owner wallet address.");
      return;
    }
    if (newOwnerAddress.toLowerCase() === ownerAddress?.toLowerCase()) {
      setFormError("That address is already the contract owner.");
      return;
    }
    if (!isOwner) {
      setFormError("Connect the contract owner wallet to transfer ownership.");
      return;
    }
    writeTransfer(prepareTransferOwnershipTx({
      newOwner: newOwnerAddress,
      account: connectedWallet,
      chainId,
    }));
  };

  const totalUsdcFees = totalFeesRaw == null ? "—" : Number(formatEther(totalFeesRaw)).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
  const feePercent = feePercentRaw == null ? "—" : (Number(feePercentRaw) / 100).toString();

  if (connectedWallet && ownerAddress && !isOwner) {
    return (
      <main className="theme-page flex min-h-screen items-center justify-center bg-[#f7f6f0] px-5 text-[#171714] transition-colors duration-300 dark:bg-[#080908] dark:text-white">
        <section className="w-full max-w-md rounded-3xl border border-[#e9e5da] bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#141614]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-500">!</div>
          <h1 className="mt-5 text-2xl font-semibold">Access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-[#77756d] dark:text-white/55">Only the contract owner can access administration controls.</p>
          <button onClick={() => navigate("/")} className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-[#171714] transition hover:brightness-95" style={{ backgroundColor: GOLD }}>Return home</button>
        </section>
      </main>
    );
  }

  return (
    <main className="theme-page min-h-screen bg-[#f7f6f0] text-[#171714] transition-colors duration-300 dark:bg-[#080908] dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[230px] shrink-0 border-r border-[#e9e5da] bg-white/70 px-4 py-6 dark:border-white/10 dark:bg-[#101210] lg:flex lg:flex-col">
          <button onClick={() => navigate("/")} className="mb-10 flex items-center gap-3 px-2 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg font-bold" style={{ borderColor: GOLD, color: GOLD }}>H</span>
            <span><span className="block text-sm font-bold">Happy Bounty</span><span className="block text-[11px] text-[#8b887e] dark:text-white/45">on Arc</span></span>
          </button>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#969287]">Workspace</p>
          <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold" style={{ backgroundColor: "rgba(212,160,23,.12)", color: GOLD }}><span>▦</span> Admin overview</button>
          <button onClick={() => navigate("/dashboard")} className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#656259] transition hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/5"><span>◫</span> Bounties</button>
          <button onClick={() => navigate("/create")} className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#656259] transition hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/5"><span>＋</span> Create bounty</button>
          <div className="mt-auto rounded-2xl border border-[#e9e5da] p-3 dark:border-white/10">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-xs font-semibold">Arc Mainnet</span></div>
            <p className="mt-2 break-all text-[10px] leading-4 text-[#8b887e] dark:text-white/45">{contractAddress || "Contract unavailable on this network"}</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e5da] pb-6 dark:border-white/10">
            <div>
              <button onClick={() => navigate(-1)} className="mb-3 text-xs font-medium text-[#8b887e] transition hover:text-[#a17a13]">← Back</button>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a17a13]">Happy Bounty / Control center</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Admin dashboard</h1>
              <p className="mt-2 text-sm text-[#77756d] dark:text-white/50">Manage contract fees and ownership from one place.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#e9e5da] bg-white px-3 py-2 text-xs font-medium dark:border-white/10 dark:bg-[#141614]"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />Arc Mainnet</span>
              <button onClick={() => navigate("/create")} className="rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:brightness-95" style={{ backgroundColor: GOLD, color: "#171714" }}>＋ Create bounty</button>
            </div>
          </header>

          {!isArcMainnet && (
            <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              <p className="font-semibold">Switch to Arc Mainnet</p>
              <p className="mt-1 opacity-80">Admin contract actions are disabled on other networks. Connect to Arc Mainnet (chain ID {ARC_MAINNET_ID}) to continue.</p>
            </div>
          )}

          {!connectedWallet && (
            <div className="mb-6 rounded-2xl border border-[#e9e5da] bg-white p-4 text-sm dark:border-white/10 dark:bg-[#141614]">
              Connect your wallet to check owner permissions and use admin controls.
            </div>
          )}

          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon="▤" label="Total bounties" value={bountyCountLoading ? "…" : formatNumber(bountyCountRaw)} note="Read from the Arc Mainnet contract" />
            <StatCard icon="$" label="Total fees collected" value={feesLoading ? "…" : totalUsdcFees === "—" ? "—" : `${totalUsdcFees} USDC`} note="Native USDC-denominated contract balance" />
            <StatCard icon="％" label="Platform fee" value={feePercentLoading ? "…" : `${feePercent}%`} note="Configured on the bounty contract" />
            <StatCard icon="◎" label="Contract owner" value={ownerLoading ? "…" : shortAddress(ownerAddress)} note={connectedWallet ? `Connected wallet: ${shortAddress(connectedWallet)}` : "Wallet not connected"} />
          </section>

          <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-2xl border border-[#e9e5da] bg-white p-5 shadow-[0_2px_10px_rgba(24,24,20,0.025)] dark:border-white/10 dark:bg-[#141614] sm:p-6">
              <SectionHeading eyebrow="Treasury" title="Withdraw USDC fees" />
              <p className="mb-5 max-w-xl text-sm leading-6 text-[#77756d] dark:text-white/50">Send collected native USDC to a wallet address. This action requires the contract owner wallet and a transaction confirmation.</p>
              <label htmlFor="withdraw-address" className="mb-2 block text-xs font-semibold text-[#555249] dark:text-white/70">Recipient wallet address</label>
              <input id="withdraw-address" value={withdrawAddress} onChange={(event) => { setWithdrawAddress(event.target.value); setFormError(""); }} placeholder="0x…" autoComplete="off" className="w-full rounded-xl border border-[#e3dfd3] bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa69a] focus:border-[#D4A017] dark:border-white/10 dark:bg-[#0d0f0d] dark:text-white dark:placeholder:text-white/25" />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button onClick={handleWithdraw} disabled={!isArcMainnet || !isOwner || txLoading || !withdrawAddress} className="rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: GOLD, color: "#171714" }}>{txLoading ? "Transaction pending…" : "Withdraw USDC"}</button>
                <span className="text-xs text-[#8b887e] dark:text-white/45">USDC only · Arc Mainnet</span>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e9e5da] bg-white p-5 shadow-[0_2px_10px_rgba(24,24,20,0.025)] dark:border-white/10 dark:bg-[#141614] sm:p-6">
              <SectionHeading eyebrow="Security" title="Ownership" />
              <div className="rounded-xl bg-[#f7f6f0] p-4 dark:bg-[#0d0f0d]">
                <p className="text-xs text-[#8b887e] dark:text-white/45">Current contract owner</p>
                <p className="mt-2 break-all font-mono text-sm">{ownerAddress || (ownerLoading ? "Loading owner…" : "Unavailable")}</p>
              </div>
              <label htmlFor="new-owner-address" className="mb-2 mt-5 block text-xs font-semibold text-[#555249] dark:text-white/70">New owner address</label>
              <input id="new-owner-address" value={newOwnerAddress} onChange={(event) => { setNewOwnerAddress(event.target.value); setFormError(""); }} placeholder="0x…" autoComplete="off" className="w-full rounded-xl border border-[#e3dfd3] bg-[#fcfbf7] px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa69a] focus:border-[#D4A017] dark:border-white/10 dark:bg-[#0d0f0d] dark:text-white dark:placeholder:text-white/25" />
              <button onClick={handleTransferOwnership} disabled={!isArcMainnet || !isOwner || txLoading || !newOwnerAddress} className="mt-3 w-full rounded-xl border border-[#d4a017]/50 px-4 py-3 text-sm font-semibold text-[#87620a] transition hover:bg-[#d4a017]/10 disabled:cursor-not-allowed disabled:opacity-40 dark:text-[#e3b52e]">{txLoading ? "Transaction pending…" : "Transfer ownership"}</button>
              <p className="mt-3 text-xs leading-5 text-[#8b887e] dark:text-white/45">Warning: ownership transfer is a sensitive on-chain action. Verify the address before confirming.</p>
            </article>
          </section>

          {(formError || withdrawError || transferError) && (
            <div role="alert" className="mb-5 rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">{formError || withdrawError?.shortMessage || transferError?.shortMessage || "Transaction failed. Please check your wallet and try again."}</div>
          )}
          {(withdrawSuccess || transferSuccess) && (
            <div role="status" className="mb-5 rounded-xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">{withdrawSuccess ? "USDC withdrawal confirmed on-chain." : "Ownership transfer confirmed on-chain."}</div>
          )}

          <section className="rounded-2xl border border-[#e9e5da] bg-white p-5 dark:border-white/10 dark:bg-[#141614] sm:p-6">
            <SectionHeading eyebrow="Network status" title="Contract connection" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div><p className="text-xs text-[#8b887e] dark:text-white/45">Network</p><p className="mt-1 text-sm font-semibold">{isArcMainnet ? "Arc Mainnet" : `Unsupported network · ${chainId ?? "not connected"}`}</p></div>
              <div><p className="text-xs text-[#8b887e] dark:text-white/45">Contract</p><p className="mt-1 break-all font-mono text-xs">{contractAddress || "No contract configured for this network"}</p></div>
              <div><p className="text-xs text-[#8b887e] dark:text-white/45">Owner permissions</p><p className="mt-1 text-sm font-semibold">{!connectedWallet ? "Connect wallet" : isOwner ? "Owner access verified" : ownerAddress ? "Owner wallet required" : "Checking permissions…"}</p></div>
            </div>
          </section>

          {txLoading && (
            <div className="app-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
              <div className="app-modal-panel w-full max-w-sm rounded-2xl border border-[#ddd8ca] bg-[#f9f8f3] p-6 dark:border-white/10 dark:bg-[#111311]">
                <div className="mb-5 flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div></div>
                <Skeleton className="h-2 w-full rounded-full" />
                <p className="mt-4 text-sm font-medium text-[#625e55] dark:text-white/60">Transaction pending. Confirm it in your wallet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}