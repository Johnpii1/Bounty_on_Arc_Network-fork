import { useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import { FiActivity, FiBarChart2, FiCheckCircle, FiClock, FiDollarSign, FiRefreshCw, FiTarget, FiUsers, FiXCircle } from "react-icons/fi";
import NavBar from "../components/Layout/NavBar";
import Footer from "../components/Layout/Footer";

const num = (v) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Number(v) || 0);
const usdc = (v) => "$" + (Number(v) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USDC";
const label = (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : "Unknown";

function Card({ dark, icon: Icon, title, value, detail }) {
  return <div className={"group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4A017]/40 " + (dark ? "border-white/[0.07] bg-[#111311]/90" : "border-black/[0.08] bg-white/90")}>
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A017]/[0.07] blur-3xl transition-transform duration-500 group-hover:scale-125" />
    <div className="relative"><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4A017]/20 bg-[#D4A017]/[0.08] text-[#D4A017]"><Icon /></div>
    <p className={"text-[10px] font-bold uppercase tracking-[0.16em] " + (dark ? "text-white/40" : "text-black/40")}>{title}</p>
    <p className={"mt-2 text-2xl font-black " + (dark ? "text-white" : "text-[#111111]")}>{value}</p>
    {detail && <p className={"mt-2 text-xs " + (dark ? "text-white/35" : "text-black/40")}>{detail}</p>}</div>
  </div>;
}

function Bars({ dark, items }) {
  const max = Math.max(...items.map((x) => Number(x.count) || 0), 1);
  return <div className="space-y-4">{items.length === 0 ? <p className="text-sm opacity-50">No analytics data yet.</p> : items.slice(0, 8).map((item) => <div key={item.name}><div className="mb-1.5 flex justify-between gap-4"><span className="truncate text-xs font-semibold">{item.name}</span><span className="text-xs font-bold text-[#D4A017]">{num(item.count)}</span></div><div className={"h-2 overflow-hidden rounded-full " + (dark ? "bg-white/[0.06]" : "bg-black/[0.06]")}><div className="h-full rounded-full bg-[#D4A017]" style={{ width: Math.max((Number(item.count) / max) * 100, item.count ? 4 : 0) + "%" }} /></div></div>)}</div>;
}

function Analytics({ dark, setDark }) {
  const { address, isConnected } = useAccount();
  const API_URL = import.meta.env.VITE_API_URL;
  const [role, setRole] = useState("contributor");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const endpoint = role === "platform" ? API_URL + "/analytics/platform" : address ? API_URL + "/analytics/" + role + "/" + address : "";
  const load = async () => { if (!endpoint) return; setLoading(true); setError(""); try { const r = await axios.get(endpoint); setData(r.data); } catch (e) { console.error(e); setError("Unable to load analytics right now."); } finally { setLoading(false); } };
  useEffect(() => { load(); }, [endpoint]);

  const overview = data?.overview || {}; const submissions = data?.submissions || {}; const rewards = data?.rewards || {}; const platform = role === "platform";
  const surface = dark ? "border-white/[0.07] bg-[#111311]/90" : "border-black/[0.08] bg-white/90";

  return <div className={"min-h-screen transition-colors duration-500 " + (dark ? "bg-[#080908] text-white" : "bg-[#f6f5ef] text-[#111111]")}>
    <NavBar dark={dark} setDark={setDark} />
    <main className="mx-auto min-h-screen max-w-[1440px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="mb-3 flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#D4A017]" /><span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4A017]">Network Intelligence</span></div><h1 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl">Analytics</h1><p className={"mt-3 max-w-2xl text-sm leading-6 " + (dark ? "text-white/45" : "text-black/45")}>Understand bounty performance, contributor activity, submissions, and USDC rewards from real platform data.</p></div>
        <div className="flex flex-wrap items-center gap-2">{[["contributor","Contributor"],["creator","Creator"],["platform","Platform"]].map(([v,t]) => <button key={v} onClick={() => setRole(v)} disabled={v !== "platform" && !isConnected} className={"rounded-xl border px-4 py-2.5 text-xs font-bold transition-all " + (role === v ? "border-[#D4A017] bg-[#D4A017] text-white" : dark ? "border-white/[0.08] bg-[#111311]/80 text-white/45" : "border-black/[0.08] bg-white/80 text-black/45")}>{t}</button>)}<button onClick={load} disabled={loading} className={"flex h-10 w-10 items-center justify-center rounded-xl border " + (dark ? "border-white/[0.08] bg-[#111311]/80" : "border-black/[0.08] bg-white/80")}><FiRefreshCw className={loading ? "animate-spin" : ""} /></button></div>
      </header>
      {!isConnected && !platform && <div className="mb-6 rounded-2xl border border-[#D4A017]/20 bg-[#D4A017]/[0.05] p-4 text-sm opacity-70">Connect your wallet to view personal analytics.</div>}
      {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-red-400">{error}</div>}
      {loading ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((x) => <div key={x} className={"h-36 animate-pulse rounded-2xl border " + surface} />)}</div> : data && <>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card dark={dark} icon={FiTarget} title={platform ? "Total Bounties" : "Contributions"} value={num(platform ? overview.totalBounties : (overview.totalContributions ?? overview.bountiesCreated))} detail={platform ? num(overview.activeBounties) + " active now" : num(overview.totalSubmissions) + " submissions"} />
          <Card dark={dark} icon={FiDollarSign} title={platform ? "Reward Budget" : "Rewards"} value={usdc(platform ? overview.totalRewardBudget : (overview.claimedAmount ?? overview.totalClaimedAmount))} detail={platform ? usdc(overview.totalRewardsClaimed) + " claimed" : num(overview.rewardsClaimed) + " claimed"} />
          <Card dark={dark} icon={FiActivity} title="Submissions" value={num(overview.totalSubmissions)} detail={num(submissions.accepted) + " accepted"} />
          <Card dark={dark} icon={FiUsers} title={platform ? "Contributors" : "Success Rate"} value={platform ? num(overview.uniqueContributors) : num(overview.successRate) + "%"} detail={platform ? num(overview.uniqueCreators) + " creators" : num(submissions.rejected) + " rejected"} />
        </section>
        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className={"rounded-2xl border p-6 lg:col-span-2 " + surface}><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4A017]">Performance</p><h2 className="mt-1 text-lg font-black">{platform ? "Bounty Status" : "Submission Results"}</h2></div><FiBarChart2 className="text-xl text-[#D4A017]" /></div><Bars dark={dark} items={platform ? Object.entries(data.bountyStatus || {}).map(([name,count]) => ({name: label(name),count})) : Object.entries(submissions).map(([name,count]) => ({name: label(name),count}))} /></div>
          <div className={"rounded-2xl border p-6 " + surface}><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4A017]">Rewards</p><h2 className="mt-1 text-lg font-black">Distribution</h2></div></div><div className="space-y-3"><div className="flex justify-between rounded-xl border border-white/[0.06] p-4"><span className="flex items-center gap-2 text-sm font-semibold"><FiClock className="text-[#D4A017]" />Assigned</span><b>{num(rewards.assigned)}</b></div><div className="flex justify-between rounded-xl border border-white/[0.06] p-4"><span className="flex items-center gap-2 text-sm font-semibold"><FiCheckCircle className="text-[#D4A017]" />Claimed</span><b>{num(rewards.claimed)}</b></div></div></div>
        </section>
        {platform && <section className={"mt-5 rounded-2xl border p-6 " + surface}><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4A017]">Distribution</p><h2 className="mt-1 text-lg font-black">Bounties by Category</h2></div></div><Bars dark={dark} items={data.categories || []} /></section>}
        {!platform && <section className={"mt-5 rounded-2xl border p-6 " + surface}><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4A017]">Activity</p><h2 className="mt-1 text-lg font-black">Recent Activity</h2></div><div className="space-y-2">{(data.recentActivity || []).length === 0 ? <p className="text-sm opacity-50">No recent activity yet.</p> : data.recentActivity.map((a,i) => <div key={i} className={"flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between " + (dark ? "border-white/[0.06] bg-white/[0.02]" : "border-black/[0.06] bg-black/[0.015]")}><div><p className="text-sm font-bold">{a.title}</p><p className="mt-1 text-[11px] opacity-40">{label(a.type.replace("_"," "))} · {a.date ? new Date(a.date).toLocaleDateString() : "—"}</p></div>{a.amount !== undefined && <span className="text-sm font-black text-[#D4A017]">{usdc(a.amount)}</span>}{a.status && a.amount === undefined && <span className="text-xs font-bold text-[#D4A017]">{label(a.status)}</span>}</div>)}</div></section>}
        {platform && <section className={"mt-5 rounded-2xl border p-6 " + surface}><div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4A017]">Timeline</p><h2 className="mt-1 text-lg font-black">Monthly Activity</h2></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{(data.monthlyActivity || []).slice(-8).map((m) => <div key={m.month} className="rounded-xl border border-white/[0.06] p-4"><p className="text-[10px] font-bold text-[#D4A017]">{m.month}</p><p className="mt-3 text-lg font-black">{num(m.bounties)}</p><p className="text-[10px] opacity-40">bounties</p><div className="mt-3 text-[10px] opacity-60">{num(m.submissions)} submissions · {num(m.rewards)} rewards</div></div>)}</div></section>}
        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"><Card dark={dark} icon={FiCheckCircle} title="Accepted" value={num(submissions.accepted)} detail="Successful submissions" /><Card dark={dark} icon={FiClock} title="Pending" value={num(submissions.pending)} detail="Awaiting review" /><Card dark={dark} icon={FiXCircle} title="Rejected" value={num(submissions.rejected)} detail="Unsuccessful submissions" /></section>
      </>}
    </main>
    <Footer />
  </div>;
}

export default Analytics;