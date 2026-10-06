
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiCode,
  FiCopy,
  FiDollarSign,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiLayers,
  FiMenu,
  FiSearch,
  FiShield,
  FiX,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "how-it-works", label: "How Happy Bounty Works" },
      { id: "getting-started", label: "Getting Started" },
    ],
  },
  {
    title: "Using Happy Bounty",
    items: [
      { id: "discover-bounties", label: "Discover Bounties" },
      { id: "create-bounty", label: "Create a Bounty" },
      { id: "submit-work", label: "Submit Your Work" },
      { id: "rewards", label: "Rewards & USDC" },
    ],
  },
  {
    title: "Technical",
    items: [
      { id: "arc", label: "Built on Arc" },
      { id: "bounty-types", label: "Bounty Types" },
      { id: "statuses", label: "Bounty Statuses" },
      { id: "fees", label: "Fees" },
      { id: "smart-contract", label: "Smart Contract" },
    ],
  },
  {
    title: "Resources",
    items: [
      { id: "faq", label: "FAQ" },
      { id: "developers", label: "For Developers" },
    ],
  },
];

const codeExample = `// Example bounty structure

{
  "title": "Build a landing page",
  "description": "Create a modern landing page",
  "reward": "500 USDC",
  "payoutType": "SINGLE",
  "maxWinners": 1,
  "network": "Arc"
}`;

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#B28B20]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
        {title}
      </h2>

      {children && (
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-black/60 dark:text-white/60">
          {children}
        </p>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="group rounded-2xl border border-black/[0.08] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_15px_50px_rgba(212,175,55,0.10)] dark:border-white/[0.08] dark:bg-[#111311]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#B28B20]">
        <Icon size={19} />
      </div>

      <h3 className="font-semibold text-black dark:text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
        {children}
      </p>
    </div>
  );
}

