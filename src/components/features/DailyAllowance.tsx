import React, { useEffect, useState } from "react";
import { Sparkles, Wallet, AlertCircle, CheckCircle } from "lucide-react";
interface SafeSpendData {
  safeDailySpend: number;
  balance: number;
  subTotal: number;
  daysLeft: number;
}
const DailyAllowance: React.FC<any> = () => {
  const [data, setData] = useState<SafeSpendData | null>(null);
  /**
   * Retrieves dynamically computed daily liquidity limits. The underlying formula evaluates
   * (Total Liquid Assets - Reserved Liability Subscriptions) / Remaining Semester Days
   * to determine a safe baseline threshold without triggering negative balance depletion.
   */
  const fetchSafeSpend = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/analytics/safe-spend`);
      if (res.ok) {
        setData(await res.json());
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchSafeSpend();
    const handleRefresh = () => fetchSafeSpend();
    window.addEventListener("refresh-safe-spend", handleRefresh);
    return () =>
      window.removeEventListener("refresh-safe-spend", handleRefresh);
  }, []);
  if (!data) return null;
  const isNegative = data.safeDailySpend < 0;
  const neonColor = isNegative ? "#FF3366" : "#10B981";
  return (
    <div className="soma-card p-6 border-royal-amethyst/20 relative overflow-hidden group hover:border-royal-amethyst/40 transition-all duration-500 shadow-2xl">
      {}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Wallet size={80} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-royal-amethyst/10 rounded-xl flex items-center justify-center text-royal-amethyst">
            <Sparkles size={16} />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            Safe Daily Spend
          </h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-black tracking-tighter"
            style={{
              color: neonColor,
              textShadow: isNegative
                ? "0 0 10px rgba(255,51,102,0.3)"
                : "0 0 10px rgba(16,185,129,0.3)",
            }}
          >
            ${data.safeDailySpend.toFixed(2)}
          </span>
          <span className="text-white/30 text-xs font-bold uppercase tracking-widest">
            / day
          </span>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-white/40">
              {data.daysLeft} days remaining
            </span>
            <span className="text-white/40">
              ${data.subTotal.toFixed(2)} bills reserved
            </span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(0, Math.min(100, (data.daysLeft / 30) * 100))}%`,
                background: "linear-gradient(90deg, #10B981, #9d4edd)",
              }}
            />
          </div>
        </div>
        {isNegative ? (
          <div
            className="mt-4 flex items-center gap-2 px-3 py-2 border rounded-xl"
            style={{
              backgroundColor: "rgba(255, 51, 102, 0.1)",
              borderColor: "rgba(255, 51, 102, 0.3)",
              color: "#FF3366",
            }}
          >
            <AlertCircle size={14} />
            <span
              className="text-[10px] font-black uppercase tracking-tight"
              style={{ textShadow: "0 0 5px #FF3366" }}
            >
              Budget crunch detected!
            </span>
          </div>
        ) : (
          <div
            className="mt-4 flex items-center gap-2 px-3 py-2 border rounded-xl"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderColor: "rgba(16, 185, 129, 0.3)",
              color: "#10B981",
            }}
          >
            <CheckCircle size={14} />
            <span
              className="text-[10px] font-black uppercase tracking-tight"
              style={{ textShadow: "0 0 10px rgba(16,185,129,0.3)" }}
            >
              You're in the green!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default DailyAllowance;
