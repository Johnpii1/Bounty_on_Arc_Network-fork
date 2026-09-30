// BountyDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/UI/Toast";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiExternalLink,
  FiInfo,
  FiLink,
  FiShield,
  FiTag,
  FiUser,
  FiUsers,
  FiX,
  FiSearch,
} from "react-icons/fi";
import NavBar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";
import { BOUNTY_ABI, CONTRACT_ADDRESSES } from "contract";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { formatEther } from "viem";
import { useBounty } from "../hooks/useBounty";
import { formatAmount } from "../utils/format";
import { BountyDetailSkeleton } from "../components/UI/Skeleton";

const BountyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  const {
    claimReward,
    assignSingleWinner,
    assignMultipleWinners,
    useClaimableReward,
    useClaimedStatus,
    fetchBountyIdFromTx,
    isPending: isContractPending,
    isConfirming: isContractConfirming,
  } = useBounty();

  const [bounty, setBounty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [hasUserSubmitted, setHasUserSubmitted] = useState(false);
  const [userSubmission, setUserSubmission] = useState(null);
  const [winnersData, setWinnersData] = useState(null);
  const [offChainClaimable, setOffChainClaimable] = useState("0");
  const [hasUserClaimedOffChain, setHasUserClaimedOffChain] =
    useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [submissionImage, setSubmissionImage] = useState(null);
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSizeWarning, setImageSizeWarning] = useState("");
  const [winnerAddresses, setWinnerAddresses] = useState([]);

  const [enrollmentStatus, setEnrollmentStatus] = useState("checking");
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [selectedWinners, setSelectedWinners] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const fileInputRef = useRef(null);

  const blockchainId =
    bounty?.blockchainId !== null && bounty?.blockchainId !== undefined
      ? Number(bounty.blockchainId)
      : null;

  const { data: onChainClaimable, refetch: refetchClaimable } =
    useClaimableReward(blockchainId, address);

  const { data: onChainClaimed } = useClaimedStatus(
    blockchainId,
    address,
  );

  useEffect(() => {
    if (blockchainId && address) refetchClaimable();
  }, [blockchainId, address]);

  /* ---------------- Helpers ---------------- */

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortenAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const compressImage = (file, maxWidth = 1024, quality = 0.7) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          canvas
            .getContext("2d")
            .drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                }),
              );
            },
            file.type,
            quality,
          );
        };

        img.onerror = reject;
        img.src = e.target.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* ---------------- API calls ---------------- */

  const checkUserEnrollment = async (wallet, bountyId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/user/get-enrollment/${wallet}`,
      );

      return (data.enrollments || []).some(
        (e) => e.bountyId === bountyId,
      );
    } catch {
      return false;
    }
  };

  const checkUserSubmission = async (wallet, bountyId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/bounty/user/submissions/${wallet}`,
      );

      const existing = (data.submissions || []).find(
        (sub) => String(sub.bountyId) === String(bountyId),
      );

      if (existing) {
        setHasUserSubmitted(true);
        setUserSubmission(existing);
      }
    } catch (err) {
      console.error("Error checking submission:", err);
    }
  };

  const loadWinnersData = async (bountyId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/bounty/${bountyId}/winners`,
      );

      setWinnersData(data);

      if (address && data.isDistributed) {
        const { data: c } = await axios.get(
          `${API_URL}/bounty/${bountyId}/claimable/${address}`,
        );

        setOffChainClaimable(c.claimableFormatted || "0");

        const { data: h } = await axios.get(
          `${API_URL}/bounty/${bountyId}/has-claimed/${address}`,
        );

        setHasUserClaimedOffChain(h.hasClaimed);
      }
    } catch (err) {
      console.error("Error loading winners:", err);
    }
  };

  const loadComments = async (bountyId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/comments/${bountyId}`,
      );

      setComments(data.comments || []);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const loadAllSubmissions = async (bountyId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/bounty/submissions/${bountyId}`,
      );
      setAllSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Error loading submissions:", err);
    }
  };

  /* ---------------- Fetch bounty ---------------- */

  useEffect(() => {
    const fetchBounty = async () => {
      if (!id) return;
      setEnrollmentStatus("checking");
      setIsCreator(false);
      setHasUserSubmitted(false);
      setUserSubmission(null);
      setWinnersData(null);
      setOffChainClaimable("0");
      setHasUserClaimedOffChain(false);
      setAllSubmissions([]);
      setSelectedWinners([]);

      try {
        const { data } = await axios.get(`${API_URL}/bounty/${id}`);

        let bountyData = data.bounty || data;

        if (!bountyData.blockchainId && bountyData.txHash) {
          if (currentChainId !== bountyData.network) {
            try {
              await switchChain({
                chainId: bountyData.network,
              });
            } catch {
              showToast.error("Please switch network manually");
              return;
            }
          }

          const fetchedId = await fetchBountyIdFromTx(
            bountyData.txHash,
          );

          if (fetchedId) {
            await axios.patch(
              `${API_URL}/bounty/update/${id}`,
              {
                blockchainId: fetchedId,
              },
            );

            bountyData = {
              ...bountyData,
              blockchainId: fetchedId,
            };
          }
        }

        setBounty(bountyData);

        if (address) {
          const creator =
            bountyData.creator?.toLowerCase() === address.toLowerCase();
          setIsCreator(creator);

          try {
            const enrolled = await checkUserEnrollment(
              address,
              id,
            );

            setEnrollmentStatus(
              enrolled ? "enrolled" : "not-enrolled",
            );
          } catch {
            setEnrollmentStatus("not-enrolled");
          }

          await checkUserSubmission(address, id);
          await loadWinnersData(id);

          if (creator) {
            await loadAllSubmissions(id);
          }
        }

        await loadComments(id);
      } catch (err) {
        console.error(err);
        showToast.error("Failed to load bounty details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchBounty();
  }, [id, navigate, address]);

  /* ---------------- Enrollment ---------------- */

  const handleEnroll = async () => {
    if (!address) {
      return showToast.error("Please connect your wallet");
    }

    setIsEnrolling(true);

    const loadingToast = showToast.loading(
      "Enrolling in bounty...",
    );

    try {
      await axios.post(`${API_URL}/user/enrollment`, {
        bountyId: id,
        user: address,
      });

      showToast.success("Enrolled!", {
        id: loadingToast,
      });

      setEnrollmentStatus("enrolled");
    } catch (err) {
      const alreadyEnrolled =
        err.response?.status === 400 &&
        err.response.data?.error
          ?.toLowerCase()
          .includes("already");

      if (alreadyEnrolled) {
        showToast.success("You're already enrolled", {
          id: loadingToast,
        });

        setEnrollmentStatus("enrolled");
      } else {
        showToast.error(
          err.response?.data?.error || "Enrollment failed",
          {
            id: loadingToast,
          },
        );
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  /* ---------------- Submission ---------------- */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageSizeWarning("Max 5MB");
    } else {
      setImageSizeWarning("");
    }

    setSubmissionImage(file);

    const reader = new FileReader();

    reader.onload = (ev) => setImagePreview(ev.target.result);

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      return showToast.error("Please connect your wallet");
    }

    if (!submissionDescription || !submissionLink) {
      return showToast.error(
        "Please fill in description and link",
      );
    }

    setSubmitting(true);

    const loadingshowToast =
      showToast.loading("Submitting...");

    try {
      const formData = new FormData();

      formData.append("bountyId", id);
      formData.append("user", address);
      formData.append(
        "description",
        submissionDescription,
      );
      formData.append("projectLink", submissionLink);

      if (submissionImage) {
        const compressed = await compressImage(
          submissionImage,
        );

        formData.append("image", compressed);
      }

      const { data } = await axios.post(
        `${API_URL}/bounty/submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      showToast.success("Submitted! Pending review.", {
        id: loadingshowToast,
      });

      setHasUserSubmitted(true);

      setUserSubmission({
        ...data,
        bountyId: id,
        user: address,
        description: submissionDescription,
        projectLink: submissionLink,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });

      setShowSubmitModal(false);

      resetSubmissionForm();
    } catch (err) {
      const msg =
        err.response?.status === 400
          ? err.response.data?.error ||
            "Submission rejected"
          : "Failed to submit";

      showToast.error(msg, {
        id: loadingshowToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetSubmissionForm = () => {
    setSubmissionImage(null);
    setSubmissionDescription("");
    setSubmissionLink("");
    setImagePreview(null);
    setImageSizeWarning("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------- Claim ---------------- */

  const handleClaimReward = async () => {
    if (!address) {
      return showToast.error("Please connect your wallet");
    }

    if (!bounty?.blockchainId) {
      return showToast.error("Not on-chain");
    }

    if (currentChainId !== bounty.network) {
      try {
        await switchChain({
          chainId: bounty.network,
        });
      } catch {
        return showToast.error(
          "Please switch network manually",
        );
      }
    }

    if (!onChainClaimable || onChainClaimable === 0n) {
      return showToast.error("No reward available");
    }

    if (onChainClaimed) {
      return showToast.error("Already claimed");
    }

    try {
      const { hash } = await claimReward(blockchainId);

      await axios.post(`${API_URL}/bounty/${id}/claim`, {
        winnerAddress: address,
        txHash: hash,
      });

      showToast.success("Reward claimed!");

      await loadWinnersData(id);
      refetchClaimable();
    } catch (err) {
      showToast.error(
        err.shortMessage ||
          err.message ||
          "Claim failed",
      );
    }
  };

  /* ---------------- Distribute ---------------- */

  const handleDistributeReward = async () => {
    const valid = winnerAddresses.filter((a) =>
      a?.startsWith("0x"),
    );

    if (!valid.length || valid.length !== winnerAddresses.length) {
      return showToast.error(
        "Enter valid winner addresses",
      );
    }

    if (!bounty?.blockchainId) {
      return showToast.error("Not on-chain");
    }

    if (currentChainId !== bounty.network) {
      try {
        await switchChain({
          chainId: bounty.network,
        });
      } catch {
        return showToast.error(
          "Please switch network manually",
        );
      }
    }

    setDistributing(true);

    const loadingshowToast =
      showToast.loading("Distributing...");

    try {
      let tx;

      if (valid.length === 1) {
        tx = await assignSingleWinner(
          blockchainId,
          valid[0],
        );
      } else {
        const pcts =
          bounty.payoutType === "MULTI_PERCENTAGE"
            ? bounty.percentages
            : [];

        tx = await assignMultipleWinners(
          blockchainId,
          valid,
          pcts,
        );
      }

      await axios.post(
        `${API_URL}/bounty/${id}/distribute`,
        {
          txHash: tx.hash,
          blockchainId: bounty.blockchainId,
          chainId: bounty.network,
          bountyContract:
            CONTRACT_ADDRESSES[bounty.network]?.bounty ||
            null,
        },
      );

      showToast.success("Distributed!", {
        id: loadingshowToast,
      });

      showToast.success("Distributed!", { id: loadingshowToast });
      setSelectedWinners([]);
      setShowDistributeModal(false);

      await loadWinnersData(id);
    } catch (err) {
      showToast.error(
        err.shortMessage ||
          err.message ||
          "Distribution failed",
        {
          id: loadingshowToast,
        },
      );
    } finally {
      setDistributing(false);
    }
  };

  const toggleWinnerSelection = (submission) => {
    const addr = submission.user.toLowerCase();

    setSelectedWinners((prev) => {
      const exists = prev.find((s) => s.address === addr);
      if (exists) {
        return prev.filter((s) => s.address !== addr);
      }

      // SINGLE: replace whatever was there before
      if (bounty.payoutType === "SINGLE") {
        return [{ address: addr, submissionId: submission._id }];
      }

      // MULTI: cap at winnersAllowed
      if (prev.length >= bounty.winnersAllowed) {
        showToast.error(
          `You can only select ${bounty.winnersAllowed} winner${
            bounty.winnersAllowed > 1 ? "s" : ""
          }`,
        );
        return prev;
      }

      return [...prev, { address: addr, submissionId: submission._id }];
    });
  };

  const isSelected = (addr) =>
    selectedWinners.some((s) => s.address === addr.toLowerCase());

  const hasEnoughSelections = () => {
    if (selectedWinners.length === 0) return true; // allow manual entry via the button
    return selectedWinners.length === bounty.winnersAllowed;
  };

  const openDistributeModal = () => {
    if (selectedWinners.length > 0) {
      setWinnerAddresses(selectedWinners.map((s) => s.address));
    } else {
      const count =
        bounty?.payoutType === "SINGLE" ? 1 : bounty?.winnersAllowed || 1;
      setWinnerAddresses(Array(count).fill(""));
    }
    setShowDistributeModal(true);
  };

  // const openDistributeModal = () => {
  //   const count =
  //     bounty?.payoutType === "SINGLE" ? 1 : bounty?.winnersAllowed || 1;
  //   setWinnerAddresses(Array(count).fill(""));
  //   setShowDistributeModal(true);
  // };

  /* ---------------- Comments ---------------- */

  const handleAddComment = async () => {
    if (!address) {
      return showToast.error("Please connect your wallet");
    }

    if (!newComment.trim()) {
      return showToast.error("Enter a comment");
    }

    try {
      const { data } = await axios.post(
        `${API_URL}/comments/add/${id}`,
        {
          user: address,
          text: newComment.trim(),
        },
      );

      setComments((prev) => [
        data.comment,
        ...prev,
      ]);

      setNewComment("");

      showToast.success("Comment added");
    } catch (err) {
      showToast.error(
        err.response?.data?.error ||
          "Failed to add comment",
      );
    }
  };

  /* ---------------- Derived ---------------- */

  // const canSubmit = () =>
  !isCreator && isEnrolled && !hasUserSubmitted && bounty?.status === "active";

  const canClaim = () => {
    if (isCreator || hasUserClaimedOffChain) {
      return false;
    }

    const amt = blockchainId
      ? onChainClaimable || 0n
      : BigInt(
          Math.round(
            Number(offChainClaimable) * 1e18,
          ) || 0,
        );

    if (amt === 0n) return false;

    return true;
  };

  const canDistribute = () => {
    if (!isCreator) return false;

    if (new Date(bounty?.deadline) >= new Date()) {
      return false;
    }

    if (winnersData?.isDistributed) {
      return false;
    }

    return true;
  };

  const displayClaimable = () => {
    if (blockchainId && onChainClaimable) {
      return formatAmount(
        formatEther(onChainClaimable),
      );
    }

    return formatAmount(offChainClaimable);
  };

  /* ---------------- UI classes ---------------- */

  const cardClass =
    "relative overflow-hidden rounded-3xl border border-[#dedbd1] dark:border-white/10 bg-white dark:bg-[#111311] shadow-[0_18px_60px_rgba(34,31,24,0.07)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-colors duration-300";

  const inputClass =
    "w-full bg-white dark:bg-[#111311] border border-[#ddd9ce] dark:border-white/10 rounded-xl px-4 py-3 text-[#171714] dark:text-white placeholder:text-[#99958a] dark:placeholder:text-white/35 outline-none transition focus:border-[#c49b2c] dark:focus:border-[#D4AF37] focus:ring-2 focus:ring-[#d4af37]/10";

  /* ---------------- Loading / Error ---------------- */

  if (loading) {
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

        <main className="flex-grow pt-20">
          <BountyDetailSkeleton />
        </main>

        <Footer />
      </div>
    );
  }

  if (!bounty) {
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

        <main className="flex-grow flex items-center justify-center pt-20 px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white dark:bg-[#111311] border border-[#dedbd1] dark:border-white/10 flex items-center justify-center text-[#b28b20] dark:text-[#D4AF37]">
              <FiSearch size={28} />
            </div>

            <p className="text-[#171714] dark:text-white text-xl font-semibold">
              Bounty not found
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-3 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition"
            >
              Back to Dashboard
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /* ---------------- Main ---------------- */

  const statusStyles = {
    active:
      "bg-[#e8f5e9] dark:bg-[#18351e] text-[#2e7d32] dark:text-[#81c784] border border-[#a5d6a7] dark:border-[#2e7d32]/40",

    upcoming:
      "bg-[#fff8e1] dark:bg-[#332b12] text-[#a17a17] dark:text-[#D4AF37] border border-[#e5d9b8] dark:border-[#D4AF37]/30",

    ended:
      "bg-[#f2f0ea] dark:bg-[#1a1c1a] text-[#777267] dark:text-white/55 border border-[#ddd8ca] dark:border-white/10",

    completed:
      "bg-[#f4ecd5] dark:bg-[#332b12] text-[#8f6c12] dark:text-[#D4AF37] border border-[#d4af37] dark:border-[#D4AF37]/50",

    cancelled:
      "bg-[#fbe9e7] dark:bg-[#351b1b] text-[#c62828] dark:text-[#ef9a9a] border border-[#ef9a9a] dark:border-[#c62828]/40",
  };

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

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Main card */}
          <div className={cardClass}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

            <div className="p-6 md:p-9">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#171714] dark:text-white break-words">
                  {bounty.title}
                </h1>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
                    statusStyles[bounty.status] ||
                    statusStyles.ended
                  }`}
                >
                  {bounty.status}
                </span>
              </div>

              <p className="text-[#625e55] dark:text-white/65 mb-6 text-sm sm:text-base leading-relaxed">
                {bounty.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-1">
                    Deadline
                  </p>

                  <p className="text-[#171714] dark:text-white font-semibold text-sm">
                    {formatDate(bounty.deadline)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-1">
                    Reward
                  </p>

                  <p className="text-[#8f6c12] dark:text-[#D4AF37] font-bold text-lg">
                    {formatAmount(bounty.reward)}{" "}
                    {bounty.token || "USDC"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-1">
                    Creator
                  </p>

                  <p className="text-[#171714] dark:text-white/75 font-mono text-sm">
                    {shortenAddress(bounty.creator)}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-1">
                    Category
                  </p>

                  <p className="text-[#171714] dark:text-white/80 text-sm">
                    {bounty.category || "Uncategorized"}
                  </p>
                </div>

                {bounty.tags?.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-1">
                      Tags
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {bounty.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-[#f4ecd5] dark:bg-[#2b2510] border border-[#e5d9b8] dark:border-[#D4AF37]/30 text-[#8f6c12] dark:text-[#D4AF37] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-1">
                    Project Link
                  </p>

                  {bounty.originLink ? (
                    <a
                      href={bounty.originLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9a7619] dark:text-[#D4AF37] hover:underline text-sm inline-flex items-center gap-1 break-all"
                    >
                      <FiLink size={12} />

                      {bounty.originLink.length > 45
                        ? bounty.originLink.slice(0, 45) +
                          "..."
                        : bounty.originLink}
                    </a>
                  ) : (
                    <p className="text-[#99958a] dark:text-white/35 text-sm">
                      No link provided
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#e7e3da] dark:border-white/10">

                {!isCreator &&
                  bounty.status === "active" && (
                    <>
                      {enrollmentStatus ===
                        "checking" && (
                        <div className="px-5 py-2.5 rounded-xl bg-[#f2f0ea] dark:bg-[#151715] border border-[#dedad0] dark:border-white/10 text-[#aaa59b] dark:text-white/40 text-sm">
                          Checking enrollment...
                        </div>
                      )}

                      {enrollmentStatus ===
                        "not-enrolled" && (
                        <button
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                          className="px-5 py-2.5 rounded-xl bg-[#d4af37] dark:bg-[#e0bd45] text-[#171714] font-semibold hover:bg-[#c49b2c] dark:hover:bg-[#d2ac2f] transition-colors duration-300 disabled:opacity-50"
                        >
                          {isEnrolling
                            ? "Enrolling..."
                            : "Start Task"}
                        </button>
                      )}

                      {enrollmentStatus ===
                        "enrolled" &&
                        !hasUserSubmitted &&
                        bounty.status === "active" && (
                          <button
                            onClick={() =>
                              setShowSubmitModal(true)
                            }
                            className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#151715] border border-[#d8d3c6] dark:border-white/10 text-[#292720] dark:text-white font-semibold hover:border-[#c49b2c] dark:hover:border-[#D4AF37]/60 transition-colors duration-300"
                          >
                            Submit Task
                          </button>
                        )}
                    </>
                  )}

                {/* Claim */}
                {canClaim() && (
                  <button
                    onClick={handleClaimReward}
                    disabled={
                      isContractPending ||
                      isContractConfirming
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition disabled:opacity-50"
                  >
                    {isContractPending
                      ? "Confirm in wallet..."
                      : isContractConfirming
                        ? "Confirming..."
                        : `Claim ${displayClaimable()} ${bounty.token}`}
                  </button>
                )}

                {/* Distribute */}
                {canDistribute() && (
                  <button
                    onClick={openDistributeModal}
                    disabled={!hasEnoughSelections()}
                    title={
                      hasEnoughSelections()
                        ? ""
                        : `Select exactly ${bounty.winnersAllowed} winner${
                            bounty.winnersAllowed > 1 ? "s" : ""
                          }`
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] dark:bg-[#e0bd45] text-[#171714] font-semibold hover:bg-[#c49b2c] dark:hover:bg-[#d2ac2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Distribute Reward
                    {selectedWinners.length > 0 && (
                      <span className="ml-2 text-xs text-[#d4af37]">
                        ({selectedWinners.length}/{bounty.winnersAllowed})
                      </span>
                    )}
                  </button>
                )}

                {/* Submission status */}
                {hasUserSubmitted &&
                  userSubmission && (
                    <div className="px-4 py-2.5 rounded-xl bg-[#f4ecd5] dark:bg-[#2b2510] border border-[#e5d9b8] dark:border-[#D4AF37]/30 text-[#8f6c12] dark:text-[#D4AF37] text-xs font-semibold flex items-center gap-2">
                      {userSubmission.status ===
                        "pending" && (
                        <>
                          <FiClock size={13} />
                          Submission Pending
                        </>
                      )}

                      {userSubmission.status ===
                        "accepted" && (
                        <>
                          <FiCheck size={13} />
                          Accepted
                        </>
                      )}

                      {userSubmission.status ===
                        "rejected" && (
                        <>
                          <FiX size={13} />
                          Rejected
                        </>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Submission card */}
          {hasUserSubmitted &&
            userSubmission && (
              <div className={cardClass}>
                <div className="p-6 md:p-8">
                  <h3 className="font-bold text-[#171714] dark:text-white mb-3">
                    Your Submission
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="text-[#4f4b43] dark:text-white/65">
                      <strong className="text-[#171714] dark:text-white">
                        Description:
                      </strong>{" "}
                      {userSubmission.description}
                    </p>

                    <p className="text-[#4f4b43] dark:text-white/65">
                      <strong className="text-[#171714] dark:text-white">
                        Link:
                      </strong>{" "}
                      <a
                        href={userSubmission.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9a7619] dark:text-[#D4AF37] hover:underline break-all"
                      >
                        {userSubmission.projectLink}
                      </a>
                    </p>

                    {userSubmission.image && (
                      <a
                        href={userSubmission.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9a7619] dark:text-[#D4AF37] hover:underline text-sm inline-block"
                      >
                        View Submission Image
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Winners */}
          {winnersData?.isDistributed &&
            winnersData.winners.length > 0 && (
              <div className={cardClass}>
                <div className="p-6 md:p-8">
                  <h3 className="font-bold text-[#171714] dark:text-white mb-4 flex items-center gap-2">
                    <FiUsers className="text-[#b28b20] dark:text-[#D4AF37]" />
                    Rewards Distributed
                  </h3>

                  <div className="space-y-3">
                    {winnersData.winners.map(
                      (winner, idx) => {
                        const isCurrentUser =
                          address &&
                          winner.address.toLowerCase() ===
                            address.toLowerCase();

                        const isClaimed =
                          winnersData.claimed?.some(
                            (c) =>
                              c.address.toLowerCase() ===
                              winner.address.toLowerCase(),
                          );

                        return (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 py-3 border-b border-[#e7e3da] dark:border-white/10 last:border-0"
                          >
                            <span className="font-mono text-xs text-[#625e55] dark:text-white/55 break-all">
                              {shortenAddress(
                                winner.address,
                              )}
                            </span>

                            <div className="flex items-center gap-3">
                              <span className="text-[#8f6c12] dark:text-[#D4AF37] font-semibold text-sm">
                                {formatAmount(
                                  winner.amount,
                                )}{" "}
                                {bounty.token}
                              </span>

                              {isClaimed ? (
                                <span className="text-[#2e7d32] dark:text-[#81c784] text-xs font-semibold flex items-center gap-1">
                                  <FiCheck size={12} />
                                  Claimed
                                </span>
                              ) : isCurrentUser ? (
                                <span className="text-[#8f6c12] dark:text-[#D4AF37] text-xs font-semibold flex items-center gap-1">
                                  <FiClock size={12} />
                                  Ready to claim
                                </span>
                              ) : (
                                <span className="text-[#99958a] dark:text-white/35 text-xs flex items-center gap-1">
                                  <FiClock size={12} />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Submissions — creator only */}
          {isCreator && allSubmissions.length > 0 && (
            <div className={cardClass}>
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-[#171714] dark:text-white">
                      Submissions ({allSubmissions.length})
                    </h3>
                    <p className="mt-1 text-sm text-[#777267] dark:text-white/50">
                      Review entries submitted by participants and select the winner{bounty.winnersAllowed > 1 ? "s" : ""}.
                    </p>
                  </div>
                  {selectedWinners.length > 0 && (
                    <span className="w-fit whitespace-nowrap text-xs font-semibold text-[#8f6c12] dark:text-[#D4AF37] bg-[#f4ecd5] dark:bg-[#2b2510] border border-[#e5d9b8] dark:border-[#D4AF37]/30 px-3 py-1.5 rounded-full">
                      {selectedWinners.length} / {bounty.winnersAllowed}{" "}
                      selected
                    </span>
                  )}
                </div>

                {/* Selection order — critical for MULTI_PERCENTAGE */}
                {selectedWinners.length > 0 &&
                  bounty.payoutType === "MULTI_PERCENTAGE" &&
                  bounty.percentages?.length > 0 && (
                    <div className="mb-5 p-4 rounded-2xl bg-[#fbfaf6] dark:bg-[#151715] border border-[#e7e3da] dark:border-white/10">
                      <p className="text-xs uppercase tracking-wider text-[#8b8579] dark:text-white/40 mb-2">
                        Selection order (maps to percentages)
                      </p>
                      <div className="space-y-1">
                        {selectedWinners.map((s, idx) => (
                          <div
                            key={s.address}
                            className="flex justify-between text-xs text-[#4f4b43] dark:text-white/65"
                          >
                            <span className="font-mono">
                              {idx + 1}. {shortenAddress(s.address)}
                            </span>
                            <span className="font-semibold text-[#8f6c12] dark:text-[#D4AF37]">
                              {bounty.percentages[idx]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="space-y-3">
                  {allSubmissions.map((submission) => {
                    const selected = isSelected(submission.user);
                    const selectionIndex = selectedWinners.findIndex(
                      (s) => s.address === submission.user.toLowerCase(),
                    );
                    return (
                      <div
                        key={submission._id}
                        className={`p-4 rounded-xl border transition ${
                          selected
                            ? "bg-[#fbf7e9] dark:bg-[#2b2510] border-[#d4af37] dark:border-[#D4AF37]/60 shadow-[0_8px_28px_rgba(212,175,55,0.08)]"
                            : "bg-[#fbfaf6] dark:bg-[#151715] border-[#e7e3da] dark:border-white/10 hover:border-[#d4af37]/60 dark:hover:border-[#D4AF37]/40"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-sm text-[#171714] dark:text-white font-semibold">
                                {shortenAddress(submission.user)}
                              </span>
                              {selected && (
                                <span className="text-[10px] font-bold text-[#8f6c12] dark:text-[#D4AF37] bg-[#f4ecd5] dark:bg-[#332b12] border border-[#e5d9b8] dark:border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                                  #{selectionIndex + 1}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#4f4b43] dark:text-white/70 mb-2 leading-relaxed">
                              {submission.description}
                            </p>
                            <a
                              href={submission.projectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex max-w-full items-center gap-1 text-xs text-[#9a7619] dark:text-[#D4AF37] hover:underline break-all"
                            >
                              {submission.projectLink}
                            </a>
                            {submission.image && (
                              <a
                                href={submission.image}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#9a7619] dark:text-[#D4AF37] hover:underline"
                              >
                                View Image
                              </a>
                            )}
                          </div>

                          <button
                            onClick={() => toggleWinnerSelection(submission)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                              selected
                                ? "bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] border border-[#171714] dark:border-[#D4AF37]"
                                : "bg-white dark:bg-[#1b1e1b] border border-[#d8d3c6] dark:border-white/15 text-[#4f4b43] dark:text-white/75 hover:border-[#c49b2c] dark:hover:border-[#D4AF37] hover:text-[#8f6c12] dark:hover:text-[#D4AF37]"
                            }`}
                          >
                            {selected ? "Selected" : "Select"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedWinners.length > 0 && (
                  <button
                    onClick={() => setSelectedWinners([])}
                    className="mt-5 text-xs text-[#8b8579] dark:text-white/45 hover:text-[#c62828] dark:hover:text-[#ef9a9a] transition"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className={cardClass}>
            <div className="p-6 md:p-8">
              <h3 className="font-bold text-[#171714] dark:text-white mb-4">
                Comments
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {comments.length === 0 ? (
                  <p className="text-[#99958a] dark:text-white/35 text-center py-4 text-sm">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={
                        comment._id || comment.id
                      }
                      className="p-3 bg-[#fbfaf6] dark:bg-[#151715] border border-[#e7e3da] dark:border-white/10 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-semibold text-[#8f6c12] dark:text-[#D4AF37] text-sm">
                          {shortenAddress(
                            comment.user,
                          )}
                        </span>

                        <span className="text-xs text-[#99958a] dark:text-white/35">
                          {formatDateTime(
                            comment.createdAt ||
                              comment.timestamp,
                          )}
                        </span>
                      </div>

                      <p className="text-[#4f4b43] dark:text-white/65 text-sm">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) =>
                    setNewComment(e.target.value)
                  }
                  placeholder="Add a comment..."
                  className={inputClass}
                />

                <button
                  onClick={handleAddComment}
                  className="px-5 py-3 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Submit modal */}
      {showSubmitModal && (
        <div
          className="app-modal-overlay fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="app-modal-panel bg-[#f9f8f3] dark:bg-[#111311] border border-[#ddd8ca] dark:border-white/10 rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-[#171714] dark:text-white">
                Submit Task
              </h2>

              <button
                onClick={() =>
                  setShowSubmitModal(false)
                }
                className="w-9 h-9 rounded-xl border border-[#ddd8ca] dark:border-white/10 bg-white dark:bg-[#151715] flex items-center justify-center text-[#777267] dark:text-white/50 hover:text-[#171714] dark:hover:text-white hover:border-[#c49b2c] dark:hover:border-[#D4AF37]/50 transition"
              >
                <FiX size={16} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] dark:text-white/45 mb-2">
                  Upload Image (Max 5MB)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-white dark:bg-[#151715] border border-[#ddd8ca] dark:border-white/10 rounded-xl px-4 py-3 text-[#171714] dark:text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:bg-[#171714] dark:file:bg-[#D4AF37] file:text-[#d4af37] dark:file:text-[#171714] file:border-0 file:font-semibold"
                />

                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-32 rounded-xl border border-[#ddd8ca] dark:border-white/10"
                    />

                    {imageSizeWarning && (
                      <p className="text-xs text-[#c62828] dark:text-[#ef9a9a] mt-1">
                        {imageSizeWarning}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] dark:text-white/45 mb-2">
                  Description
                </label>

                <input
                  type="text"
                  value={submissionDescription}
                  onChange={(e) =>
                    setSubmissionDescription(
                      e.target.value,
                    )
                  }
                  placeholder="What did you do?"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] dark:text-white/45 mb-2">
                  Proof Link
                </label>

                <input
                  type="url"
                  value={submissionLink}
                  onChange={(e) =>
                    setSubmissionLink(e.target.value)
                  }
                  placeholder="https://..."
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Distribute modal */}
      {showDistributeModal && bounty && (
        <div
          className="app-modal-overlay fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() =>
            setShowDistributeModal(false)
          }
        >
          <div
            className="app-modal-panel bg-[#f9f8f3] dark:bg-[#111311] border border-[#ddd8ca] dark:border-white/10 rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-[#171714] dark:text-white">
                Distribute Reward
              </h3>

              <button
                onClick={() =>
                  setShowDistributeModal(false)
                }
                className="w-9 h-9 rounded-xl border border-[#ddd8ca] dark:border-white/10 bg-white dark:bg-[#151715] flex items-center justify-center text-[#777267] dark:text-white/50 hover:text-[#171714] dark:hover:text-white hover:border-[#c49b2c] dark:hover:border-[#D4AF37]/50 transition"
              >
                <FiX size={16} />
              </button>
            </div>

            <p className="text-[#625e55] dark:text-white/60 text-sm mb-1">
              Bounty:{" "}
              <strong className="text-[#171714] dark:text-white">
                {bounty.title}
              </strong>
            </p>

            <p className="text-[#625e55] dark:text-white/60 text-sm mb-5">
              Reward:{" "}
              <strong className="text-[#8f6c12] dark:text-[#D4AF37]">
                {formatAmount(bounty.reward)}{" "}
                {bounty.token}
              </strong>
            </p>

            <div className="space-y-4 mb-5">
              {winnerAddresses.map(
                (addr, idx) => {
                  let amount = 0;

                  if (
                    bounty.payoutType ===
                    "MULTI_EQUAL"
                  ) {
                    amount =
                      bounty.reward /
                      bounty.winnersAllowed;
                  } else if (
                    bounty.payoutType ===
                      "MULTI_PERCENTAGE" &&
                    bounty.percentages?.[idx]
                  ) {
                    amount =
                      (bounty.reward *
                        bounty.percentages[idx]) /
                      100;
                  } else {
                    amount = bounty.reward;
                  }

                  return (
                    <div key={idx}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#6f6a60] dark:text-white/45 mb-2">
                        Winner {idx + 1} Address
                      </label>

                      <input
                        type="text"
                        value={addr}
                        onChange={(e) => {
                          const next = [
                            ...winnerAddresses,
                          ];

                          next[idx] =
                            e.target.value;

                          setWinnerAddresses(next);
                        }}
                        placeholder="0x..."
                        className={inputClass}
                      />

                      {amount > 0 && (
                        <p className="text-[#8f6c12] dark:text-[#D4AF37] text-xs mt-1.5">
                          Will receive:{" "}
                          {formatAmount(amount)}{" "}
                          {bounty.token}
                        </p>
                      )}
                    </div>
                  );
                },
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setShowDistributeModal(false)
                }
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#151715] border border-[#d9d4c8] dark:border-white/10 text-[#555047] dark:text-white/70 font-semibold hover:bg-[#f4f2ec] dark:hover:bg-[#1b1e1b] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDistributeReward}
                disabled={
                  distributing ||
                  isContractPending ||
                  isContractConfirming
                }
                className="flex-1 px-4 py-3 rounded-xl bg-[#171714] dark:bg-[#D4AF37] text-[#d4af37] dark:text-[#171714] font-semibold hover:bg-[#292922] dark:hover:bg-[#B8962E] transition disabled:opacity-50"
              >
                {distributing
                  ? "Distributing..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BountyDetail;