function StepCard({ number, title, children }) {
  return (
    <div className="relative rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-sm font-bold text-black">
          {number}
        </div>

        <h3 className="font-semibold text-black dark:text-white">{title}</h3>
      </div>

      <p className="text-sm leading-6 text-black/60 dark:text-white/60">
        {children}
      </p>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={copyText}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:bg-white/10"
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/[0.08] dark:border-white/[0.08]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="font-medium text-black dark:text-white">
          {question}
        </span>

        <FiChevronDown
          className={`shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-3xl text-sm leading-7 text-black/60 dark:text-white/60">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Docs() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("introduction");

  /*
   * Automatically detect which documentation section
   * is currently visible while the user scrolls.
   */
  useEffect(() => {
    const sectionIds = sections.flatMap((section) =>
      section.items.map((item) => item.id)
    );

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      let currentSection = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);

        if (!element) continue;

        if (element.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenu(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f5ef] text-black dark:bg-[#080908] dark:text-white">
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-[#f6f5ef]/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#080908]/90">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenu(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 transition hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 lg:hidden"
            >
              <FiMenu size={18} />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 font-bold tracking-tight"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37] text-black">
                <FiZap size={17} />
              </div>

              <span className="hidden sm:block">Happy Bounty</span>

              <span className="hidden rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#B28B20] sm:block">
                Docs
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              <FiArrowLeft size={15} />
              Back to Happy Bounty
            </Link>

            <div className="h-5 w-px bg-black/10 dark:bg-white/10" />

            <a
              href="https://github.com/Osfoce/Bounty_on_Arc_Network"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-black/60 transition hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              <FiGithub size={16} />
              GitHub
              <FiExternalLink size={13} />
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px]">
        {/* DESKTOP SIDEBAR */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 overflow-y-auto border-r border-black/[0.08] px-6 py-8 dark:border-white/[0.08] lg:block">
          <div className="mb-6">
            <div className="relative">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search docs..."
                className="h-10 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-black/35 focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111311] dark:placeholder:text-white/30"
              />
            </div>
          </div>

          <nav className="space-y-7">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40 dark:text-white/35">
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-lg px-3 py-2 text-left text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-[#D4AF37]/10 font-medium text-[#9B7610] dark:bg-[#D4AF37]/10"
                            : "text-black/55 hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                      >
                        {/* Animated active bar */}
                        <span
                          className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[#D4AF37] transition-all duration-300 ${
                            isActive
                              ? "scale-y-100 opacity-100"
                              : "scale-y-0 opacity-0"
                          }`}
                        />

                        <span
                          className={`transition-all duration-300 ${
                            isActive
                              ? "translate-x-1"
                              : "translate-x-0"
                          }`}
                        >
                          {item.label}
                        </span>

                        <FiChevronRight
                          size={14}
                          className={`transition-all duration-300 ${
                            isActive
                              ? "translate-x-0 opacity-100 text-[#B28B20]"
                              : "-translate-x-1 opacity-0"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenu && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenu(false)}
            />

            <aside className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[#f6f5ef] p-5 shadow-2xl dark:bg-[#0d0e0d]">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37] text-black">
                    <FiZap size={17} />
                  </div>

                  Documentation
                </div>

                <button
                  onClick={() => setMobileMenu(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10"
                >
                  <FiX size={18} />
                </button>
              </div>

              <div className="relative mb-7">
                <FiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search docs..."
                  className="h-10 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#111311]"
                />
              </div>

              <nav className="space-y-7">
                {filteredSections.map((section) => (
                  <div key={section.title}>
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40 dark:text-white/35">
                      {section.title}
                    </p>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`relative flex w-full overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-300 ${
                              isActive
                                ? "bg-[#D4AF37]/10 font-medium text-[#9B7610]"
                                : "text-black/60 dark:text-white/60"
                            }`}
                          >
                            <span
                              className={`absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[#D4AF37] transition-all duration-300 ${
                                isActive
                                  ? "scale-y-100 opacity-100"
                                  : "scale-y-0 opacity-0"
                              }`}
                            />

                            <span
                              className={`transition-transform duration-300 ${
                                isActive
                                  ? "translate-x-1"
                                  : "translate-x-0"
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-4xl px-5 py-12 md:px-10 md:py-16 lg:px-14">
            {/* INTRO */}
            <section
              id="introduction"
              className="scroll-mt-28 transition-all duration-500"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#9B7610]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                BUILT ON ARC 
              </div>

              <h1 className="max-w-4xl text-4xl font-bold tracking-[-0.04em] text-black dark:text-white md:text-6xl">
                Happy Bounty
                <span className="block text-[#B28B20]">
                  Documentation
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-black/60 dark:text-white/60 md:text-lg">
                A practical guide to discovering bounties, contributing your
                skills, creating tasks, and earning USDC on Happy Bounty.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollToSection("getting-started")}
                  className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black/90 dark:bg-white dark:text-black"
                >
                  Get Started
                  <FiArrowUpRight size={16} />
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold transition hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111311]"
                >
                  Explore the Docs
                </button>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard icon={FiLayers} title="Bounties">
                  Discover open tasks created by teams, builders, and
                  organizations.
                </InfoCard>

                <InfoCard icon={FiDollarSign} title="USDC Rewards">
                  Complete accepted work and receive rewards through the
                  bounty payout flow.
                </InfoCard>

                <InfoCard icon={FiShield} title="On-Chain">
                  Happy Bounty uses Arc for blockchain-based payments and
                  settlement.
                </InfoCard>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section
              id="how-it-works"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Overview"
                title="How Happy Bounty Works."
              >
                Happy Bounty connects people who need work completed with
                contributors who have the skills to complete it.
              </SectionTitle>

              <div className="grid gap-4 md:grid-cols-2">
                <StepCard number="01" title="Discover">
                  Browse available bounties and find tasks that match your
                  skills, interests, and experience.
                </StepCard>

                <StepCard number="02" title="Contribute">
                  Enrol in a bounty and work on the requirements defined by
                  the bounty creator.
                </StepCard>

                <StepCard number="03" title="Complete">
                  Finish the requested work and submit your result for review.
                </StepCard>

                <StepCard number="04" title="Earn USDC">
                  When your submission is selected, your reward is processed
                  through the bounty payout system.
                </StepCard>
              </div>
            </section>

            {/* GETTING STARTED */}
            <section
              id="getting-started"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Start Here"
                title="Getting Started"
              >
                You can use Happy Bounty as either a bounty creator or a
                contributor.
              </SectionTitle>

              <div className="space-y-4">
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#B28B20]">
                      <FiCheck size={16} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        1. Connect your wallet
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-black/60 dark:text-white/60">
                        Connect a supported wallet to interact with Happy
                        Bounty and access your account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#B28B20]">
                      <FiCheck size={16} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        2. Choose what you want to do
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-black/60 dark:text-white/60">
                        Contributors can browse and complete bounties, while
                        creators can publish tasks and fund rewards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#B28B20]">
                      <FiCheck size={16} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        3. Start contributing or creating
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-black/60 dark:text-white/60">
                        Once connected, you can explore the platform and
                        participate in the bounty ecosystem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* DISCOVER */}
            <section
              id="discover-bounties"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Contributors"
                title="Discover Bounties"
              >
                Bounties represent individual tasks that need to be completed.
                Each bounty contains the information contributors need before
                deciding whether to participate.
              </SectionTitle>

              <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#111311]">
                <div className="grid border-b border-black/[0.08] bg-black/[0.025] px-5 py-4 text-xs font-bold uppercase tracking-wider text-black/40 dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-white/40 md:grid-cols-2">
                  <span>Bounty information</span>
                  <span className="hidden md:block">What it means</span>
                </div>

                {[
                  [
                    "Title",
                    "The name of the task that needs to be completed.",
                  ],
                  [
                    "Description",
                    "Requirements, expectations, and other task details.",
                  ],
                  ["Reward", "The amount allocated for successful work."],
                  ["Category", "The general area the bounty belongs to."],
                  [
                    "Tags",
                    "Additional labels that help contributors discover relevant work.",
                  ],
                ].map(([name, description]) => (
                  <div
                    key={name}
                    className="grid gap-2 border-b border-black/[0.06] px-5 py-4 last:border-0 dark:border-white/[0.06] md:grid-cols-2"
                  >
                    <span className="text-sm font-medium text-black dark:text-white">
                      {name}
                    </span>

                    <span className="text-sm text-black/55 dark:text-white/55">
                      {description}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* CREATE BOUNTY */}
            <section
              id="create-bounty"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Creators"
                title="Create a Bounty"
              >
                Bounty creators can define the work, reward amount, payout
                structure, and number of winners.
              </SectionTitle>

              <div className="grid gap-4 md:grid-cols-3">
                <InfoCard icon={FiDollarSign} title="Single Winner">
                  One contributor receives the bounty reward after their work
                  is selected.
                </InfoCard>

                <InfoCard icon={FiLayers} title="Equal Winners">
                  The reward can be distributed equally among multiple
                  selected contributors.
                </InfoCard>

                <InfoCard icon={FiZap} title="Percentage Winners">
                  The available reward can be distributed according to
                  configured percentages.
                </InfoCard>
              </div>

              <div className="mt-6 rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 p-6">
                <div className="flex gap-4">
                  <FiFileText
                    size={20}
                    className="mt-1 shrink-0 text-[#B28B20]"
                  />

                  <div>
                    <h3 className="font-semibold text-black dark:text-white">
                      Write clear requirements
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-black/65 dark:text-white/65">
                      Clear bounty descriptions help contributors understand
                      exactly what needs to be delivered and make the review
                      process easier.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SUBMIT */}
            <section
              id="submit-work"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Contributors"
                title="Submit Your Work"
              >
                After completing a bounty, contributors can submit their
                result for the bounty creator to review.
              </SectionTitle>

              <div className="space-y-3">
                {[
                  "Complete the requirements described by the bounty.",
                  "Prepare the requested deliverable or proof of work.",
                  "Submit your work through the bounty submission flow.",
                  "Wait for the bounty creator to review submissions.",
                  "If selected, receive the configured USDC reward.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-xl border border-black/[0.07] bg-white p-4 dark:border-white/[0.07] dark:bg-[#111311]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 text-xs font-bold text-[#9B7610]">
                      {index + 1}
                    </span>

                    <p className="pt-1 text-sm leading-6 text-black/65 dark:text-white/65">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* REWARDS */}
            <section
              id="rewards"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Payments"
                title="Rewards & USDC"
              >
                Happy Bounty uses USDC as the primary reward asset for bounty
                payments.
              </SectionTitle>

              <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#D4AF37]/15 via-white to-white p-7 dark:from-[#D4AF37]/10 dark:via-[#111311] dark:to-[#111311] md:p-9">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9B7610]">
                      Reward Asset
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-black dark:text-white">
                      USDC
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-black/60 dark:text-white/60">
                      Bounty rewards are denominated in USDC, allowing creators
                      and contributors to work with a familiar dollar-pegged
                      digital asset.
                    </p>
                  </div>

                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-white text-2xl font-bold text-[#B28B20] shadow-xl dark:bg-[#151715]">
                    $
                  </div>
                </div>
              </div>
            </section>

            {/* ARC */}
            <section
              id="arc"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle eyebrow="Network" title="Built on Arc">
                Happy Bounty is designed around Arc's infrastructure for
                blockchain-based settlement and USDC-powered transactions.
              </SectionTitle>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard icon={FiZap} title="USDC-Native">
                  Happy Bounty is designed around USDC as the main payment
                  asset for bounty rewards.
                </InfoCard>

                <InfoCard icon={FiShield} title="On-Chain Settlement">
                  Important payment actions can be represented and settled
                  through blockchain infrastructure.
                </InfoCard>

                <InfoCard icon={FiLayers} title="Fast Experience">
                  The platform is designed to make blockchain-powered bounty
                  payments feel simple to everyday users.
                </InfoCard>

                <InfoCard icon={FiDollarSign} title="Transparent Rewards">
                  Bounty reward amounts and payout structures can be clearly
                  defined before contributors participate.
                </InfoCard>
              </div>
            </section>

            {/* BOUNTY TYPES */}
            <section
              id="bounty-types"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Payouts"
                title="Bounty Types"
              >
                Happy Bounty supports different payout structures depending on
                how a creator wants to reward contributors.
              </SectionTitle>

              <div className="space-y-4">
                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        SINGLE
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
                        One selected winner receives the reward.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#9B7610]">
                      1 Winner
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        MULTI_EQUAL
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
                        The available reward is divided equally between
                        selected winners.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#9B7610]">
                      Multiple
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <div className="flex items-center justify-between gap-5">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        MULTI_PERCENTAGE
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
                        Selected winners receive portions of the reward based
                        on configured percentages.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-bold text-[#9B7610]">
                      Flexible
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* STATUSES */}
            <section
              id="statuses"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Lifecycle"
                title="Bounty Statuses"
              >
                A bounty moves through different stages during its lifecycle.
              </SectionTitle>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "Upcoming",
                    "The bounty has been created but is not active yet.",
                  ],
                  [
                    "Active",
                    "Contributors can participate and submit work.",
                  ],
                  [
                    "Completed",
                    "The bounty has finished and its outcome has been determined.",
                  ],
                ].map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#111311]"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />

                      <h3 className="font-semibold text-black dark:text-white">
                        {title}
                      </h3>
                    </div>

                    <p className="text-sm leading-6 text-black/55 dark:text-white/55">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* FEES */}
            <section
              id="fees"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle eyebrow="Costs" title="Fees">
                Fees depend on the bounty configuration and the current Happy
                Bounty protocol rules.
              </SectionTitle>

              <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                <div className="flex gap-4">
                  <FiDollarSign
                    className="mt-1 shrink-0 text-[#B28B20]"
                    size={21}
                  />

                  <div>
                    <h3 className="font-semibold text-black dark:text-white">
                      Protocol fee
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-black/60 dark:text-white/60">
                      The bounty payout flow may include a protocol fee as
                      defined by the Happy Bounty smart contract. Always check
                      the current contract configuration before relying on a
                      specific fee value.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SMART CONTRACT */}
