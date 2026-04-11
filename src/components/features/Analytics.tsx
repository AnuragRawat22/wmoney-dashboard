import React, { useMemo, useState } from "react";
import { Transaction, Subscription } from "../../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  PieChart as PieIcon,
  LineChart as LineIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Download,
} from "lucide-react";
import { Card, Button } from "../common/UIComponents";
interface AnalyticsProps {
  transactions: Transaction[];
  subscriptions: Subscription[];
}
const SOMA_COLORS = [
  "#9d4edd",
  "#10b981",
  "#FF7E9D",
  "#6366f1",
  "#fbbf24",
  "#f472b6",
  "#a855f7",
];
const Analytics: React.FC<AnalyticsProps> = ({
  transactions,
  subscriptions,
}) => {
  const [activeView, setActiveView] = useState<"trends" | "categories">(
    "trends",
  );
  const [trendRange, setTrendRange] = useState<"week" | "month">("month");
  const stats = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");
    const expenseTotal = expenses.reduce((sum, t) => sum + t.amount, 0);
    const incomeTotal = income.reduce((sum, t) => sum + t.amount, 0);
    const categoryData = expenses.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const pieData = Object.keys(categoryData)
      .map((cat) => ({
        name: cat,
        value: categoryData[cat],
      }))
      .sort((a, b) => b.value - a.value);
    return {
      expenseTotal,
      incomeTotal,
      pieData,
      transactionCount: transactions.length,
    };
  }, [transactions]);
  const trendData = useMemo(() => {
    const now = new Date();
    const rangeInDays = trendRange === "week" ? 7 : 30;
    const dataPoints = [];
    for (let i = rangeInDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const exp = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(dateStr))
        .reduce((sum, t) => sum + t.amount, 0);
      dataPoints.push({
        date:
          trendRange === "week"
            ? d.toLocaleDateString(undefined, { weekday: "short" })
            : d.toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              }),
        spend: exp,
        fullDate: dateStr,
      });
    }
    return dataPoints;
  }, [transactions, trendRange]);
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      <div className="flex items-center gap-4 px-2">
        <div className="w-14 h-14 bg-royal-amethyst/20 rounded-2xl flex items-center justify-center text-royal-amethyst border border-royal-amethyst/30 shadow-lg shadow-royal-amethyst/10">
          <PieIcon size={28} />
        </div>
        <div className="flex-1">
          <h2 className="text-[28px] font-black text-white tracking-tighter leading-none">
            Analytics Data
          </h2>
          <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mt-1.5">
            Financial Analysis
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download size={16} />}
          className="shrink-0"
        >
          Export
        </Button>
      </div>
      {}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Earned"
          amount={stats.incomeTotal}
          icon={<TrendingUp size={16} />}
          color="text-emerald-green"
          bg="bg-emerald-green/5"
          border="border-emerald-green/20"
        />
        <SummaryCard
          label="Spent"
          amount={stats.expenseTotal}
          icon={<TrendingDown size={16} />}
          color="text-sunset-rose"
          bg="bg-sunset-rose/5"
          border="border-sunset-rose/20"
        />
        <SummaryCard
          label="Net"
          amount={stats.incomeTotal - stats.expenseTotal}
          icon={<Target size={16} />}
          color="text-royal-amethyst"
          bg="bg-royal-amethyst/5"
          border="border-royal-amethyst/20"
        />
      </div>
      {}
      <div className="bg-white/5 p-1.5 rounded-[24px] border border-white/5 shadow-inner flex">
        <button
          onClick={() => setActiveView("trends")}
          className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-[20px] flex items-center justify-center gap-2.5 transition-all ${activeView === "trends" ? "bg-white text-midnight-navy shadow-xl" : "text-white/30 hover:text-white/60"}`}
        >
          <LineIcon size={18} /> Trends
        </button>
        <button
          onClick={() => setActiveView("categories")}
          className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-[20px] flex items-center justify-center gap-2.5 transition-all ${activeView === "categories" ? "bg-white text-midnight-navy shadow-xl" : "text-white/30 hover:text-white/60"}`}
        >
          <BarChart3 size={18} /> Categories
        </button>
      </div>
      {}
      <div className="soma-card p-8 pb-4 relative overflow-hidden spending-card-glow">
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">
            {activeView === "trends" ? "Spending Timeline" : "Asset Allocation"}
          </h3>
          {activeView === "trends" && (
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setTrendRange("week")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${trendRange === "week" ? "bg-white text-midnight-navy shadow-lg" : "text-white/30"}`}
              >
                7D
              </button>
              <button
                onClick={() => setTrendRange("month")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${trendRange === "month" ? "bg-white text-midnight-navy shadow-lg" : "text-white/30"}`}
              >
                30D
              </button>
            </div>
          )}
        </div>
        <div className="h-72 w-full relative z-10">
          {activeView === "trends" ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient
                    id="trendGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#9d4edd" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#9d4edd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.03)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: "rgba(255,255,255,0.3)",
                    fontWeight: 800,
                  }}
                  minTickGap={trendRange === "week" ? 0 : 20}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121726",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#fff",
                    padding: "12px 20px",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ display: "none" }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="#9d4edd"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#trendGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={2000}
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SOMA_COLORS[index % SOMA_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121726",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "11px",
                    fontWeight: "800",
                    color: "#fff",
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: "10px",
                    fontWeight: "800",
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {}
      <div className="soma-card p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-royal-amethyst" />
          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em]">
            Monthly Split
          </h4>
        </div>
        <div className="space-y-6">
          {stats.pieData.length > 0 ? (
            stats.pieData.map((item, index) => (
              <div key={item.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      style={{
                        backgroundColor:
                          SOMA_COLORS[index % SOMA_COLORS.length],
                      }}
                    ></div>
                    <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-base font-black text-white tracking-tighter">
                    ${item.value.toFixed(2)}
                  </p>
                </div>
                <div className="w-full bg-white/[0.03] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-[1500ms] shadow-lg"
                    style={{
                      backgroundColor: SOMA_COLORS[index % SOMA_COLORS.length],
                      width: `${Math.round((item.value / stats.expenseTotal) * 100)}%`,
                      boxShadow: `0 0 15px ${SOMA_COLORS[index % SOMA_COLORS.length]}40`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-white/10 text-[11px] font-black uppercase tracking-[0.2em] italic">
                No activity detected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const SummaryCard = ({ label, amount, icon, color, bg, border }: any) => (
  <Card
    className={`${bg} ${border} text-center flex flex-col items-center group hover:scale-[1.02] transition-all`}
    innerClassName="p-5 flex flex-col items-center"
  >
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 ${color} mb-3 shadow-lg border border-white/5 group-hover:bg-white/10 transition-colors`}
    >
      {icon}
    </div>
    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.1em] mb-1.5">
      {label}
    </p>
    <p className="text-base font-black text-white tracking-tighter leading-none">
      ${amount.toFixed(0)}
    </p>
  </Card>
);
export default Analytics;
