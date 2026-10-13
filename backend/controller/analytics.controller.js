const Bounty = require("../modules/bounty.module");
const Submission = require("../modules/submission.module");
const Enrollment = require("../modules/enrollment.module");
const Reward = require("../modules/reward.module");

const WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;

const isWallet = (value) =>
  typeof value === "string" && WALLET_REGEX.test(value);

const normalizeWallet = (value) => value.toLowerCase();

const getBountyStatus = (bounty, now = new Date()) => {
  if (bounty.lifecycleStatus === "completed") return "completed";
  if (bounty.lifecycleStatus === "cancelled") return "cancelled";

  const start = new Date(bounty.startDate);
  const deadline = new Date(bounty.deadline);

  if (now < start) return "upcoming";
  if (now <= deadline) return "active";
  return "ended";
};

const sumNumbers = (items, selector) =>
  items.reduce((total, item) => total + (Number(selector(item)) || 0), 0);

const uniqueValues = (items, selector) =>
  new Set(items.map(selector).filter(Boolean)).size;

const buildMonthlyActivity = (bounties, submissions, enrollments, rewards) => {
  const buckets = new Map();

  const add = (date, type) => {
    if (!date) return;

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return;

    const key = `${parsed.getUTCFullYear()}-${String(
      parsed.getUTCMonth() + 1,
    ).padStart(2, "0")}`;

    if (!buckets.has(key)) {
      buckets.set(key, {
        month: key,
        bounties: 0,
        submissions: 0,
        enrollments: 0,
        rewards: 0,
      });
    }

    buckets.get(key)[type] += 1;
  };

  bounties.forEach((item) => add(item.createdAt, "bounties"));
  submissions.forEach((item) => add(item.submittedAt, "submissions"));
  enrollments.forEach((item) => add(item.enrolledAt, "enrollments"));
  rewards.forEach((item) => add(item.assignedAt, "rewards"));

  return [...buckets.values()].sort((a, b) =>
    a.month.localeCompare(b.month),
  );
};

