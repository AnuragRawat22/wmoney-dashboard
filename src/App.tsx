import React, { useState, useEffect, useMemo, useTransition } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  CalendarClock,
  Sparkles,
  Bell,
  ChartBar,
  X,
  BellRing,
  CheckCircle2,
} from "lucide-react";
import { AppTab, Transaction, Subscription } from "./types";
import Dashboard from "./components/features/Dashboard";
import TransactionManager from "./components/features/TransactionManager";
import SubscriptionManager from "./components/features/SubscriptionManager";
import Analytics from "./components/features/Analytics";
import LoginPage from "./components/features/LoginPage";
const API_URL = "http://localhost:5000/api";
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("wmoney_auth") === "true";
  });
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleTabChange = (tab: AppTab) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };
  useEffect(() => {
    localStorage.setItem("wmoney_auth", isAuthenticated.toString());
  }, [isAuthenticated]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, subsRes] = await Promise.all([
          fetch(`${API_URL}/transactions`),
          fetch(`${API_URL}/subscriptions`),
        ]);
        const transData = await transRes.json();
        const subsData = await subsRes.json();
        setTransactions(transData);
        setSubscriptions(subsData);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const subTotal = subscriptions.reduce(
      (acc, sub) =>
        acc + (sub.billingCycle === "monthly" ? sub.price : sub.price / 12),
      0,
    );
    return {
      incomeTotal: income,
      expenseTotal: expenses + subTotal,
      balance: income - (expenses + subTotal),
    };
  }, [transactions, subscriptions]);
  const reminders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return subscriptions
      .filter((s) => s.remindersEnabled)
      .map((s) => {
        const renewal = new Date(s.nextRenewal);
        renewal.setHours(0, 0, 0, 0);
        const diff = Math.ceil(
          (renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        return { ...s, daysLeft: diff };
      })
      .filter((s) => s.daysLeft >= 0 && s.daysLeft <= 14)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [subscriptions]);
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });
      const data = await response.json();
      setTransactions((prev) => [data, ...prev]);
    } catch (error) {}
  };
  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {}
  };
  const addSubscription = async (sub: Omit<Subscription, "id">) => {
    try {
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      const data = await response.json();
      setSubscriptions((prev) => [...prev, data]);
    } catch (error) {}
  };
  const deleteSubscription = async (id: string) => {
    try {
      await fetch(`${API_URL}/subscriptions/${id}`, { method: "DELETE" });
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {}
  };
  const editSubscription = async (
    id: string,
    updated: Omit<Subscription, "id">,
  ) => {
    try {
      const response = await fetch(`${API_URL}/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await response.json();
      setSubscriptions((prev) => prev.map((s) => (s.id === id ? data : s)));
    } catch (error) {}
  };
  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <Dashboard
            transactions={transactions}
            subscriptions={subscriptions}
            stats={stats}
            onViewAnalytics={() => handleTabChange(AppTab.ANALYTICS)}
          />
        );
      case AppTab.TRANSACTIONS:
        return (
          <TransactionManager
            transactions={transactions}
            onAdd={addTransaction}
            onDelete={deleteTransaction}
          />
        );
      case AppTab.SUBSCRIPTIONS:
        return (
          <SubscriptionManager
            subscriptions={subscriptions}
            onAdd={addSubscription}
            onDelete={deleteSubscription}
            onEdit={editSubscription}
          />
        );
      case AppTab.ANALYTICS:
        return (
          <Analytics
            transactions={transactions}
            subscriptions={subscriptions}
          />
        );
      default:
        return (
          <Dashboard
            transactions={transactions}
            subscriptions={subscriptions}
            stats={stats}
            onViewAnalytics={() => handleTabChange(AppTab.ANALYTICS)}
          />
        );
    }
  };
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }
  return (
    <div className="flex flex-col min-h-screen bg-transparent pb-24 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="mesh-bg">
        <div className="mesh-blob mesh-purple"></div>
        <div className="mesh-blob mesh-blue"></div>
        <div className="mesh-blob mesh-teal"></div>
      </div>
      {}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-royal-amethyst/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-emerald-green/5 rounded-full blur-[100px] pointer-events-none"></div>
      <header className="sticky top-0 z-40 bg-midnight-navy/80 backdrop-blur-2xl border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-royal-amethyst rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-royal-amethyst/30 rotate-3">
            w
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter">
            wMoney
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRemindersOpen(true)}
            className="p-2.5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 rounded-2xl transition-all relative"
          >
            <Bell size={22} />
            {reminders.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-royal-amethyst rounded-full ring-2 ring-midnight-navy shadow-[0_0_8px_rgba(157,78,221,0.6)] animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => {
              if (confirm("Log out of wMoney?")) {
                setIsAuthenticated(false);
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/10 shadow-lg overflow-hidden ring-2 ring-royal-amethyst/20 hover:scale-105 transition-all"
          >
            <img src="https://picsum.photos/seed/student/200" alt="Avatar" />
          </button>
        </div>
      </header>
      <main className="flex-1 px-4 py-6 overflow-y-auto relative z-10">
        <div
          style={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.2s" }}
        >
          {renderContent()}
        </div>
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-midnight-navy/90 backdrop-blur-3xl border-t border-white/5 px-4 pb-8 pt-4 flex items-center justify-around z-50">
        <NavButton
          active={activeTab === AppTab.DASHBOARD}
          onClick={() => handleTabChange(AppTab.DASHBOARD)}
          icon={<LayoutDashboard size={20} />}
          label="Home"
        />
        <NavButton
          active={activeTab === AppTab.TRANSACTIONS}
          onClick={() => handleTabChange(AppTab.TRANSACTIONS)}
          icon={<ArrowLeftRight size={20} />}
          label="Track"
        />
        <NavButton
          active={activeTab === AppTab.SUBSCRIPTIONS}
          onClick={() => handleTabChange(AppTab.SUBSCRIPTIONS)}
          icon={<CalendarClock size={20} />}
          label="Assets"
        />
        <NavButton
          active={activeTab === AppTab.ANALYTICS}
          onClick={() => handleTabChange(AppTab.ANALYTICS)}
          icon={<ChartBar size={20} />}
          label="Stats"
        />
      </nav>
      {}
      {isRemindersOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-midnight-navy/60 backdrop-blur-md"
            onClick={() => setIsRemindersOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-card-navy border-x border-t border-white/10 rounded-t-[40px] sm:rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-royal-amethyst/20 rounded-2xl flex items-center justify-center text-royal-amethyst">
                  <BellRing size={22} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Renewals
                </h3>
              </div>
              <button
                onClick={() => setIsRemindersOpen(false)}
                className="bg-white/5 p-2.5 rounded-2xl text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {reminders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-white/20" size={40} />
                  </div>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-xs">
                    All clear for now
                  </p>
                </div>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-6 rounded-[32px] border transition-all ${rem.daysLeft <= 2 ? "bg-royal-amethyst/10 border-royal-amethyst/30" : "bg-white/5 border-white/5"}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${rem.daysLeft <= 2 ? "bg-royal-amethyst text-white" : "bg-white/5 text-white/40"}`}
                        >
                          {rem.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">
                            {rem.name}
                          </h4>
                          <p className="text-xs text-white/40 font-medium">
                            ${rem.price.toFixed(2)} • {rem.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${rem.daysLeft <= 2 ? "text-royal-amethyst border-royal-amethyst/30 bg-royal-amethyst/5" : "text-white/40 border-white/10"}`}
                        >
                          {rem.daysLeft === 0
                            ? "Today"
                            : rem.daysLeft === 1
                              ? "Tomorrow"
                              : `${rem.daysLeft}d`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setIsRemindersOpen(false)}
              className="w-full mt-10 py-5 bg-white text-midnight-navy rounded-[32px] font-black text-sm uppercase tracking-widest hover:scale-95 transition-all shadow-xl shadow-white/5"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}
const NavButton: React.FC<NavButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all relative min-w-[64px] group hover:-translate-y-[2px] ${active ? "text-white" : "text-white/20 hover:text-white/60 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"}`}
  >
    <div
      className={`transition-all duration-500 transform ${active ? "scale-110 -translate-y-1 text-royal-amethyst drop-shadow-[0_0_8px_rgba(157,78,221,0.6)]" : "scale-100 translate-y-0"}`}
    >
      {icon}
    </div>
    <span
      className={`text-[9px] font-black mt-1.5 uppercase tracking-widest transition-all duration-300 ${active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}
    >
      {label}
    </span>
    {}
    {active && (
      <div className="absolute -bottom-1 w-1 h-1 bg-royal-amethyst rounded-full shadow-[0_0_8px_rgba(157,78,221,0.8)]"></div>
    )}
  </button>
);
export default App;
