import { useState, useEffect, useMemo } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/UI/Toast";
import axios from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiDollarSign,
  FiGlobe,
  FiInfo,
  FiLink,
  FiShield,
  FiTag,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  BOUNTY_CATEGORIES,
  TAGS_BY_CATEGORY,
  DEFAULT_TAGS,
} from "../constants/categories";
import NavBar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";
import { supportedChains } from "../rainbowChains";
import { useBounty } from "../hooks/useBounty";
import { listTokensForChain } from "../utils/enums";
import { formatAmount } from "../utils/format";
import { CONTRACT_ADDRESSES } from "../utils/chains.address";

function Create() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [currentStep, setCurrentStep] = useState(1);
  const [customTag, setCustomTag] = useState("");
  const totalSteps = 4;

  const [bountyData, setBountyData] = useState({
    title: "",
    description: "",
    category: "",
    network: "",
    tags: [], // string for input (will convert later)
    startDate: "",
    deadline: "",
    originLink: "",
    reward: 0,
    token: "USDC", // pick your default
    // payout logic (needed for contract/backend)
    winnersAllowed: 1,
    payoutType: "",
    percentages: [],
    // UI-specific logic
    rewardType: "self-fund",
    creator: "", // will be filled from wallet
  });

  // Multi-winner state
  const [multipleWinner, setMultipleWinner] = useState(false);
  const [selectedPayoutType, setSelectedPayoutType] = useState("MULTI_EQUAL"); // default to equal split
  const [winnerCount, setWinnerCount] = useState(2);
  const [percentageArray, setPercentageArray] = useState([]);

  // Modal states
  const [showEqualModal, setShowEqualModal] = useState(false);
  const [showPercentModal, setShowPercentModal] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);

  const { switchChain } = useSwitchChain();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const {
    createBounty,
    fetchBountyIdFromTx,
    isPending: isContractPending,
    isConfirming,
  } = useBounty();
  // Inside Create(), near your other state

  // Accepts only http(s) URLs with a valid-looking domain
  const isValidUrl = (value) => {
    if (!value) return "";

    let url;
    try {
      url = new URL(value);
    } catch {
      return "Enter a full URL, e.g. https://github.com/user/repo";
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Only http:// and https:// links are allowed";
    }

    const hostname = url.hostname;
    if (
      !/^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.[A-Za-z]{2,}$/.test(
        hostname,
      )
    ) {
      return "Enter a valid domain, e.g. github.com or figma.com";
    }

    return "";
  };

  const originLinkError = isValidUrl(bountyData.originLink);

  const availableTokens = useMemo(() => {
    if (!currentChainId) return [];
    return listTokensForChain(currentChainId);
  }, [currentChainId]);

  // Helper to update bounty data
  const updateBountyData = (field, value) => {
    setBountyData((prev) => ({ ...prev, [field]: value }));
  };

  // Set creator when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      updateBountyData("creator", address);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (availableTokens.length === 0) return;

    const stillValid = availableTokens.some(
      (t) =>
        t.key.toUpperCase() === (bountyData.token || "").toUpperCase() ||
        t.label.toUpperCase() === (bountyData.token || "").toUpperCase(),
    );

    if (!stillValid) {
      updateBountyData("token", availableTokens[0].key);
    }
  }, [availableTokens, bountyData.token]);

  // Network selection handler (also updates form)
  const handleChainChange = (e) => {
    const chainId = Number(e.target.value);
    updateBountyData("network", chainId);
    switchChain({ chainId });
  };

  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!bountyData.network) {
          showToast.error("Please select a network");
          return false;
        }
        if (!bountyData.category) {
          showToast.error("Please select a category");
          return false;
        }
        break;
      case 2:
        if (!bountyData.title || bountyData.title.length < 5) {
          showToast.error("Title must be at least 5 characters");
          return false;
        }
        if (!bountyData.description || bountyData.description.length < 20) {
          showToast.error("Description must be at least 20 characters");
          return false;
        }
        if (!bountyData.tags || bountyData.tags.length === 0) {
          showToast.error("Please select at least one tag");
          return false;
        }
        if (!bountyData.startDate || !bountyData.deadline) {
          showToast.error("Please select start and end dates");
          return false;
        }
        const urlErr = isValidUrl(bountyData.originLink);
        if (urlErr) {
          showToast.error(urlErr);
          return false;
        }
        break;
      case 3:
        if (bountyData.reward <= 0) {
          showToast.error("Please enter a valid reward amount");
          return false;
        }
        break;
    }
    return true;
  };

  const handleEqualSplitConfirm = () => {
    const count = winnerCount;
    if (count < 2 || count > 5) {
      showToast.error("Number of winners must be between 2 and 5");
      return;
    }
    setWinnerCount(count);
    setSelectedPayoutType("MULTI_EQUAL");
    setPercentageArray([]);
    setShowEqualModal(false);
    showToast.success(`${count} winners selected for equal split`);
  };

  const handlePercentSplitConfirm = () => {
    if (percentageArray.length === 0) {
      showToast.error("Please select a preset or enter percentages");
      return;
    }
    const total = percentageArray.reduce((sum, p) => sum + p, 0);
    if (total !== 100) {
      showToast.error("Percentages must sum to 100");
      return;
    }
    setSelectedPayoutType("MULTI_PERCENTAGE");
    setWinnerCount(percentageArray.length);
    setShowPercentModal(false);
    showToast.success(
      `${percentageArray.length} winners selected with percentage split`,
    );
  };

  const handlePresetSelect = (preset) => {
    setPercentageArray(preset);
  };

  // Calculate fees (7%)
  const fee = bountyData.reward * 0.07;
  const totalAmount = bountyData.reward + fee;

  // Formatted display strings (commas, no trailing .00)
  const feeDisplay = formatAmount(fee);
  const totalAmountDisplay = formatAmount(totalAmount);
  const rewardDisplay = formatAmount(bountyData.reward);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // toogle tags
  const toggleTag = (tag) => {
    setBountyData((prev) => {
      const alreadySelected = prev.tags.includes(tag);
      if (alreadySelected) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      }
      if (prev.tags.length >= 5) {
        showToast.error("Max 5 tags");
        return prev;
      }
      return { ...prev, tags: [...prev.tags, tag] };
    });
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed) return;
    if (bountyData.tags.includes(trimmed)) {
      showToast.error("Tag already added");
      return;
    }
    if (bountyData.tags.length >= 5) {
      showToast.error("Max 5 tags");
      return;
    }
    setBountyData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setCustomTag("");
  };

  const removeTag = (tag) => {
    setBountyData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // --- Contract submission logic ---
  const handleFinalSubmit = async () => {
    // 1. Validate final step
    if (!validateStep(3)) return;

    // if (bountyData.originLink && !isValidUrl(bountyData.originLink)) {
    const urlErr = isValidUrl(bountyData.originLink);
    if (urlErr) {
      showToast.error(urlErr);
      setCurrentStep(2); // send them to the right step
      return;
    }

    // 2. Check wallet connection
    if (!isConnected || !address) {
      showToast.error("Please connect your wallet");
      return;
    }

    // 3. Network verification
    // Currently there is no sync with the backend on this. if any chain is to be supporte in the future, create a shared file
    const selectedChainId = bountyData.network;
    console.log("Selected chain ID:", selectedChainId);

    if (!selectedChainId) {
      showToast.error("Please select a network");
      return;
    }

    // 4. Check if contract is deployed on the selected network
    const contractAddress = CONTRACT_ADDRESSES[selectedChainId]?.bounty;
    if (!contractAddress || contractAddress === "Loading...") {
      showToast.error(
        `Contract not deployed on ${supportedChains.find((c) => c.id === selectedChainId)?.name}.`,
      );
      return;
    }

    // 5. If user is on a different chain, prompt to switch
    if (currentChainId !== selectedChainId) {
      showToast.loading(
        `Switching to ${supportedChains.find((c) => c.id === selectedChainId)?.name}...`,
      );
      try {
        //await remove
        switchChain({ chainId: selectedChainId });
        showToast.success("Network switched!");
      } catch (err) {
        showToast.error("Failed to switch network. Please switch manually.");
        return;
      }
    }

    console.log("chain is correct");

    // 6. Prepare bounty data for contract (transform form data)
    const finalWinnersAllowed = multipleWinner ? winnerCount : 1;
    const finalPayoutType = multipleWinner ? selectedPayoutType : "SINGLE";
    console.log(
      `Final payout type: ${finalPayoutType}, winners allowed: ${finalWinnersAllowed}`,
    );
    const finalPercentages =
      multipleWinner && selectedPayoutType === "MULTI_PERCENTAGE"
        ? percentageArray
        : [];

    // Create a copy for backend (convert tags string to array if needed)
    const backendData = {
      ...bountyData,
      tags: bountyData.tags, // ? [bountyData.tags] : [],
      winnersAllowed: finalWinnersAllowed,
      payoutType: finalPayoutType,
      percentages: finalPercentages,
      status: "upcoming", // will be calculated by backend
    };

    // 7. Call smart contract
    try {
      const { eventData, hash } = await createBounty({
        reward: bountyData.reward, // send total (reward + fee) to contract
        token: bountyData.token,
        winnersAllowed: finalWinnersAllowed,
        payoutType: finalPayoutType,
        percentages: finalPercentages,
      });

      let blockchainId =
        eventData?.bountyId != null ? Number(eventData.bountyId) : null;

      console.log(
        `Token type ${bountyData.token} reward ${bountyData.reward} total amount ${totalAmount} in wei`,
      );

      console.log("Full eventData:", eventData);
      // This blockchainId is currently causeing error on various networks...
      if (blockchainId === null || blockchainId === undefined) {
        // Fallback chain — handles Injective's sparse logs and Creditcoin's
        // log-less receipts via explorer API + bountyCounter() contract read.
        blockchainId = await fetchBountyIdFromTx(hash);
      }

      if (!blockchainId) {
        showToast.error(
          "Bounty was created on-chain but we couldn't read its ID. " +
            "Please check the explorer and contact support.",
        );
        return;
      }
      if (!hash || !/^0x[a-fA-F0-9]{64}$/.test(hash)) {
        showToast.error("Invalid transaction hash — cannot link bounty");
        return;
      }
      // 8. Save to backend with blockchain info
      console.log("posting to db");
      const saveResponse = await axios.post(`${API_URL}/bounty/create`, {
        ...backendData,
        blockchainId,
        txHash: hash,
        isOnChain: true,
        // creator: address,
      });
      console.log("posting sucess");
      if (saveResponse.status === 201) {
        showToast.success("Bounty created on-chain and saved!");
        navigate("/dashboard");
      } else {
        throw new Error("Backend save failed");
      }
    } catch (err) {
      console.error(err);
      showToast.error(err.message || "Creation failed");
    }
  };

  // Determine button loading state
  const isProcessing = isContractPending || isConfirming;

  const inputClass =
    "w-full bg-white border border-[#ddd9ce] rounded-xl px-4 py-3 text-[#171714] placeholder:text-[#99958a] outline-none transition focus:border-[#c49b2c] focus:ring-2 focus:ring-[#d4af37]/10";

  const selectClass =
    "w-full bg-white border border-[#ddd9ce] rounded-xl px-4 py-3 text-[#171714] outline-none transition focus:border-[#c49b2c] focus:ring-2 focus:ring-[#d4af37]/10";

  const cardClass =
    "relative overflow-hidden rounded-3xl border border-[#dedbd1] bg-white shadow-[0_18px_60px_rgba(34,31,24,0.07)]";

  return (
    <div
      className="min-h-screen flex flex-col text-[#171714]"
      style={{
        backgroundColor: "#f7f6f0",
        backgroundImage: `
          linear-gradient(rgba(112,105,88,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(112,105,88,0.035) 1px, transparent 1px),
          linear-gradient(90deg, transparent 49%, rgba(112,105,88,0.025) 50%, transparent 51%)
        `,
        backgroundSize: "56px 28px, 56px 28px, 56px 28px",
      }}
    >
      <NavBar />

      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#171714] text-[#d4af37]">
                <FiZap size={17} />
              </div>

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b8679]">
                Bounty Studio
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#171714]">
                  Create New Bounty
                </h1>

                <p className="text-[#777267] mt-2 text-sm md:text-base">
                  Define the work, set the reward, and launch your on-chain
                  bounty.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#dedbd1] bg-white/80 text-xs text-[#716c61]">
                <FiShield className="text-[#b28b20]" />
                Self-funded & on-chain
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative">
              <div className="absolute top-[19px] left-6 right-6 h-px bg-[#ddd9ce]" />

              <div
                className="absolute top-[19px] left-6 h-px bg-[#c49b2c] transition-all duration-500"
                style={{
                  width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - ${
                    ((currentStep - 1) / (totalSteps - 1)) * 48
                  }px)`,
                }}
              />

              <div className="relative flex justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border transition-all duration-300 ${
                        step < currentStep
                          ? "bg-[#171714] border-[#171714] text-[#d4af37]"
                          : step === currentStep
                            ? "bg-[#d4af37] border-[#d4af37] text-[#171714] shadow-[0_5px_20px_rgba(212,175,55,0.25)]"
                            : "bg-[#f7f6f0] border-[#d8d4c8] text-[#989286]"
                      }`}
                    >
                      {step < currentStep ? <FiCheck size={17} /> : step}
                    </div>

                    <div className="mt-2.5 text-center">
                      <p
                        className={`text-[10px] uppercase tracking-[0.16em] ${
                          step <= currentStep
                            ? "text-[#766f61]"
                            : "text-[#aaa59a]"
                        }`}
                      >
                        Step {step}
                      </p>

                      <p
                        className={`text-xs mt-0.5 font-semibold ${
                          step <= currentStep
                            ? "text-[#171714]"
                            : "text-[#9d988e]"
                        }`}
                      >
                        {step === 1 && "Network"}
                        {step === 2 && "Details"}
                        {step === 3 && "Reward"}
                        {step === 4 && "Review"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-[#f5f1e4] border border-[#e5ddc8] flex items-center justify-center text-[#b28b20]">
                      <FiGlobe size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Choose Network</h2>
                      <p className="text-sm text-[#817b70] mt-1">
                        Select where your bounty will be created.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                        Blockchain Network
                      </label>

                      <select
                        onChange={handleChainChange}
                        value={bountyData.network}
                        className={selectClass}
                      >
                        <option value="">Select Network</option>

                        {supportedChains.map((chain) => (
                          <option key={chain.id} value={chain.id}>
                            {chain.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                        Category
                      </label>
                      <select
                        value={bountyData.category}
                        onChange={(e) => {
                          updateBountyData("category", e.target.value);
                          updateBountyData("tags", []);
                          setCustomTag("");
                        }}
                        className={selectClass}
                      >
                        <option value="">Select Category</option>
                        {BOUNTY_CATEGORIES.map(({ group, values }) => (
                          <optgroup key={group} label={group}>
                            {values.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-7 rounded-2xl bg-[#f7f5ed] border border-[#e7e1d2] p-4 flex items-start gap-3">
                    <FiShield className="text-[#b28b20] mt-0.5 shrink-0" />

                    <p className="text-xs leading-relaxed text-[#777267]">
                      Your selected network determines where the bounty contract
                      transaction will be executed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-[#f5f1e4] border border-[#e5ddc8] flex items-center justify-center text-[#b28b20]">
                      <FiTag size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Task Details</h2>
                      <p className="text-sm text-[#817b70] mt-1">
                        Give contributors everything they need to understand the
                        work.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                        Title <span className="text-[#b28b20]">*</span>
                      </label>

                      <input
                        value={bountyData.title}
                        onChange={(e) =>
                          updateBountyData("title", e.target.value)
                        }
                        className={inputClass}
                        placeholder="e.g., Build a DeFi dashboard"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                        Description <span className="text-[#b28b20]">*</span>
                      </label>

                      <textarea
                        value={bountyData.description}
                        onChange={(e) =>
                          updateBountyData("description", e.target.value)
                        }
                        className={`${inputClass} h-40 resize-none`}
                        placeholder="Describe the task, requirements, deliverables, and expectations..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60]">
                          Tags <span className="text-[#b28b20]">*</span>
                        </label>
                        <span className="text-xs text-[#8b8579]">
                          {bountyData.tags.length} / 5 selected
                        </span>
                      </div>

                      {!bountyData.category ? (
                        <p className="text-xs text-[#8b8579] italic">
                          Select a category first to see related tags.
                        </p>
                      ) : (
                        <>
                          <div className="flex flex-wrap gap-2">
                            {(
                              TAGS_BY_CATEGORY[bountyData.category] ||
                              DEFAULT_TAGS
                            ).map((tag) => {
                              const selected = bountyData.tags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => toggleTag(tag)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                    selected
                                      ? "bg-[#f4ecd5] border-[#d4af37] text-[#8f6c12]"
                                      : "bg-white border-[#ddd8ca] text-[#625e55] hover:border-[#c49b2c] hover:text-[#8f6c12]"
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>

                          {bountyData.category === "Other" && (
                            <div className="mt-4">
                              <label className="block text-xs text-[#6f6a60] mb-1.5">
                                Add your own tags
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={customTag}
                                  onChange={(e) => setCustomTag(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addCustomTag();
                                    }
                                  }}
                                  maxLength={24}
                                  placeholder="e.g., memes, dao-tools, onboarding"
                                  className="flex-1 bg-white border border-[#ddd8ca] rounded-xl px-4 py-2 text-[#171714] text-sm placeholder:text-[#99958a] focus:outline-none focus:border-[#c49b2c] focus:ring-2 focus:ring-[#d4af37]/10 transition"
                                />
                                <button
                                  type="button"
                                  onClick={addCustomTag}
                                  disabled={
                                    !customTag.trim() ||
                                    bountyData.tags.length >= 5
                                  }
                                  className="px-4 py-2 rounded-xl bg-[#171714] border border-[#171714] text-[#d4af37] text-sm font-semibold hover:bg-[#292922] transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  Add
                                </button>
                              </div>
                              <p className="mt-1 text-[10px] text-[#99958a]">
                                Press Enter or click Add. Max 5 tags total.
                              </p>
                            </div>
                          )}

                          {bountyData.tags.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs text-[#6f6a60] mb-2">
                                Selected:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {bountyData.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f4ecd5] border border-[#e5d9b8] text-[#8f6c12]"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      aria-label={`Remove ${tag}`}
                                      className="text-[#8f6c12] hover:text-[#171714] transition"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {bountyData.tags.length === 0 && (
                            <p className="mt-2 text-xs text-[#8b8579]">
                              Pick at least one tag.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                          Start Date <span className="text-[#b28b20]">*</span>
                        </label>
                        <input
                          type="date"
                          value={bountyData.startDate}
                          onChange={(e) =>
                            updateBountyData("startDate", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                          End Date <span className="text-[#b28b20]">*</span>
                        </label>
                        <input
                          type="date"
                          value={bountyData.deadline}
                          onChange={(e) =>
                            updateBountyData("deadline", e.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">
                        Origin Link
                      </label>
                      <input
                        value={bountyData.originLink}
                        onChange={(e) =>
                          updateBountyData("originLink", e.target.value)
                        }
                        className={`${inputClass} ${
                          originLinkError
                            ? "!border-red-500/60 focus:!border-red-500 focus:!ring-1 focus:!ring-red-500/50"
                            : ""
                        }`}
                        placeholder="https://github.com/... or https://figma.com/..."
                      />
                      {originLinkError && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {originLinkError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-[#f5f1e4] border border-[#e5ddc8] flex items-center justify-center text-[#b28b20]">
                      <FiDollarSign size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Reward Information</h2>
                      <p className="text-sm text-[#817b70] mt-1">
                        Configure how contributors will receive the bounty.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Self Fund */}
                    <div className="rounded-2xl bg-[#f7f5ed] border border-[#e7e1d2] p-5">
                      <div className="flex items-start gap-3">
                        <FiShield className="text-[#b28b20] mt-0.5 shrink-0" />

                        <div>
                          <p className="text-sm font-semibold text-[#25231e]">
                            Self-fund
                          </p>

                          <p className="text-xs text-[#777267] mt-1.5 leading-relaxed">
                            You use your own money to create the task. You will
                            be responsible for providing the reward money to the
                            winner(s).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Multiple Winners */}
                    <div className="rounded-2xl border border-[#e1ddd2] bg-[#fcfbf7] p-5">
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#f3efe2] flex items-center justify-center text-[#b28b20]">
                            <FiUsers size={16} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm">
                              Multiple winners
                            </h3>

                            <p className="text-xs text-[#858075] mt-1">
                              Allow multiple participants to share the reward
                            </p>
                          </div>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={multipleWinner}
                            onChange={() => setMultipleWinner(!multipleWinner)}
                          />

                          <div className="w-12 h-6 rounded-full bg-[#d8d4ca] peer-checked:bg-[#d4af37] transition-all" />

                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-6 transition-all" />
                        </label>
                      </div>
                    </div>

                    {multipleWinner && (
                      <div className="rounded-2xl border border-[#e1ddd2] bg-[#fcfbf7] p-5">
                        <div className="flex flex-wrap gap-3 items-center">
                          <button
                            onClick={() => setShowEqualModal(true)}
                            className="px-4 py-2.5 rounded-xl bg-[#171714] text-white text-sm font-medium hover:bg-[#292922] transition"
                          >
                            Equal Split
                          </button>

                          <button
                            onClick={() => setShowPercentModal(true)}
                            className="px-4 py-2.5 rounded-xl border border-[#d8d3c6] bg-white text-[#292720] text-sm font-medium hover:border-[#c49b2c] transition"
                          >
                            % Split
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setShowInfoMenu(!showInfoMenu)}
                              className="w-10 h-10 rounded-xl border border-[#ddd8cb] bg-white flex items-center justify-center text-[#777267] hover:text-[#b28b20] hover:border-[#c49b2c] transition"
                            >
                              <FiInfo size={17} />
                            </button>

                            {showInfoMenu && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-[#171714] text-white rounded-2xl shadow-2xl p-4 z-50">
                                <p className="text-xs leading-relaxed">
                                  <span className="font-semibold text-[#d4af37]">
                                    Equal split:
                                  </span>{" "}
                                  Reward split equally among winners.
                                </p>

                                <p className="text-xs leading-relaxed mt-3">
                                  <span className="font-semibold text-[#d4af37]">
                                    % split:
                                  </span>{" "}
                                  Custom percentages for each winner.
                                </p>

                                <p className="text-xs font-semibold text-[#d4af37] mt-3">
                                  Supported configs
                                </p>

                                <p className="text-xs text-white/70 mt-1">
                                  [40,30,20,5,5], [40,30,20,10], [50,30,20],
                                  [50,50]
                                </p>
                              </div>
                            )}
                          </div>

                          {selectedPayoutType === "MULTI_EQUAL" &&
                            winnerCount > 1 && (
                              <span className="text-xs font-semibold text-[#8f6c12] bg-[#f4ecd5] border border-[#e5d9b8] px-3 py-1.5 rounded-full">
                                {winnerCount} winners · Equal split
                              </span>
                            )}

                          {selectedPayoutType === "MULTI_PERCENTAGE" &&
                            percentageArray.length > 0 && (
                              <span className="text-xs font-semibold text-[#8f6c12] bg-[#f4ecd5] border border-[#e5d9b8] px-3 py-1.5 rounded-full">
                                {percentageArray.length} winners ·{" "}
                                {percentageArray.join("% / ")}%
                              </span>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Reward Type */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-3">
                        Reward Type <span className="text-[#b28b20]">*</span>
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            updateBountyData("rewardType", "self-fund")
                          }
                          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                            bountyData.rewardType === "self-fund"
                              ? "bg-[#171714] text-[#d4af37] border border-[#171714]"
                              : "bg-white border border-[#d8d3c6] text-[#625e55] hover:border-[#c49b2c]"
                          }`}
                        >
                          Self-Fund
                        </button>

                        <button
                          disabled
                          className="px-5 py-2.5 rounded-xl bg-[#f2f0ea] border border-[#dedad0] text-[#aaa59b] text-sm cursor-not-allowed"
                        >
                          Seek Funding{" "}
                          <span className="text-[#b28b20] text-xs">soon</span>
                        </button>
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="border-t border-[#e7e3da] pt-6">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-sm">Set reward</h4>

                          <p className="text-xs text-[#858075] mt-1">
                            Amount distributed to the winner(s)
                          </p>
                        </div>

                        <div className="w-full md:w-64">
                          <div className="flex items-center justify-between border border-[#dcd8cd] rounded-xl bg-white h-12 px-4 focus-within:border-[#c49b2c]">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={rewardDisplay}
                              onChange={(e) => {
                                // Strip everything except digits and a single dot
                                const raw = e.target.value
                                  .replace(/,/g, "")
                                  .replace(/[^\d.]/g, "");
                                // Prevent multiple dots
                                const parts = raw.split(".");
                                const cleaned =
                                  parts.length > 2
                                    ? `${parts[0]}.${parts.slice(1).join("")}`
                                    : raw;
                                updateBountyData(
                                  "reward",
                                  parseFloat(cleaned) || 0,
                                );
                              }}
                              placeholder="0"
                              className="bg-transparent outline-none text-[#171714] text-sm w-full"
                            />

                            <p className="text-[#8b8579] text-sm font-semibold">
                              {bountyData.token}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fee */}
                    <div>
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-sm">
                            Service fees (7%)
                          </h4>

                          <a
                            href="#"
                            className="text-xs text-[#9a7619] hover:underline mt-1 inline-block"
                          >
                            Learn more
                          </a>
                        </div>

                        <div className="w-full md:w-64">
                          <div className="flex items-center justify-between border border-[#e0dcd2] rounded-xl bg-[#f5f3ed] h-12 px-4">
                            <input
                              type="text"
                              value={feeDisplay}
                              disabled
                              className="bg-transparent outline-none text-[#777267] text-sm w-full"
                            />

                            <p className="text-[#999286] text-sm font-semibold">
                              {bountyData.token}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="rounded-2xl border border-[#d9cfb4] bg-[#fbf7e9] p-5">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
                        <div>
                          <h4 className="font-bold text-sm">Total Amount</h4>

                          <p className="text-xs text-[#7c7567] mt-1">
                            Reward + service fees
                          </p>
                        </div>

                        <div className="flex items-center justify-between border border-[#d8c895] rounded-xl bg-white h-12 px-4 w-full md:w-64">
                          <input
                            type="text"
                            value={totalAmountDisplay}
                            disabled
                            className="bg-transparent outline-none text-[#171714] text-sm w-full font-bold"
                          />

                          <p className="text-[#9a7619] text-sm font-bold">
                            {bountyData.token}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Token */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                        Select Token
                      </label>
                      <select
                        value={bountyData.token}
                        onChange={(e) =>
                          updateBountyData("token", e.target.value)
                        }
                        className={`${selectClass} sm:w-64`}
                      >
                        {availableTokens.length === 0 ? (
                          <option value="" disabled>
                            No tokens available for this network
                          </option>
                        ) : (
                          availableTokens.map((t) => (
                            <option key={t.key} value={t.key}>
                              {t.label}
                              {t.kind === "native" ? " (Native)" : ""}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-11 h-11 rounded-2xl bg-[#f5f1e4] border border-[#e5ddc8] flex items-center justify-center text-[#b28b20]">
                      <FiCheck size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Review & Submit</h2>

                      <p className="text-sm text-[#817b70] mt-1">
                        Confirm your bounty details before submitting.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#e1ddd2] overflow-hidden">
                    {[
                      ["Category", bountyData.category || "Not selected"],
                      ["Title", bountyData.title || "Not entered"],
                      ["Tags", bountyData.tags || "Not selected"],
                      [
                        "Timeline",
                        `${formatDate(bountyData.startDate)} → ${formatDate(
                          bountyData.deadline,
                        )}`,
                      ],
                      ["Reward", `${rewardDisplay} ${bountyData.token}`],
                      ["Service Fee", `${feeDisplay} ${bountyData.token}`],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-4 ${
                          index !== 5 ? "border-b border-[#e7e3da]" : ""
                        }`}
                      >
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#898378]">
                          {label}
                        </span>

                        <span className="text-sm font-medium text-[#25231e] sm:text-right">
                          {value}
                        </span>
                      </div>
                    ))}

                    {/* Description */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-5 py-4 border-b border-[#e7e3da]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#898378]">
                        Description
                      </span>

                      <span className="text-sm text-[#4f4b43] sm:text-right max-w-full sm:max-w-[60%]">
                        {bountyData.description
                          ? bountyData.description.length > 100
                            ? bountyData.description.substring(0, 100) + "..."
                            : bountyData.description
                          : "Not entered"}
                      </span>
                    </div>

                    {/* Origin Link */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-5 py-4 border-b border-[#e7e3da]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#898378]">
                        Origin Link
                      </span>

                      <span className="text-sm truncate max-w-full sm:max-w-[60%] sm:text-right">
                        {bountyData.originLink ? (
                          <a
                            href={bountyData.originLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#9a7619] hover:underline"
                          >
                            {bountyData.originLink.length > 40
                              ? bountyData.originLink.substring(0, 40) + "..."
                              : bountyData.originLink}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-5 bg-[#fbf7e9] border-b border-[#e7dfc9]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#766e5d]">
                        Total Amount
                      </span>

                      <span className="text-lg font-bold text-[#8f6c12]">
                        {totalAmountDisplay} {bountyData.token}
                      </span>
                    </div>

                    {/* Multiple Winners */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-5 py-4 border-b border-[#e7e3da]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#898378]">
                        Winner Type
                      </span>

                      <span className="text-sm font-medium text-[#25231e] sm:text-right">
                        {multipleWinner
                          ? selectedPayoutType === "MULTI_EQUAL"
                            ? `Yes (${winnerCount} winners, equal split)`
                            : `Yes (${percentageArray.length} winners, ${percentageArray.join(
                                "% / ",
                              )}%)`
                          : "Single winner"}
                      </span>
                    </div>

                    {/* Reward Type */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-4 border-b border-[#e7e3da]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#898378]">
                        Reward Type
                      </span>

                      <span className="text-sm font-medium text-[#25231e] capitalize">
                        {bountyData.rewardType?.replace("-", " ")}
                      </span>
                    </div>

                    {/* Network */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#898378]">
                        Network
                      </span>

                      <span className="text-sm font-medium text-[#25231e]">
                        {supportedChains.find(
                          (c) => c.id === bountyData.network,
                        )?.name || "Not selected"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#f7f5ed] border border-[#e7e1d2] p-4">
                    <FiShield className="text-[#b28b20] mt-0.5 shrink-0" />

                    <p className="text-xs leading-relaxed text-[#777267]">
                      By creating this bounty you agree to our{" "}
                      <a
                        href="#"
                        className="text-[#9a7619] font-semibold hover:underline"
                      >
                        Terms and Conditions
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-7 gap-4">
              {currentStep === 1 ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#dcd8ce] text-[#4f4b43] text-sm font-semibold hover:border-[#bdb7a9] hover:bg-[#fbfaf6] transition"
                >
                  <FiX size={16} />
                  Cancel
                </Link>
              ) : (
                <button
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#dcd8ce] text-[#4f4b43] text-sm font-semibold hover:border-[#bdb7a9] hover:bg-[#fbfaf6] transition"
                >
                  <FiArrowLeft size={16} />
                  Back
                </button>
              )}

              {currentStep === totalSteps ? (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#171714] text-[#d4af37] text-sm font-bold border border-[#171714] hover:bg-[#292922] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Create Bounty
                      <FiCheck size={16} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] text-[#171714] text-sm font-bold hover:bg-[#c49b2c] transition shadow-[0_8px_24px_rgba(212,175,55,0.16)]"
                >
                  Continue
                  <FiArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Equal Split Modal */}
      {showEqualModal && (
        <div
          className="fixed inset-0 bg-[#171714]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowEqualModal(false)}
        >
          <div
            className="bg-[#f9f8f3] border border-[#ddd8ca] rounded-3xl w-full max-w-md p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#f1ead4] flex items-center justify-center text-[#a17a17] mb-3">
                  <FiUsers size={18} />
                </div>

                <h3 className="text-xl font-bold text-[#171714]">
                  Equal Split
                </h3>

                <p className="text-[#7c766b] text-sm mt-1">
                  Enter the number of winners (2-5)
                </p>
              </div>

              <button
                onClick={() => setShowEqualModal(false)}
                className="w-9 h-9 rounded-xl border border-[#ddd8ca] bg-white flex items-center justify-center text-[#777267] hover:text-[#171714]"
              >
                <FiX size={16} />
              </button>
            </div>

            <input
              type="number"
              min="2"
              max="5"
              value={winnerCount}
              onChange={(e) => setWinnerCount(parseInt(e.target.value) || 2)}
              className={inputClass}
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowEqualModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#d9d4c8] text-[#555047] font-semibold hover:bg-[#f4f2ec] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleEqualSplitConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-[#171714] text-[#d4af37] font-semibold hover:bg-[#292922] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Percentage Split Modal */}
      {showPercentModal && (
        <div
          className="fixed inset-0 bg-[#171714]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPercentModal(false)}
        >
          <div
            className="bg-[#f9f8f3] border border-[#ddd8ca] rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#f1ead4] flex items-center justify-center text-[#a17a17] mb-3">
                  <FiDollarSign size={18} />
                </div>

                <h3 className="text-xl font-bold text-[#171714]">
                  Percentage Split
                </h3>

                <p className="text-[#7c766b] text-sm mt-1">
                  Select a preset or enter custom percentages
                </p>
              </div>

              <button
                onClick={() => setShowPercentModal(false)}
                className="w-9 h-9 rounded-xl border border-[#ddd8ca] bg-white flex items-center justify-center text-[#777267] hover:text-[#171714]"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              <button
                onClick={() => handlePresetSelect([40, 30, 20, 5, 5])}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#ddd8ca] text-[#3e3b35] hover:border-[#c49b2c] transition"
              >
                <span className="font-semibold">[40, 30, 20, 5, 5]</span>{" "}
                <span className="text-[#888175]">— 5 winners</span>
              </button>

              <button
                onClick={() => handlePresetSelect([40, 30, 20, 10])}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#ddd8ca] text-[#3e3b35] hover:border-[#c49b2c] transition"
              >
                <span className="font-semibold">[40, 30, 20, 10]</span>{" "}
                <span className="text-[#888175]">— 4 winners</span>
              </button>

              <button
                onClick={() => handlePresetSelect([50, 30, 20])}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#ddd8ca] text-[#3e3b35] hover:border-[#c49b2c] transition"
              >
                <span className="font-semibold">[50, 30, 20]</span>{" "}
                <span className="text-[#888175]">— 3 winners</span>
              </button>

              <button
                onClick={() => handlePresetSelect([50, 50])}
                className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#ddd8ca] text-[#3e3b35] hover:border-[#c49b2c] transition"
              >
                <span className="font-semibold">[50, 50]</span>{" "}
                <span className="text-[#888175]">— 2 winners</span>
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] mb-2.5">
                Custom percentages
              </label>

              <input
                type="text"
                placeholder="e.g., 40,30,20,10"
                onChange={(e) => {
                  const values = e.target.value
                    .split(",")
                    .map((v) => parseInt(v.trim()));

                  if (values.every((v) => !isNaN(v))) {
                    setPercentageArray(values);
                  }
                }}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPercentModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#d9d4c8] text-[#555047] font-semibold hover:bg-[#f4f2ec] transition"
              >
                Cancel
              </button>

              <button
                onClick={handlePercentSplitConfirm}
                className="flex-1 px-4 py-3 rounded-xl bg-[#171714] text-[#d4af37] font-semibold hover:bg-[#292922] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Create;
