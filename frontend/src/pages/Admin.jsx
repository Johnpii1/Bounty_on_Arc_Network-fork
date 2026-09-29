import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import {
  getOwnerConfig,
  getTotalFeesConfig,
  getFeePercentConfig,
  prepareWithdrawTx,
  prepareTransferOwnershipTx,
} from "../services/bountyService"; // adjust path
import { useChainId } from "wagmi"; // or get from useAccount

export default function AdminPage() {
  const navigate = useNavigate();
  const { address: connectedWallet } = useAccount();
  const chainId = useChainId();

  // State
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [txHash, setTxHash] = useState(null);

  // Read: Owner
  const { data: ownerAddress, refetch: refetchOwner } = useReadContract({
    ...getOwnerConfig({ chainId }),
    query: { enabled: !!chainId },
  });

  // Read: Total ETH fees
  const { data: totalEthFeesRaw } = useReadContract({
    ...getTotalFeesConfig({ chainId }),
    query: { enabled: !!chainId },
  });
  console.log("Total ETH Fees (raw):", totalEthFeesRaw);

  // Read: Total USDC fees
  // const { data: totalUsdcFeesRaw } = useReadContract({
  //   ...getTotalUsdcFeesConfig({ chainId }),
  //   query: { enabled: !!chainId },
  // });
  // console.log("Total USDC Fees (raw):", totalUsdcFeesRaw);

  // Read: Fee percent
  const { data: feePercentRaw } = useReadContract({
    ...getFeePercentConfig({ chainId }),
    query: { enabled: !!chainId },
  });

  // Check if connected wallet is owner
  const isOwner =
    connectedWallet &&
    ownerAddress &&
    connectedWallet.toLowerCase() === ownerAddress.toLowerCase();

  // Write: Withdraw
  const {
    writeContract: writeWithdraw,
    data: withdrawTxHash,
    isPending: isWithdrawPending,
  } = useWriteContract();
  const { isLoading: isWithdrawConfirming } = useWaitForTransactionReceipt({
    hash: withdrawTxHash,
  });

  // Write: Transfer ownership
  const {
    writeContract: writeTransfer,
    data: transferTxHash,
    isPending: isTransferPending,
  } = useWriteContract();
  const { isLoading: isTransferConfirming } = useWaitForTransactionReceipt({
    hash: transferTxHash,
  });

  // Combined loading state
  const txLoading =
    isWithdrawPending ||
    isWithdrawConfirming ||
    isTransferPending ||
    isTransferConfirming;

  // Handle withdraw
  const handleWithdraw = async (tokenType) => {
    if (!withdrawAddress) return;
    const config = prepareWithdrawTx({
      tokenType, // 0 = ETH, 1 = USDC
      recipient: withdrawAddress,
      account: connectedWallet,
      chainId,
    });
    writeWithdraw(config);
  };

  // Handle transfer ownership
  const handleTransferOwnership = async (newOwnerAddress) => {
    if (!newOwnerAddress) return;
    const config = prepareTransferOwnershipTx({
      newOwner: newOwnerAddress,
      account: connectedWallet,
      chainId,
    });
    writeTransfer(config);
  };

  // Clear tx hash and refetch data after success
  useEffect(() => {
    if (withdrawTxHash || transferTxHash) {
      // Optionally refetch fees and owner after transaction confirms
      refetchOwner();
    }
  }, [withdrawTxHash, transferTxHash]);

  // Format fee values
  const totalEthFees = totalEthFeesRaw ? formatEther(totalEthFeesRaw) : "0";
  // const totalUsdcFees = totalUsdcFeesRaw ? formatEther(totalUsdcFeesRaw) : "0"; // USDC has 6 decimals
  const feePercent = feePercentRaw ? feePercentRaw.toString() : "0";

  // Access denied if not owner and we have both addresses
  if (connectedWallet && ownerAddress && !isOwner) {
    return (
      <div className="theme-page flex h-screen items-center justify-center bg-[#f7f6f0] text-[#171714] dark:bg-[#080908] dark:text-white transition-colors duration-300">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-2 text-gray-400">
            Only the contract owner can access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-pink-500 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen bg-[#f7f6f0] p-6 text-[#171714] dark:bg-[#080908] dark:text-white transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-pink-500/30 rounded hover:bg-pink-500/10 transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-pink-500">Admin Panel</h1>
        <div className="w-20" />
      </div>

      {/* Contract Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-[#171a17] border border-pink-500/20 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Contract Owner</h3>
          <p className="text-pink-400 font-mono text-sm break-all">
            {ownerAddress || "Loading..."}
          </p>
          {connectedWallet && (
            <p className="text-xs text-gray-500 mt-1">
              You: {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
            </p>
          )}
        </div>
        <div className="bg-white dark:bg-[#171a17] border border-pink-500/20 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Fee Percentage</h3>
          <p className="text-2xl font-bold text-pink-500">{feePercent}%</p>
        </div>
        <div className="bg-white dark:bg-[#171a17] border border-pink-500/20 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total ETH Fees</h3>
          <p className="text-2xl font-bold text-pink-500">{totalEthFees} ETH</p>
        </div>
        <div className="bg-white dark:bg-[#171a17] border border-pink-500/20 p-4 rounded-xl">
          <h3 className="text-gray-400 text-sm">Total USDC Fees</h3>
          <p className="text-2xl font-bold text-pink-500">
            {totalUsdcFees} USDC
          </p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white dark:bg-[#171a17] border border-pink-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-pink-400 mb-4">
          Withdraw Fees
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              className="w-full bg-white dark:bg-[#171a17] border border-pink-500/20 rounded px-3 py-2 text-[#171714] dark:text-white focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleWithdraw(0)}
              disabled={txLoading || !withdrawAddress}
              className="px-5 py-2 bg-pink-600 hover:bg-pink-700 rounded disabled:opacity-50 transition"
            >
              Withdraw ETH
            </button>
            <button
              onClick={() => handleWithdraw(1)}
              disabled={txLoading || !withdrawAddress}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50 transition"
            >
              Withdraw USDC
            </button>
          </div>
        </div>
      </div>

      {/* Ownership Transfer Section */}
      <div className="bg-white dark:bg-[#171a17] border border-pink-500/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-pink-400 mb-4">
          Transfer Ownership
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">
              New Owner Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              id="newOwnerInput"
              className="w-full bg-white dark:bg-[#171a17] border border-pink-500/20 rounded px-3 py-2 text-[#171714] dark:text-white focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            onClick={() => {
              const newOwner = document.getElementById("newOwnerInput").value;
              handleTransferOwnership(newOwner);
            }}
            disabled={txLoading}
            className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 rounded disabled:opacity-50 transition"
          >
            Transfer Ownership
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          ⚠️ This action is irreversible. Make sure the new address is correct.
        </p>
      </div>

      {/* Loading overlay */}
      {txLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#171a17] border border-pink-500 p-6 rounded-xl">
            <p className="text-pink-400">Transaction pending...</p>
          </div>
        </div>
      )}
    </div>
  );
}