const platformAnalytics = async (req, res) => {
  try {
    const [bounties, submissions, enrollments, rewards] = await Promise.all([
      Bounty.find({}).lean(),
      Submission.find({}).lean(),
      Enrollment.find({}).lean(),
      Reward.find({}).lean(),
    ]);

    const now = new Date();

    const statusCounts = {
      upcoming: 0,
      active: 0,
      ended: 0,
      completed: 0,
      cancelled: 0,
    };

    const categoryMap = new Map();

    bounties.forEach((bounty) => {
      const status = getBountyStatus(bounty, now);
      statusCounts[status] += 1;

      const category = bounty.category || "Other";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const submissionCounts = {
      pending: submissions.filter((s) => s.status === "pending").length,
      accepted: submissions.filter((s) => s.status === "accepted").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    };

    const claimedRewards = rewards.filter((r) => r.status === "claimed");
    const assignedRewards = rewards.filter((r) => r.status === "assigned");

    const totalRewardBudget = sumNumbers(bounties, (b) => b.reward);
    const totalRewardsAssigned = sumNumbers(
      rewards,
      (r) => r.amountFormatted ?? 0,
    );
    const totalRewardsClaimed = sumNumbers(
      claimedRewards,
      (r) => r.amountFormatted ?? 0,
    );

    res.status(200).json({
      generatedAt: new Date().toISOString(),
      overview: {
        totalBounties: bounties.length,
        activeBounties: statusCounts.active,
        completedBounties: statusCounts.completed,
        cancelledBounties: statusCounts.cancelled,
        endedBounties: statusCounts.ended,
        upcomingBounties: statusCounts.upcoming,
        totalRewardBudget,
        totalRewardsAssigned,
        totalRewardsClaimed,
        totalSubmissions: submissions.length,
        totalEnrollments: enrollments.length,
        uniqueCreators: uniqueValues(bounties, (b) => b.creator),
        uniqueContributors: uniqueValues(
          submissions,
          (s) => s.user,
        ),
      },
      bountyStatus: statusCounts,
      submissions: submissionCounts,
      categories: [...categoryMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      rewards: {
        assigned: assignedRewards.length,
        claimed: claimedRewards.length,
        total: rewards.length,
        unclaimedAmount: sumNumbers(
          assignedRewards,
          (r) => r.amountFormatted ?? 0,
        ),
      },
      monthlyActivity: buildMonthlyActivity(
        bounties,
        submissions,
        enrollments,
        rewards,
      ),
    });
  } catch (error) {
    console.error("Failed to build platform analytics:", error);
    res.status(500).json({
      error: "Failed to fetch platform analytics",
      detail:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

const creatorAnalytics = async (req, res) => {
  const wallet = req.params.wallet;

  if (!isWallet(wallet)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const creator = normalizeWallet(wallet);

  try {
    const bounties = await Bounty.find({ creator }).sort({ createdAt: -1 }).lean();
    const bountyIds = bounties.map((b) => b._id);

    const [submissions, enrollments, rewards] = await Promise.all([
      Submission.find({ bountyId: { $in: bountyIds } })
        .sort({ submittedAt: -1 })
        .lean(),
      Enrollment.find({ bountyId: { $in: bountyIds } })
        .sort({ enrolledAt: -1 })
        .lean(),
      Reward.find({ bountyId: { $in: bountyIds } })
        .sort({ assignedAt: -1 })
        .lean(),
    ]);

    const statuses = bounties.map((bounty) => getBountyStatus(bounty));
    const accepted = submissions.filter((s) => s.status === "accepted").length;

    const categoryMap = new Map();
    bounties.forEach((bounty) => {
      const category = bounty.category || "Other";
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    const recentActivity = [
      ...bounties.slice(0, 8).map((b) => ({
        type: "bounty_created",
        title: b.title,
        date: b.createdAt,
        amount: Number(b.reward) || 0,
      })),
      ...submissions.slice(0, 8).map((s) => ({
        type: "submission",
        title: s.bountyTitle,
        date: s.submittedAt,
        status: s.status,
      })),
      ...rewards.slice(0, 8).map((r) => ({
        type: "reward",
        title: r.bountyTitle,
        date: r.claimedAt || r.assignedAt,
        status: r.status,
        amount: Number(r.amountFormatted) || 0,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.status(200).json({
      generatedAt: new Date().toISOString(),
      wallet: creator,
      overview: {
        bountiesCreated: bounties.length,
        activeBounties: statuses.filter((s) => s === "active").length,
        completedBounties: statuses.filter((s) => s === "completed").length,
        cancelledBounties: statuses.filter((s) => s === "cancelled").length,
        endedBounties: statuses.filter((s) => s === "ended").length,
        totalRewardBudget: sumNumbers(bounties, (b) => b.reward),
        totalSubmissions: submissions.length,
        totalEnrollments: enrollments.length,
        uniqueContributors: uniqueValues(
          submissions,
          (s) => s.user,
        ),
        acceptanceRate:
          submissions.length > 0
            ? Number(((accepted / submissions.length) * 100).toFixed(1))
            : 0,
        averageSubmissionsPerBounty:
          bounties.length > 0
            ? Number((submissions.length / bounties.length).toFixed(1))
            : 0,
      },
      submissions: {
        total: submissions.length,
        pending: submissions.filter((s) => s.status === "pending").length,
        accepted,
        rejected: submissions.filter((s) => s.status === "rejected").length,
      },
      categories: [...categoryMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      rewards: {
        assigned: rewards.filter((r) => r.status === "assigned").length,
        claimed: rewards.filter((r) => r.status === "claimed").length,
        totalAssignedAmount: sumNumbers(
          rewards,
          (r) => r.amountFormatted ?? 0,
        ),
        totalClaimedAmount: sumNumbers(
          rewards.filter((r) => r.status === "claimed"),
          (r) => r.amountFormatted ?? 0,
        ),
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Failed to build creator analytics:", error);
    res.status(500).json({
      error: "Failed to fetch creator analytics",
      detail:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

const contributorAnalytics = async (req, res) => {
  const wallet = req.params.wallet;

  if (!isWallet(wallet)) {
    return res.status(400).json({ error: "Invalid wallet address" });
  }

  const contributor = normalizeWallet(wallet);

  try {
    const [submissions, enrollments, rewards] = await Promise.all([
      Submission.find({ user: contributor }).sort({ submittedAt: -1 }).lean(),
      Enrollment.find({ user: contributor }).sort({ enrolledAt: -1 }).lean(),
      Reward.find({ winnerAddress: contributor })
        .sort({ assignedAt: -1 })
        .lean(),
    ]);

    const bountyIds = [
      ...new Set([
        ...submissions.map((s) => String(s.bountyId)),
        ...enrollments.map((e) => String(e.bountyId)),
        ...rewards.map((r) => String(r.bountyId)),
      ]),
    ];

    const bounties = await Bounty.find({
      _id: { $in: bountyIds },
    }).lean();

    const bountyMap = new Map(
      bounties.map((bounty) => [String(bounty._id), bounty]),
    );

    const accepted = submissions.filter((s) => s.status === "accepted").length;
    const claimedRewards = rewards.filter((r) => r.status === "claimed");
    const assignedRewards = rewards.filter((r) => r.status === "assigned");

    const contributions = bounties.map((bounty) => ({
      id: String(bounty._id),
      title: bounty.title,
      category: bounty.category,
      reward: Number(bounty.reward) || 0,
      status: getBountyStatus(bounty),
    }));

    const recentActivity = [
      ...submissions.map((s) => ({
        type: "submission",
        title: s.bountyTitle,
        date: s.submittedAt,
        status: s.status,
      })),
      ...enrollments.map((e) => ({
        type: "enrollment",
        title: bountyMap.get(String(e.bountyId))?.title || "Bounty",
        date: e.enrolledAt,
        status: e.status,
      })),
      ...rewards.map((r) => ({
        type: "reward",
        title: r.bountyTitle,
        date: r.claimedAt || r.assignedAt,
        status: r.status,
        amount: Number(r.amountFormatted) || 0,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.status(200).json({
      generatedAt: new Date().toISOString(),
      wallet: contributor,
      overview: {
        enrolledBounties: enrollments.length,
        totalContributions: bountyIds.length,
        totalSubmissions: submissions.length,
        pendingSubmissions: submissions.filter(
          (s) => s.status === "pending",
        ).length,
        acceptedSubmissions: accepted,
        rejectedSubmissions: submissions.filter(
          (s) => s.status === "rejected",
        ).length,
        successRate:
          submissions.length > 0
            ? Number(((accepted / submissions.length) * 100).toFixed(1))
            : 0,
        rewardsAssigned: rewards.length,
        rewardsClaimed: claimedRewards.length,
        assignedAmount: sumNumbers(
          rewards,
          (r) => r.amountFormatted ?? 0,
        ),
        claimedAmount: sumNumbers(
          claimedRewards,
          (r) => r.amountFormatted ?? 0,
        ),
      },
      submissions: {
        pending: submissions.filter((s) => s.status === "pending").length,
        accepted,
        rejected: submissions.filter((s) => s.status === "rejected").length,
      },
      rewards: {
        assigned: assignedRewards.length,
        claimed: claimedRewards.length,
        assignedAmount: sumNumbers(
          assignedRewards,
          (r) => r.amountFormatted ?? 0,
        ),
        claimedAmount: sumNumbers(
          claimedRewards,
          (r) => r.amountFormatted ?? 0,
        ),
      },
      contributions,
      recentActivity,
    });
  } catch (error) {
    console.error("Failed to build contributor analytics:", error);
    res.status(500).json({
      error: "Failed to fetch contributor analytics",
      detail:
        process.env.NODE_ENV !== "production" ? error.message : undefined,
    });
  }
};

module.exports = {
  platformAnalytics,
  creatorAnalytics,
  contributorAnalytics,
};