<section
  id="smart-contract"
  className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
>
  <SectionTitle
    eyebrow="Blockchain"
    title="Smart Contract"
  >
    The smart contract handles the blockchain-side bounty and
    reward logic. The exact deployed contract address should be
    taken from the current Happy Bounty deployment configuration.
  </SectionTitle>

  <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#0d0e0d] shadow-xl dark:border-white/10">
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <FiCode size={15} className="text-[#D4AF37]" />

        <span className="text-xs text-white/50">
          bounty-example.json
        </span>
      </div>

      <CopyButton text={codeExample} />
    </div>

    <pre className="overflow-x-auto p-5 text-xs leading-7 text-white/80">
      <code>{codeExample}</code>
    </pre>
  </div>

  {/* VIEW SOURCE CODE */}
  <div className="mt-4">
    <a
      href="https://github.com/Osfoce/bounty-arc-solidity-contract"
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2.5 text-sm font-semibold text-[#9B7610] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 hover:shadow-[0_8px_25px_rgba(212,175,55,0.12)] dark:text-[#D4AF37]"
    >
      <FiGithub size={16} />

      <span>View Source Code</span>

      <FiExternalLink
        size={14}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  </div>
</section>


            {/* FAQ */}
            <section
              id="faq"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle eyebrow="Questions" title="FAQ" />

              <div className="rounded-2xl border border-black/[0.08] bg-white px-6 dark:border-white/[0.08] dark:bg-[#111311]">
                <FAQItem
                  question="What is Happy Bounty?"
                  answer="Happy Bounty is a bounty platform where creators can publish tasks and contributors can complete those tasks in exchange for rewards."
                />

                <FAQItem
                  question="What blockchain does Happy Bounty use?"
                  answer="Happy Bounty is built around Arc infrastructure and uses USDC as the primary reward asset."
                />

                <FAQItem
                  question="Do I need a wallet?"
                  answer="A wallet is required to interact with the blockchain-powered parts of the platform, including wallet connection and on-chain payment actions."
                />

                <FAQItem
                  question="What can I earn?"
                  answer="Bounty rewards are denominated in USDC. The reward amount depends on the individual bounty."
                />

                <FAQItem
                  question="Can multiple people win a bounty?"
                  answer="Yes. Happy Bounty supports single-winner, equal multi-winner, and percentage-based multi-winner payout structures."
                />

                <FAQItem
                  question="Can I create my own bounty?"
                  answer="Yes. Bounty creators can define the task, requirements, reward, payout structure, and winner configuration."
                />
              </div>
            </section>

            {/* DEVELOPERS */}
            <section
              id="developers"
              className="mt-28 scroll-mt-28 border-t border-black/[0.08] pt-20 dark:border-white/[0.08]"
            >
              <SectionTitle
                eyebrow="Builders"
                title="For Developers"
              >
                Developers can integrate with the Happy Bounty ecosystem or
                contribute to the project.
              </SectionTitle>

              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href="https://github.com/Osfoce/Bounty_on_Arc_Network"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-black/[0.08] bg-white p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/50 dark:border-white/[0.08] dark:bg-[#111311]"
                >
                  <FiGithub size={22} className="text-[#B28B20]" />

                  <h3 className="mt-5 font-semibold text-black dark:text-white">
                    GitHub
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
                    Explore the Happy Bounty source code, contribute changes,
                    and follow development.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#9B7610]">
                    View repository
                    <FiArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </a>

                <div className="rounded-2xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#111311]">
                  <FiBookOpen size={22} className="text-[#B28B20]" />

                  <h3 className="mt-5 font-semibold text-black dark:text-white">
                    Documentation
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-black/55 dark:text-white/55">
                    Use this documentation as the starting point for
                    understanding the platform and its bounty lifecycle.
                  </p>
                </div>
              </div>
            </section>

            {/* FOOTER CTA */}
            <section className="mt-28 border-t border-black/[0.08] pt-16 dark:border-white/[0.08]">
              <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-black p-8 text-white md:p-12">
                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-3xl" />

                <div className="relative">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-black">
                    <FiZap size={19} />
                  </div>

                  <h2 className="max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                    Ready to discover your next bounty?
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
                    Explore Happy Bounty, find work that matches your skills,
                    and start contributing to the ecosystem.
                  </p>

                  <Link
                    to="/"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#B8962E]"
                  >
                    Explore Happy Bounty
                    <FiArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </section>

            <footer className="py-12 text-center text-xs text-black/40 dark:text-white/35">
              © {new Date().getFullYear()} Happy Bounty. Built on Arc.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
