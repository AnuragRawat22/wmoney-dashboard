import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles,
  Bell,
  X,
  Wallet,
  Activity as ActivityIcon,
} from "lucide-react";
import { Transaction, Subscription } from "../../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DailyAllowance from "./DailyAllowance";
import { Card, Button } from "../common/UIComponents";
import AnimatedCounter from "../common/AnimatedCounter";
interface DashboardProps {
  transactions: Transaction[];
  subscriptions: Subscription[];
  stats: {
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
  };
  onViewAnalytics: () => void;
}
const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  subscriptions,
  stats,
  onViewAnalytics,
}) => {
  const [chartRange, setChartRange] = useState<"week" | "month">("week");
  const [activeModal, setActiveModal] = useState<
    "net" | "spend" | "insight" | null
  >(null);
  const chartData = useMemo(() => {
    const now = new Date();
    const rangeInDays = chartRange === "week" ? 7 : 30;
    const dataPoints = [];
    for (let i = rangeInDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayTotal = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(dateStr))
        .reduce((sum, t) => sum + t.amount, 0);
      dataPoints.push({
        name:
          chartRange === "week"
            ? d.toLocaleDateString(undefined, { weekday: "short" })
            : d.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              }),
        amount: dayTotal,
        fullDate: dateStr,
      });
    }
    return dataPoints;
  }, [transactions, chartRange]);
  const sparklinePath = useMemo(() => {
    if (chartData.length === 0) return "";
    const max = Math.max(...chartData.map((d) => d.amount));
    const min = Math.min(...chartData.map((d) => d.amount));
    const range = max - min || 1;
    const dx = 100 / Math.max(chartData.length - 1, 1);
    const pts = chartData.map((d, i) => {
      const y = 30 - ((d.amount - min) / range) * 30;
      return `${i * dx},${y}`;
    });
    return `M ${pts.join(" L ")}`;
  }, [chartData]);
  const upcomingRenewals = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [...subscriptions]
      .map((s) => {
        const renewal = new Date(s.nextRenewal);
        renewal.setHours(0, 0, 0, 0);
        const diff = Math.ceil(
          (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        return { ...s, daysLeft: diff };
      })
      .filter((s) => s.daysLeft >= 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  }, [subscriptions]);
  return (
    <div className="space-y-8 animate-in fade-in duration-700 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-[24px] p-6 shadow-2xl">
      {}
      <button
        onClick={() => setActiveModal("net")}
        className="w-full text-left transition-transform active:scale-[0.98]"
      >
        <Card
          className="bg-card-navy/80 spending-card-glow border-white/10 flex flex-col justify-between h-[200px]"
          innerClassName="p-8"
        >
          {}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 400 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 160C40 140 80 180 120 150C160 120 200 140 240 100C280 60 320 80 360 40C380 20 400 30 400 30V200H0V160Z"
                fill="url(#grad1)"
                fillOpacity="0.3"
              ></path>
              <path
                d="M0 160C40 140 80 180 120 150C160 120 200 140 240 100C280 60 320 80 360 40C380 20 400 30 400 30"
                stroke="#10b981"
                strokeLinecap="round"
                strokeOpacity="0.6"
                strokeWidth="2.5"
              ></path>
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "#10b981", stopOpacity: 1 }}
                  ></stop>
                  <stop
                    offset="100%"
                    style={{ stopColor: "#10b981", stopOpacity: 0 }}
                  ></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  Total Balance
                </p>
                <div className="flex items-end gap-3">
                  <h2 className="text-[42px] font-black tracking-tighter text-white leading-none drop-shadow-md pb-1">
                    $<AnimatedCounter value={stats.balance} />
                  </h2>
                  <svg
                    className="w-16 h-8 opacity-70 pb-2"
                    viewBox="0 0 100 30"
                    preserveAspectRatio="none"
                  >
                    <path
                      d={sparklinePath}
                      fill="none"
                      stroke="currentColor"
                      className="text-emerald-green"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-royal-amethyst/20 backdrop-blur-md p-3 rounded-2xl border border-royal-amethyst/30 text-royal-amethyst shadow-lg shadow-royal-amethyst/20">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-green/10 rounded-xl flex items-center justify-center border border-emerald-green/20">
                <ArrowUpCircle size={18} className="text-emerald-green" />
              </div>
              <div>
                <p className="text-white/30 text-[9px] uppercase font-black tracking-widest leading-none mb-1">
                  Income
                </p>
                <p className="font-bold text-white text-sm">
                  ${stats.incomeTotal.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-sunset-rose/10 rounded-xl flex items-center justify-center border border-sunset-rose/20">
                <ArrowDownCircle size={18} className="text-sunset-rose" />
              </div>
              <div>
                <p className="text-white/30 text-[9px] uppercase font-black tracking-widest leading-none mb-1">
                  Expenses
                </p>
                <p className="font-bold text-white text-sm">
                  ${stats.expenseTotal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </button>
      {}
      <button
        onClick={() => setActiveModal("insight")}
        className="w-full text-left transition-transform active:scale-[0.98]"
      >
        <DailyAllowance balance={stats.balance} subscriptions={subscriptions} />
      </button>
      {}
      <Card
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) {
            setActiveModal("spend");
          }
        }}
        className="p-7 relative overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
      >
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Activity
            </h3>
            <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mt-0.5">
              Spend Patterns
            </p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner">
            <Button
              variant={chartRange === "week" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartRange("week")}
              className={
                chartRange === "week" ? "bg-white text-midnight-navy" : ""
              }
            >
              Weekly
            </Button>
            <Button
              variant={chartRange === "month" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartRange("month")}
              className={
                chartRange === "month" ? "bg-white text-midnight-navy" : ""
              }
            >
              Month
            </Button>
          </div>
        </div>
        <div className="h-48 w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9d4edd" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.03)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "rgba(255,255,255,0.3)",
                  fontWeight: 800,
                }}
                minTickGap={10}
                dy={10}
              />
              <Tooltip
                cursor={{ stroke: "rgba(157, 78, 221, 0.2)", strokeWidth: 1.5 }}
                contentStyle={{
                  borderRadius: "24px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "#121726",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                  padding: "12px 16px",
                }}
                itemStyle={{
                  color: "#9d4edd",
                  fontWeight: 900,
                  fontSize: "12px",
                }}
                labelStyle={{
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: "4px",
                  fontSize: "10px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "SPEND"]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#9d4edd"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorAmount)"
                animationDuration={1500}
                strokeLinecap="round"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Button
          variant="secondary"
          className="w-full mt-8"
          onClick={onViewAnalytics}
          rightIcon={<ChevronRight size={14} />}
        >
          View Analytics
        </Button>
      </Card>
      {}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black text-white tracking-tight">
            Renewals
          </h3>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            Upcoming
          </span>
        </div>
        {upcomingRenewals.length === 0 ? (
          <Card innerClassName="p-12 text-center border-dashed border-white/10">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={20} className="text-white/20" />
            </div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
              No pending renewals
            </p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {upcomingRenewals.map((sub) => (
              <Card
                key={sub.id}
                className={`transition-all ${sub.daysLeft <= 2 ? "bg-royal-amethyst/10 border-royal-amethyst/30 shadow-lg shadow-royal-amethyst/5" : "border-white/5"}`}
                innerClassName="p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform hover:scale-105 ${sub.daysLeft <= 2 ? "bg-royal-amethyst text-white shadow-royal-amethyst/30" : "bg-white/5 text-white/40 shadow-black/20"}`}
                  >
                    {sub.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base leading-none">
                        {sub.name}
                      </h4>
                      {sub.remindersEnabled && (
                        <div className="w-1.5 h-1.5 bg-royal-amethyst rounded-full animate-pulse shadow-[0_0_8px_rgba(157,78,221,0.6)]"></div>
                      )}
                    </div>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${sub.daysLeft <= 2 ? "text-royal-amethyst" : "text-white/30"}`}
                    >
                      {sub.daysLeft === 0
                        ? "Due Today"
                        : `In ${sub.daysLeft} days`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-base text-white">
                    ${sub.price.toFixed(2)}
                  </p>
                  <div
                    className={`inline-flex items-center px-2 py-0.5 rounded-full mt-1.5 border ${sub.daysLeft <= 2 ? "bg-royal-amethyst/20 border-royal-amethyst/40 text-royal-amethyst" : sub.daysLeft <= 5 ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-white/5 border-white/10 text-white/20"}`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-tighter">
                      {sub.daysLeft <= 2
                        ? "URGENT"
                        : sub.daysLeft <= 5
                          ? "SOON"
                          : "UPCOMING"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-midnight-navy/80 backdrop-blur-xl"
            onClick={() => setActiveModal(null)}
          ></div>
          <div className="relative w-full max-w-md bg-card-navy border-x border-t border-white/10 rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    activeModal === "net"
                      ? "bg-emerald-green/20 text-emerald-green"
                      : activeModal === "spend"
                        ? "bg-sunset-rose/20 text-sunset-rose"
                        : "bg-royal-amethyst/20 text-royal-amethyst"
                  }`}
                >
                  {activeModal === "net" ? (
                    <Wallet size={20} />
                  ) : activeModal === "spend" ? (
                    <ActivityIcon size={20} />
                  ) : (
                    <Sparkles size={20} />
                  )}
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {activeModal === "net"
                    ? "Net Worth"
                    : activeModal === "spend"
                      ? "Spend Analysis"
                      : "Daily Allowance"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-white/5 p-2 rounded-xl text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            {}
            <div className="space-y-6">
              {activeModal === "net" && (
                <div className="space-y-6">
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                    <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2">
                      Liquid Assets
                    </p>
                    <p className="text-3xl font-black text-white">
                      ${stats.incomeTotal.toLocaleString()}
                    </p>
                    <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-green w-[70%]" />
                    </div>
                  </div>
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                    <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2">
                      Liability (Reserved)
                    </p>
                    <p className="text-3xl font-black text-sunset-rose">
                      -${stats.expenseTotal.toLocaleString()}
                    </p>
                    <div className="mt-4 h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-sunset-rose w-[30%]" />
                    </div>
                  </div>
                </div>
              )}
              {activeModal === "spend" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[24px] bg-white/5 border border-white/5">
                      <p className="text-white/40 text-[9px] uppercase font-black mb-1">
                        Top Category
                      </p>
                      <p className="text-lg font-black text-white">Food</p>
                    </div>
                    <div className="p-5 rounded-[24px] bg-white/5 border border-white/5">
                      <p className="text-white/40 text-[9px] uppercase font-black mb-1">
                        Frequency
                      </p>
                      <p className="text-lg font-black text-white">4x / week</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                    <h4 className="text-xs font-black uppercase text-white/60 mb-4">
                      Biggest Spenders
                    </h4>
                    <div className="space-y-4">
                      {transactions
                        .filter((t) => t.type === "expense")
                        .slice(0, 3)
                        .map((t) => (
                          <div
                            key={t.id}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-bold text-white/80">
                              {t.title}
                            </span>
                            <span className="text-sm font-black text-white">
                              ${t.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {activeModal === "insight" && (
                <div className="space-y-6">
                  <div className="p-6 rounded-[32px] bg-white/5 border border-white/5">
                    <h4 className="text-emerald-green font-black uppercase text-[10px] tracking-widest mb-3">
                      Savings Goal
                    </h4>
                    <p className="text-white/60 text-xs font-bold leading-relaxed">
                      Maintaining your safe daily spend limit will allow you to
                      complete the semester with your target balance intact.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={() => setActiveModal(null)}
              className="w-full mt-10"
              size="lg"
            >
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
