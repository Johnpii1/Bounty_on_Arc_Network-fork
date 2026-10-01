import { useState, useEffect, useMemo } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/UI/Toast";
import axios from "axios";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiDollarSign,
  FiGlobe,
  FiInfo,
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

  // ---------------------------------------------------
  // GLOBAL DARK MODE
  // ---------------------------------------------------

  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

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
  const [selectedPayoutType, setSelectedPayoutType] = useState("MULTI_EQUAL");
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

  // ---------------------------------------------------
  // URL VALIDATION
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // UPDATE DATA
  // ---------------------------------------------------

  const updateBountyData = (field, value) => {
    setBountyData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  // ---------------------------------------------------
  // NETWORK
  // ---------------------------------------------------

  const handleChainChange = (e) => {
    const chainId = Number(e.target.value);

    updateBountyData("network", chainId);
    switchChain({ chainId });
  };

  // ---------------------------------------------------
  // STEPS
  // ---------------------------------------------------

  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // ---------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------

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

  // ---------------------------------------------------
  // MULTI WINNER
  // ---------------------------------------------------

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

  const isSelectedPreset = (preset) =>
    percentageArray.length === preset.length &&
    percentageArray.every((percentage, index) => percentage === preset[index]);

  // ---------------------------------------------------
  // FEES
  // ---------------------------------------------------

  const fee = bountyData.reward * 0.07;
  const totalAmount = bountyData.reward + fee;

  const feeDisplay = formatAmount(fee);
  const totalAmountDisplay = formatAmount(totalAmount);
  const rewardDisplay = formatAmount(bountyData.reward);

  // ---------------------------------------------------
  // DATE
  // ---------------------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ---------------------------------------------------
  // TAGS
  // ---------------------------------------------------

  const toggleTag = (tag) => {
    setBountyData((prev) => {
      const alreadySelected = prev.tags.includes(tag);

      if (alreadySelected) {
        return {
          ...prev,
          tags: prev.tags.filter((t) => t !== tag),
        };
      }

      if (prev.tags.length >= 5) {
        showToast.error("Max 5 tags");
        return prev;
      }

      return {
        ...prev,
        tags: [...prev.tags, tag],
      };
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

    setBountyData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmed],
    }));

    setCustomTag("");
  };

  const removeTag = (tag) => {
    setBountyData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // ---------------------------------------------------
  // CONTRACT SUBMISSION
  // ---------------------------------------------------

  const handleFinalSubmit = async () => {
    if (!validateStep(3)) return;

    const urlErr = isValidUrl(bountyData.originLink);

    if (urlErr) {
      showToast.error(urlErr);
      setCurrentStep(2);
      return;
    }

    if (!isConnected || !address) {
      showToast.error("Please connect your wallet");
      return;
    }

    const selectedChainId = bountyData.network;

    console.log("Selected chain ID:", selectedChainId);

    if (!selectedChainId) {
      showToast.error("Please select a network");
      return;
    }

    const contractAddress = CONTRACT_ADDRESSES[selectedChainId]?.bounty;

    if (!contractAddress || contractAddress === "Loading...") {
      showToast.error(
        `Contract not deployed on ${
          supportedChains.find((c) => c.id === selectedChainId)?.name
        }.`,
      );

      return;
    }

    if (currentChainId !== selectedChainId) {
      showToast.loading(
        `Switching to ${
          supportedChains.find((c) => c.id === selectedChainId)?.name
        }...`,
      );

      try {
        switchChain({ chainId: selectedChainId });
        showToast.success("Network switched!");
      } catch (err) {
        showToast.error("Failed to switch network. Please switch manually.");

        return;
      }
    }

    console.log("chain is correct");

    const finalWinnersAllowed = multipleWinner ? winnerCount : 1;

    const finalPayoutType = multipleWinner ? selectedPayoutType : "SINGLE";

    console.log(
      `Final payout type: ${finalPayoutType}, winners allowed: ${finalWinnersAllowed}`,
    );

    const finalPercentages =
      multipleWinner && selectedPayoutType === "MULTI_PERCENTAGE"
        ? percentageArray
        : [];

    const backendData = {
      ...bountyData,
      tags: bountyData.tags,
      winnersAllowed: finalWinnersAllowed,
      payoutType: finalPayoutType,
      percentages: finalPercentages,
      status: "upcoming",
    };

    try {
      const { eventData, hash } = await createBounty({
        reward: bountyData.reward,
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

  const isProcessing = isContractPending || isConfirming;

  // ---------------------------------------------------
  // THEME CLASSES
  // ---------------------------------------------------

  const inputClass = `w-full rounded-xl  px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#d4af37]/10 ${
    dark
      ? "bg-[#111311] border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4AF37]"
      : "bg-white border border-[#ddd9ce] text-[#171714] placeholder:text-[#99958a] focus:border-[#c49b2c]"
  }`;

  const selectClass = `w-full rounded-xl px-4 py-3 cursor-pointer outline-none transition focus:ring-2 focus:ring-[#d4af37]/10 ${
    dark
      ? "bg-[#111311] border border-white/10 text-white focus:border-[#D4AF37]"
      : "bg-white border border-[#ddd9ce] text-[#171714] focus:border-[#c49b2c]"
  }`;

  const cardClass = `relative overflow-hidden rounded-3xl border shadow-[0_18px_60px_rgba(0,0,0,0.08)] ${
    dark
      ? "bg-[#111311] border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
      : "bg-white border-[#dedbd1]"
  }`;

  const labelClass = dark ? "text-white/65" : "text-[#6f6a60]";

  const mutedClass = dark ? "text-white/55" : "text-[#777267]";

  const softMutedClass = dark ? "text-white/45" : "text-[#858075]";

  const iconBoxClass = dark
    ? "bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]"
    : "bg-[#f5f1e4] border border-[#e5ddc8] text-[#b28b20]";

  const softPanelClass = dark
    ? "bg-[#111311] border-white/10"
    : "bg-[#f7f5ed] border-[#e7e1d2]";

  const secondaryPanelClass = dark
    ? "bg-[#151715] border-white/10"
    : "bg-[#fcfbf7] border-[#e1ddd2]";

  const darkButtonClass = dark
    ? "bg-[#151715] border-white/10"
    : "bg-[#171714] border-[#171714]";

  const secondaryButtonClass = dark
    ? "bg-[#111311] border-white/10 text-white/70"
    : "bg-white border-[#d8d3c6] text-[#625e55]";

  const selectedChoiceClass = dark
    ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_0_3px_rgba(212,175,55,0.12)]"
    : "bg-[#f4ecd5] border-[#c49b2c] text-[#8f6c12] shadow-[0_0_0_3px_rgba(196,155,44,0.12)]";

  const themeBorderClass = dark ? "border-white/10" : "border-[#e7e3da]";

  const goldTextClass = dark ? "text-[#D4AF37]" : "text-[#b28b20]";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        dark ? "bg-[#080908] text-white" : "bg-[#f7f6f0] text-[#171714]"
      }`}
      style={{
        backgroundImage: dark
          ? `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, transparent 49%, rgba(212,175,55,0.018) 50%, transparent 51%)
            `
          : `
              linear-gradient(rgba(112,105,88,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(112,105,88,0.035) 1px, transparent 1px),
              linear-gradient(90deg, transparent 49%, rgba(112,105,88,0.025) 50%, transparent 51%)
            `,
        backgroundSize: "56px 28px, 56px 28px, 56px 28px",
      }}
    >
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Link
              to="/dashboard"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                dark
                  ? "bg-[#111311] border-white/10 text-white/70 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] hover:bg-[#151715]"
                  : "bg-white border-[#dcd8ce] text-[#4f4b43] hover:border-[#b28b20] hover:text-[#8f6c12] hover:bg-[#fbfaf6]"
              }`}
            >
              <FiArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="w-full max-w-4xl mx-auto mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl text-[#d4af37] ${
                  dark
                    ? "bg-[#151715] border border-white/10"
                    : "bg-[#171714] border border-transparent"
                }`}
              >
                <FiZap size={17} />
              </div>

              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
                  dark ? "text-white/50" : "text-[#8b8679]"
                }`}
              >
                Bounty Studio
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1
                  className={`text-4xl md:text-5xl font-bold tracking-tight ${
                    dark ? "text-white" : "text-[#171714]"
                  }`}
                >
                  Create New Bounty
                </h1>

                <p
                  className={`mt-2 text-sm md:text-base ${
                    dark ? "text-white/60" : "text-[#777267]"
                  }`}
                >
                  Define the work, set the reward, and launch your on-chain
                  bounty.
                </p>
              </div>

              <div
                className={`hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs ${
                  dark
                    ? "border-white/10 bg-[#111311]/80 text-white/60"
                    : "border-[#dedbd1] bg-white/80 text-[#716c61]"
                }`}
              >
                <FiShield className={goldTextClass} />
                Self-funded & on-chain
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="w-full max-w-4xl mx-auto mb-10">
            <div className="relative">
              <div
                className={`absolute top-[19px] left-6 right-6 h-px ${
                  dark ? "bg-white/10" : "bg-[#ddd9ce]"
                }`}
              />

              <div
                className={`absolute top-[19px] left-6 h-px ${
                  dark ? "bg-[#D4AF37]" : "bg-[#c49b2c]"
                } transition-all duration-500`}
                style={{
                  width: `calc(${
                    ((currentStep - 1) / (totalSteps - 1)) * 100
                  }% - ${((currentStep - 1) / (totalSteps - 1)) * 48}px)`,
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
                          ? dark
                            ? "bg-[#151715] border-white/10 text-[#d4af37]"
                            : "bg-[#171714] border-[#171714] text-[#d4af37]"
                          : step === currentStep
                            ? "bg-[#d4af37] border-[#d4af37] text-[#171714] shadow-[0_5px_20px_rgba(212,175,55,0.25)]"
                            : dark
                              ? "bg-[#080908] border-white/10 text-white/35"
                              : "bg-[#f7f6f0] border-[#d8d4c8] text-[#989286]"
                      }`}
                    >
                      {step < currentStep ? <FiCheck size={17} /> : step}
                    </div>

                    <div className="mt-2.5 text-center">
                      <p
                        className={`text-[10px] uppercase tracking-[0.16em] ${
                          step <= currentStep
                            ? dark
                              ? "text-white/60"
                              : "text-[#766f61]"
                            : dark
                              ? "text-white/30"
                              : "text-[#aaa59a]"
                        }`}
                      >
                        Step {step}
                      </p>

                      <p
                        className={`text-xs mt-0.5 font-semibold ${
                          step <= currentStep
                            ? dark
                              ? "text-white"
                              : "text-[#171714]"
                            : dark
                              ? "text-white/30"
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
          <div className="w-full max-w-4xl mx-auto">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBoxClass}`}
                    >
                      <FiGlobe size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Choose Network</h2>

                      <p
                        className={`text-sm mt-1 ${dark ? "text-white/55" : "text-[#817b70]"}`}
                      >
                        Select where your bounty will be created.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider  mb-2.5 ${labelClass}`}
                      >
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
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
                      >
                        Category
                      </label>

                      <select
                        value={bountyData.category}
                        onChange={(e) => {
                          updateBountyData("category", e.target.value);
                          updateBountyData("tags", []);
                          setCustomTag("");
                        }}
                        className={`${selectClass} cursor-pointer`}
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

                  <div
                    className={`mt-7 rounded-2xl border p-4 flex items-start gap-3 ${softPanelClass}`}
                  >
                    <FiShield className={`${goldTextClass} mt-0.5 shrink-0`} />

                    <p className={`text-xs leading-relaxed ${mutedClass}`}>
                      Your selected network determines where the bounty contract
                      transaction will be executed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBoxClass}`}
                    >
                      <FiTag size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Task Details</h2>

                      <p
                        className={`text-sm mt-1 ${
                          dark ? "text-white/55" : "text-[#817b70]"
                        }`}
                      >
                        Give contributors everything they need to understand the
                        work.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
                      >
                        Title <span className={goldTextClass}>*</span>
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

                    {/* Description */}
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
                      >
                        Description <span className={goldTextClass}>*</span>
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

                    {/* Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label
                          className={`block text-xs font-semibold uppercase tracking-wider ${labelClass}`}
                        >
                          Tags <span className={goldTextClass}>*</span>
                        </label>

                        <span
                          className={`text-xs ${
                            dark ? "text-white/45" : "text-[#8b8579]"
                          }`}
                        >
                          {bountyData.tags.length} / 5 selected
                        </span>
                      </div>

                      {!bountyData.category ? (
                        <p
                          className={`text-xs italic ${
                            dark ? "text-white/40" : "text-[#8b8579]"
                          }`}
                        >
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
                                      ? dark
                                        ? "bg-[#D4AF37]/10 border-[#D4AF37]/50 text-[#D4AF37]"
                                        : "bg-[#f4ecd5] border-[#d4af37] text-[#8f6c12]"
                                      : dark
                                        ? "bg-[#111311] border-white/10 text-white/65 hover:border-[#D4AF37]/60 hover:text-[#D4AF37]"
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
                              <label
                                className={`block text-xs mb-1.5 ${
                                  dark ? "text-white/60" : "text-[#6f6a60]"
                                }`}
                              >
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
                                  className={`flex-1 rounded-xl px-4 py-2 text-sm outline-none transition ${
                                    dark
                                      ? "bg-[#111311] border border-white/10 text-white placeholder:text-white/35 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#d4af37]/10"
                                      : "bg-white border border-[#ddd8ca] text-[#171714] placeholder:text-[#99958a] focus:border-[#c49b2c] focus:ring-2 focus:ring-[#d4af37]/10"
                                  }`}
                                />

                                <button
                                  type="button"
                                  onClick={addCustomTag}
                                  disabled={
                                    !customTag.trim() ||
                                    bountyData.tags.length >= 5
                                  }
                                  className={`px-4 py-2 rounded-xl border text-sm font-semibold hover:bg-[#292922] transition disabled:opacity-40 disabled:cursor-not-allowed ${darkButtonClass} text-[#d4af37]`}
                                >
                                  Add
                                </button>
                              </div>

                              <p
                                className={`mt-1 text-[10px] ${
                                  dark ? "text-white/40" : "text-[#99958a]"
                                }`}
                              >
                                Press Enter or click Add. Max 5 tags total.
                              </p>
                            </div>
                          )}

                          {bountyData.tags.length > 0 && (
                            <div className="mt-4">
                              <p className={`text-xs mb-2 ${labelClass}`}>
                                Selected:
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {bountyData.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                      dark
                                        ? "bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]"
                                        : "bg-[#f4ecd5] border border-[#e5d9b8] text-[#8f6c12]"
                                    }`}
                                  >
                                    {tag}

                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      aria-label={`Remove ${tag}`}
                                      className={`transition ${
                                        dark
                                          ? "text-[#D4AF37] hover:text-white"
                                          : "text-[#8f6c12] hover:text-[#171714]"
                                      }`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {bountyData.tags.length === 0 && (
                            <p
                              className={`mt-2 text-xs ${
                                dark ? "text-white/40" : "text-[#8b8579]"
                              }`}
                            >
                              Pick at least one tag.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
                        >
                          Start Date <span className={goldTextClass}>*</span>
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
                        <label
                          className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
                        >
                          End Date <span className={goldTextClass}>*</span>
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

                    {/* Origin Link */}
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${labelClass}`}
                      >
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

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBoxClass}`}
                    >
                      <FiDollarSign size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Reward Information</h2>

                      <p
                        className={`text-sm mt-1 ${
                          dark ? "text-white/55" : "text-[#817b70]"
                        }`}
                      >
                        Configure how contributors will receive the bounty.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Self Fund */}
                    <div className={`rounded-2xl border p-5 ${softPanelClass}`}>
                      <div className="flex items-start gap-3">
                        <FiShield
                          className={`${goldTextClass} mt-0.5 shrink-0`}
                        />

                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              dark ? "text-white" : "text-[#25231e]"
                            }`}
                          >
                            Self-fund
                          </p>

                          <p
                            className={`text-xs mt-1.5 leading-relaxed ${mutedClass}`}
                          >
                            You use your own money to create the task. You will
                            be responsible for providing the reward money to the
                            winner(s).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Multiple Winners */}
                    <div
                      className={`rounded-2xl border p-5 ${secondaryPanelClass}`}
                    >
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              dark
                                ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                                : "bg-[#f3efe2] text-[#b28b20]"
                            }`}
                          >
                            <FiUsers size={16} />
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm">
                              Multiple winners
                            </h3>

                            <p className={`text-xs mt-1 ${softMutedClass}`}>
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

                          <div
                            className={`w-12 h-6 rounded-full transition-all ${
                              dark
                                ? "bg-white/15 peer-checked:bg-[#d4af37]"
                                : "bg-[#d8d4ca] peer-checked:bg-[#d4af37]"
                            }`}
                          />

                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-6 transition-all" />
                        </label>
                      </div>
                    </div>

                    {multipleWinner && (
                      <div
                        className={`rounded-2xl border p-5 ${secondaryPanelClass}`}
                      >
                        <div className="flex flex-wrap gap-3 items-center">
                          <button
                            onClick={() => setShowEqualModal(true)}
                            aria-pressed={selectedPayoutType === "MULTI_EQUAL"}
                            className={`cursor-pointer px-4 py-2.5 rounded-xl border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                              selectedPayoutType === "MULTI_EQUAL"
                                ? selectedChoiceClass
                                : `${secondaryButtonClass} hover:border-[#c49b2c] hover:bg-[#f4ecd5] dark:hover:bg-[#292922]`
                            }`}
                          >
                            Equal Split
                          </button>

                          <button
                            onClick={() => setShowPercentModal(true)}
                            aria-pressed={
                              selectedPayoutType === "MULTI_PERCENTAGE"
                            }
                            className={`cursor-pointer px-4 py-2.5 rounded-xl border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                              selectedPayoutType === "MULTI_PERCENTAGE"
                                ? selectedChoiceClass
                                : `${secondaryButtonClass} hover:border-[#c49b2c] hover:bg-[#f4ecd5] dark:hover:bg-[#292922]`
                            }`}
                          >
                            % Split
                          </button>

                          <div className="relative">
                            <button
                              onClick={() => setShowInfoMenu(!showInfoMenu)}
                              className={`cursor-pointer w-10 h-10 rounded-xl border flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                                dark
                                  ? "border-white/10 bg-[#111311] text-white/55 hover:text-[#D4AF37] hover:border-[#D4AF37]"
                                  : "border-[#ddd8cb] bg-white text-[#777267] hover:text-[#b28b20] hover:border-[#c49b2c]"
                              }`}
                            >
                              <FiInfo size={17} />
                            </button>

                            {showInfoMenu && (
                              <div
                                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 rounded-2xl shadow-2xl p-4 z-50 ${
                                  dark
                                    ? "bg-[#111311] border border-white/10 text-white"
                                    : "bg-[#171714] border border-[#171714] text-white"
                                }`}
                              >
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
                              <span
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                  dark
                                    ? "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                                    : "text-[#8f6c12] bg-[#f4ecd5] border border-[#e5d9b8]"
                                }`}
                              >
                                {winnerCount} winners · Equal split
                              </span>
                            )}

                          {selectedPayoutType === "MULTI_PERCENTAGE" &&
                            percentageArray.length > 0 && (
                              <span
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                  dark
                                    ? "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                                    : "text-[#8f6c12] bg-[#f4ecd5] border border-[#e5d9b8]"
                                }`}
                              >
                                {percentageArray.length} winners ·{" "}
                                {percentageArray.join("% / ")}%
                              </span>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Reward Type */}
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${labelClass}`}
                      >
                        Reward Type <span className={goldTextClass}>*</span>
                      </label>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            updateBountyData("rewardType", "self-fund")
                          }
                          className={`cursor-pointer px-5 py-2.5 rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                            bountyData.rewardType === "self-fund"
                              ? selectedChoiceClass
                              : dark
                                ? "bg-[#111311] border border-white/10 text-white/65 hover:border-[#D4AF37]"
                                : "bg-white border border-[#d8d3c6] text-[#625e55] hover:border-[#c49b2c]"
                          }`}
                        >
                          Self-Fund
                        </button>

                        <button
                          disabled
                          className={`px-5 py-2.5 rounded-xl border text-sm cursor-not-allowed ${
                            dark
                              ? "bg-white/5 border-white/10 text-white/30"
                              : "bg-[#f2f0ea] border-[#dedad0] text-[#aaa59b]"
                          }`}
                        >
                          Seek Funding{" "}
                          <span className={`${goldTextClass} text-xs`}>
                            soon
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Reward */}
                    <div className={`border-t pt-6 ${themeBorderClass}`}>
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-sm">Set reward</h4>

                          <p className={`text-xs mt-1 ${softMutedClass}`}>
                            Amount distributed to the winner(s)
                          </p>
                        </div>

                        <div className="w-full md:w-64">
                          <div
                            className={`flex items-center justify-between rounded-xl h-12 px-4 border ${
                              dark
                                ? "border-white/10 bg-[#111311] focus-within:border-[#D4AF37]"
                                : "border-[#dcd8cd] bg-white focus-within:border-[#c49b2c]"
                            }`}
                          >
                            <input
                              type="text"
                              inputMode="decimal"
                              value={rewardDisplay}
                              onChange={(e) => {
                                const raw = e.target.value
                                  .replace(/,/g, "")
                                  .replace(/[^\d.]/g, "");

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
                              className={`bg-transparent outline-none text-sm w-full ${
                                dark ? "text-white" : "text-[#171714]"
                              }`}
                            />

                            <p
                              className={`text-sm font-semibold ${
                                dark ? "text-white/45" : "text-[#8b8579]"
                              }`}
                            >
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
                            className={`text-xs hover:underline mt-1 inline-block ${goldTextClass}`}
                          >
                            Learn more
                          </a>
                        </div>

                        <div className="w-full md:w-64">
                          <div
                            className={`flex items-center justify-between rounded-xl h-12 px-4 border ${
                              dark
                                ? "border-white/10 bg-[#111311]"
                                : "border-[#e0dcd2] bg-[#f5f3ed]"
                            }`}
                          >
                            <input
                              type="text"
                              value={feeDisplay}
                              disabled
                              className={`bg-transparent outline-none text-sm w-full ${
                                dark ? "text-white/45" : "text-[#777267]"
                              }`}
                            />

                            <p
                              className={`text-sm font-semibold ${
                                dark ? "text-white/30" : "text-[#999286]"
                              }`}
                            >
                              {bountyData.token}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div
                      className={`rounded-2xl border p-5 ${
                        dark
                          ? "border-[#D4AF37]/30 bg-[#D4AF37]/10"
                          : "border-[#d9cfb4] bg-[#fbf7e9]"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-center">
                        <div>
                          <h4 className="font-bold text-sm">Total Amount</h4>

                          <p
                            className={`text-xs mt-1 ${
                              dark ? "text-white/55" : "text-[#7c7567]"
                            }`}
                          >
                            Reward + service fees
                          </p>
                        </div>

                        <div
                          className={`flex items-center justify-between rounded-xl h-12 px-4 w-full md:w-64 border ${
                            dark
                              ? "border-[#D4AF37]/30 bg-[#111311]"
                              : "border-[#d8c895] bg-white"
                          }`}
                        >
                          <input
                            type="text"
                            value={totalAmountDisplay}
                            disabled
                            className={`bg-transparent outline-none text-sm w-full font-bold ${
                              dark ? "text-white" : "text-[#171714]"
                            }`}
                          />

                          <p
                            className={`text-sm font-bold ${
                              dark ? "text-[#D4AF37]" : "text-[#9a7619]"
                            }`}
                          >
                            {bountyData.token}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Token */}
                    <div>
                      <label
                        className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
                      >
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

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className={cardClass}>
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />

                <div className="p-6 md:p-9">
                  <div className="flex items-start gap-4 mb-8">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBoxClass}`}
                    >
                      <FiCheck size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Review & Submit</h2>

                      <p
                        className={`text-sm mt-1 ${
                          dark ? "text-white/55" : "text-[#817b70]"
                        }`}
                      >
                        Confirm your bounty details before submitting.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border overflow-hidden ${dark ? "border-white/10" : "border-[#e1ddd2]"}`}
                  >
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
                          index !== 5
                            ? `border-b ${
                                dark ? "border-white/10" : "border-[#e7e3da]"
                              }`
                            : ""
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            dark ? "text-white/45" : "text-[#898378]"
                          }`}
                        >
                          {label}
                        </span>

                        <span
                          className={`text-sm font-medium sm:text-right ${
                            dark ? "text-white" : "text-[#25231e]"
                          }`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}

                    {/* Description */}
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between gap-2 px-5 py-4 border-b ${
                        dark ? "border-white/10" : "border-[#e7e3da]"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          dark ? "text-white/45" : "text-[#898378]"
                        }`}
                      >
                        Description
                      </span>

                      <span
                        className={`text-sm sm:text-right max-w-full sm:max-w-[60%] ${
                          dark ? "text-white/65" : "text-[#4f4b43]"
                        }`}
                      >
                        {bountyData.description
                          ? bountyData.description.length > 100
                            ? bountyData.description.substring(0, 100) + "..."
                            : bountyData.description
                          : "Not entered"}
                      </span>
                    </div>

                    {/* Origin Link */}
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between gap-2 px-5 py-4 border-b ${
                        dark ? "border-white/10" : "border-[#e7e3da]"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          dark ? "text-white/45" : "text-[#898378]"
                        }`}
                      >
                        Origin Link
                      </span>

                      <span className="text-sm truncate max-w-full sm:max-w-[60%] sm:text-right">
                        {bountyData.originLink ? (
                          <a
                            href={bountyData.originLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`hover:underline ${dark ? "text-[#D4AF37]" : "text-[#9a7619]"}`}
                          >
                            {bountyData.originLink.length > 40
                              ? bountyData.originLink.substring(0, 40) + "..."
                              : bountyData.originLink}
                          </a>
                        ) : (
                          <span
                            className={
                              dark ? "text-white/65" : "text-[#4f4b43]"
                            }
                          >
                            Not provided
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Total */}
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-5 border-b ${
                        dark
                          ? "bg-[#D4AF37]/10 border-[#D4AF37]/20"
                          : "bg-[#fbf7e9] border-[#e7dfc9]"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          dark ? "text-white/60" : "text-[#766e5d]"
                        }`}
                      >
                        Total Amount
                      </span>

                      <span
                        className={`text-lg font-bold ${
                          dark ? "text-[#D4AF37]" : "text-[#8f6c12]"
                        }`}
                      >
                        {totalAmountDisplay} {bountyData.token}
                      </span>
                    </div>

                    {/* Multiple Winners */}
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between gap-2 px-5 py-4 border-b ${
                        dark ? "border-white/10" : "border-[#e7e3da]"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          dark ? "text-white/45" : "text-[#898378]"
                        }`}
                      >
                        Winner Type
                      </span>

                      <span
                        className={`text-sm font-medium sm:text-right ${
                          dark ? "text-white" : "text-[#25231e]"
                        }`}
                      >
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
                    <div
                      className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-4 border-b ${
                        dark ? "border-white/10" : "border-[#e7e3da]"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          dark ? "text-white/45" : "text-[#898378]"
                        }`}
                      >
                        Reward Type
                      </span>

                      <span
                        className={`text-sm font-medium capitalize ${
                          dark ? "text-white" : "text-[#25231e]"
                        }`}
                      >
                        {bountyData.rewardType?.replace("-", " ")}
                      </span>
                    </div>

                    {/* Network */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 py-4">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          dark ? "text-white/45" : "text-[#898378]"
                        }`}
                      >
                        Network
                      </span>

                      <span
                        className={`text-sm font-medium ${
                          dark ? "text-white" : "text-[#25231e]"
                        }`}
                      >
                        {supportedChains.find(
                          (c) => c.id === bountyData.network,
                        )?.name || "Not selected"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`mt-7 flex items-start gap-3 rounded-2xl border p-4 ${softPanelClass}`}
                  >
                    <FiShield className={`${goldTextClass} mt-0.5 shrink-0`} />

                    <p className={`text-xs leading-relaxed ${mutedClass}`}>
                      By creating this bounty you agree to our{" "}
                      <a
                        href="#"
                        className={`${goldTextClass} font-semibold hover:underline`}
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
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition ${
                    dark
                      ? "bg-[#111311] border-white/10 text-white/70 hover:border-[#D4AF37]/50 hover:bg-[#151715]"
                      : "bg-white border-[#dcd8ce] text-[#4f4b43] hover:border-[#bdb7a9] hover:bg-[#fbfaf6]"
                  }`}
                >
                  <FiX size={16} />
                  Cancel
                </Link>
              ) : (
                <button
                  onClick={prevStep}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition ${
                    dark
                      ? "bg-[#111311] border-white/10 text-white/70 hover:border-[#D4AF37]/50 hover:bg-[#151715]"
                      : "bg-white border-[#dcd8ce] text-[#4f4b43] hover:border-[#bdb7a9] hover:bg-[#fbfaf6]"
                  }`}
                >
                  <FiArrowLeft size={16} />
                  Back
                </button>
              )}

              {currentStep === totalSteps ? (
                <button
                  onClick={handleFinalSubmit}
                  disabled={isProcessing}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#d4af37] text-sm font-bold border hover:bg-[#292922] transition disabled:opacity-50 disabled:cursor-not-allowed ${darkButtonClass}`}
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

      {/* =========================================================
          EQUAL SPLIT MODAL
      ========================================================== */}
      {showEqualModal && (
        <div
          className={`app-modal-overlay fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 ${
            dark ? "bg-black/70" : "bg-[#171714]/60"
          }`}
          onClick={() => setShowEqualModal(false)}
        >
          <div
            className={`app-modal-panel border rounded-3xl w-full max-w-md p-6 ${
              dark
                ? "bg-[#111311] border-white/10"
                : "bg-[#f9f8f3] border-[#ddd8ca]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    dark
                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "bg-[#f1ead4] text-[#a17a17]"
                  }`}
                >
                  <FiUsers size={18} />
                </div>

                <h3
                  className={`text-xl font-bold ${
                    dark ? "text-white" : "text-[#171714]"
                  }`}
                >
                  Equal Split
                </h3>

                <p
                  className={`text-sm mt-1 ${
                    dark ? "text-white/55" : "text-[#7c766b]"
                  }`}
                >
                  Enter the number of winners (2-5)
                </p>
              </div>

              <button
                onClick={() => setShowEqualModal(false)}
                className={`cursor-pointer w-9 h-9 rounded-xl border flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  dark
                    ? "border-white/10 bg-[#151715] text-white/55 hover:text-white"
                    : "border-[#ddd8ca] bg-white text-[#777267] hover:text-[#171714]"
                }`}
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
                className={`cursor-pointer flex-1 px-4 py-3 rounded-xl border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  dark
                    ? "bg-[#151715] border-white/10 text-white/75 hover:bg-[#1b1d1b]"
                    : "bg-white border-[#d9d4c8] text-[#555047] hover:bg-[#f4f2ec]"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleEqualSplitConfirm}
                className={`cursor-pointer flex-1 px-4 py-3 rounded-xl border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${selectedChoiceClass}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          PERCENTAGE SPLIT MODAL
      ========================================================== */}
      {showPercentModal && (
        <div
          className={`app-modal-overlay fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4 ${
            dark ? "bg-black/70" : "bg-[#171714]/60"
          }`}
          onClick={() => setShowPercentModal(false)}
        >
          <div
            className={`app-modal-panel border rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto ${
              dark
                ? "bg-[#111311] border-white/10"
                : "bg-[#f9f8f3] border-[#ddd8ca]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    dark
                      ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "bg-[#f1ead4] text-[#a17a17]"
                  }`}
                >
                  <FiDollarSign size={18} />
                </div>

                <h3
                  className={`text-xl font-bold ${
                    dark ? "text-white" : "text-[#171714]"
                  }`}
                >
                  Percentage Split
                </h3>

                <p
                  className={`text-sm mt-1 ${
                    dark ? "text-white/55" : "text-[#7c766b]"
                  }`}
                >
                  Select a preset or enter custom percentages
                </p>
              </div>

              <button
                onClick={() => setShowPercentModal(false)}
                className={`cursor-pointer w-9 h-9 rounded-xl border flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  dark
                    ? "border-white/10 bg-[#151715] text-white/55 hover:text-white"
                    : "border-[#ddd8ca] bg-white text-[#777267] hover:text-[#171714]"
                }`}
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="space-y-2.5 mb-5">
              <button
                onClick={() => handlePresetSelect([40, 30, 20, 5, 5])}
                aria-pressed={isSelectedPreset([40, 30, 20, 5, 5])}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  isSelectedPreset([40, 30, 20, 5, 5])
                    ? selectedChoiceClass
                    : `${secondaryButtonClass} hover:border-[#c49b2c] hover:bg-[#f4ecd5] dark:hover:bg-[#292922]`
                }`}
              >
                <span className="font-semibold">[40, 30, 20, 5, 5]</span>{" "}
                <span className={dark ? "text-white/45" : "text-[#888175]"}>
                  — 5 winners
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect([40, 30, 20, 10])}
                aria-pressed={isSelectedPreset([40, 30, 20, 10])}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  isSelectedPreset([40, 30, 20, 10])
                    ? selectedChoiceClass
                    : `${secondaryButtonClass} hover:border-[#c49b2c] hover:bg-[#f4ecd5] dark:hover:bg-[#292922]`
                }`}
              >
                <span className="font-semibold">[40, 30, 20, 10]</span>{" "}
                <span className={dark ? "text-white/45" : "text-[#888175]"}>
                  — 4 winners
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect([50, 30, 20])}
                aria-pressed={isSelectedPreset([50, 30, 20])}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  isSelectedPreset([50, 30, 20])
                    ? selectedChoiceClass
                    : `${secondaryButtonClass} hover:border-[#c49b2c] hover:bg-[#f4ecd5] dark:hover:bg-[#292922]`
                }`}
              >
                <span className="font-semibold">[50, 30, 20]</span>{" "}
                <span className={dark ? "text-white/45" : "text-[#888175]"}>
                  — 3 winners
                </span>
              </button>

              <button
                onClick={() => handlePresetSelect([50, 50])}
                aria-pressed={isSelectedPreset([50, 50])}
                className={`cursor-pointer w-full text-left px-4 py-3 rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  isSelectedPreset([50, 50])
                    ? selectedChoiceClass
                    : `${secondaryButtonClass} hover:border-[#c49b2c] hover:bg-[#f4ecd5] dark:hover:bg-[#292922]`
                }`}
              >
                <span className="font-semibold">[50, 50]</span>{" "}
                <span className={dark ? "text-white/45" : "text-[#888175]"}>
                  — 2 winners
                </span>
              </button>
            </div>

            <div className="mb-5">
              <label
                className={`block text-xs font-semibold uppercase tracking-wider mb-2.5 ${labelClass}`}
              >
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
                className={`cursor-pointer flex-1 px-4 py-3 rounded-xl border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${
                  dark
                    ? "bg-[#151715] border-white/10 text-white/75 hover:bg-[#1b1d1b]"
                    : "bg-white border-[#d9d4c8] text-[#555047] hover:bg-[#f4f2ec]"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handlePercentSplitConfirm}
                className={`cursor-pointer flex-1 px-4 py-3 rounded-xl border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/50 ${selectedChoiceClass}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Create;
