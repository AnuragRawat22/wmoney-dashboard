import React, { useState } from "react";
import {
  Plus,
  CreditCard,
  Calendar,
  Info,
  X,
  Trash2,
  Edit2,
  Bell,
  BellOff,
} from "lucide-react";
import { Subscription } from "../../types";
import { Card, Button, Input } from "../common/UIComponents";
interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  onAdd: (sub: Omit<Subscription, "id">) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, sub: Omit<Subscription, "id">) => void;
}
const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  subscriptions,
  onAdd,
  onDelete,
  onEdit,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billingCycle: "monthly" as "monthly" | "yearly",
    nextRenewal: "",
    category: "Entertainment",
    remindersEnabled: true,
  });
  const totalMonthly = subscriptions.reduce(
    (acc, sub) =>
      acc + (sub.billingCycle === "monthly" ? sub.price : sub.price / 12),
    0,
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subData = {
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      nextRenewal: formData.nextRenewal,
      category: formData.category,
      remindersEnabled: formData.remindersEnabled,
    };
    if (editingId) {
      onEdit(editingId, subData);
    } else {
      onAdd(subData);
    }
    closeModal();
  };
  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      billingCycle: "monthly",
      nextRenewal: "",
      category: "Entertainment",
      remindersEnabled: true,
    });
  };
  const openEdit = (sub: Subscription) => {
    setEditingId(sub.id);
    setFormData({
      name: sub.name,
      price: sub.price.toString(),
      billingCycle: sub.billingCycle,
      nextRenewal: sub.nextRenewal,
      category: sub.category,
      remindersEnabled: sub.remindersEnabled,
    });
    setIsAdding(true);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-[28px] font-black text-white tracking-tighter leading-none">
            Subscription
          </h2>
          <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mt-1.5">
            Manage Assets
          </p>
        </div>
        <Button
          variant="primary"
          size="icon"
          onClick={() => setIsAdding(true)}
          className="w-14 h-14"
        >
          <Plus size={28} />
        </Button>
      </div>
      {}
      <Card
        className="bg-card-navy/80 spending-card-glow border-white/10 flex items-center justify-between"
        innerClassName="p-8"
      >
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-royal-amethyst/20 rounded-2xl flex items-center justify-center text-royal-amethyst border border-royal-amethyst/30">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1.5 leading-none">
              Monthly Burn
            </p>
            <h3 className="text-3xl font-black text-white tracking-tighter">
              ${totalMonthly.toFixed(2)}
            </h3>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-white/20 text-[9px] uppercase font-black tracking-widest mb-1">
            Projected Year
          </p>
          <p className="text-base font-bold text-white/60">
            ${(totalMonthly * 12).toFixed(2)}
          </p>
        </div>
      </Card>
      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="text-center py-20 soma-card border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="text-white/10" size={32} />
            </div>
            <p className="text-white/20 font-black uppercase tracking-widest text-xs">
              No recurring costs
            </p>
          </div>
        ) : (
          subscriptions.map((sub) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const renewalDate = new Date(sub.nextRenewal);
            renewalDate.setHours(0, 0, 0, 0);
            const diffTime = renewalDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isSoon = daysLeft >= 0 && daysLeft <= 7;
            const isOverdue = daysLeft < 0;
            return (
              <div
                key={sub.id}
                className="soma-card overflow-hidden group hover:border-royal-amethyst/30 transition-all relative"
              >
                <div className="p-7">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-lg ${sub.remindersEnabled ? "bg-royal-amethyst text-white shadow-royal-amethyst/20" : "bg-white/5 text-white/30 shadowed-black/20"}`}
                      >
                        {sub.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-lg tracking-tight leading-none">
                            {sub.name}
                          </h4>
                          {sub.remindersEnabled ? (
                            <Bell
                              size={12}
                              className="text-royal-amethyst animate-pulse"
                            />
                          ) : (
                            <BellOff size={12} className="text-white/10" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest leading-none">
                            {sub.billingCycle}
                          </span>
                          <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest leading-none">
                            {sub.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-2xl font-black text-white tracking-tighter leading-none">
                        ${sub.price.toFixed(2)}
                      </p>
                      <div className="flex gap-2 mt-4 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 lg:translate-x-2 group-hover:translate-x-0">
                        <button
                          onClick={() => openEdit(sub)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/40 hover:text-royal-amethyst hover:bg-royal-amethyst/10 rounded-xl transition-all border border-white/5 hover:border-royal-amethyst/20"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(sub.id)}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 text-white/40 hover:text-sunset-rose hover:bg-sunset-rose/10 rounded-xl transition-all border border-white/5 hover:border-sunset-rose/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                      <Calendar size={14} className="text-white/10" />
                      <span>
                        {isOverdue ? "Last" : "Next"}:{" "}
                        {new Date(sub.nextRenewal).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                    <div
                      className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em] border ${
                        isOverdue
                          ? "bg-white/5 border-white/10 text-white/20"
                          : isSoon
                            ? "bg-sunset-rose/10 text-sunset-rose border-sunset-rose/30 shadow-[0_0_10px_rgba(255,126,157,0.1)]"
                            : "bg-emerald-green/10 text-emerald-green border-emerald-green/30"
                      }`}
                    >
                      {isOverdue
                        ? "Overdue"
                        : isSoon
                          ? `DUE IN ${daysLeft}D`
                          : `${daysLeft}D LEFT`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="bg-royal-amethyst/10 border border-royal-amethyst/20 rounded-[28px] p-6 flex gap-4 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] opacity-10">
          <Info size={80} className="text-royal-amethyst" />
        </div>
        <div className="w-10 h-10 bg-royal-amethyst/20 rounded-full flex items-center justify-center text-royal-amethyst shrink-0 border border-royal-amethyst/20">
          <Info size={20} />
        </div>
        <p className="text-white/60 text-xs leading-relaxed font-bold italic relative z-10">
          "Set renewal reminders 3 days early to stay ahead of the billing curve
          and cancel unneeded assets."
        </p>
      </div>
      {}
      {isAdding && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center p-0">
          <div
            className="absolute inset-0 bg-midnight-navy/60 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          <div className="relative w-full max-w-md bg-card-navy border-x border-t border-white/10 rounded-t-[40px] p-6 pb-24 sm:p-8 sm:pb-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar scroll-smooth">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter">
                  {editingId ? "Edit" : "New"} Asset
                </h3>
                <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mt-1">
                  Subscription Details
                </p>
              </div>
              <button
                onClick={closeModal}
                className="bg-white/5 p-3 rounded-2xl text-white/40 hover:text-white transition-all border border-white/5"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                  Service Name
                </label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Netflix, Spotify, etc."
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white text-base font-black placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-royal-amethyst/40 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                    Price
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="9.99"
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white text-base font-black placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-royal-amethyst/40 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                    Cycle
                  </label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        billingCycle: e.target.value as "monthly" | "yearly",
                      }))
                    }
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white text-base font-black focus:outline-none focus:ring-2 focus:ring-royal-amethyst/40 appearance-none transition-all"
                  >
                    <option value="monthly" className="bg-midnight-navy">
                      Monthly
                    </option>
                    <option value="yearly" className="bg-midnight-navy">
                      Yearly
                    </option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                  Next Renewal Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.nextRenewal}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nextRenewal: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white text-base font-black focus:outline-none focus:ring-2 focus:ring-royal-amethyst/40 transition-all"
                />
              </div>
              {}
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-[28px] border border-white/10 shadow-inner">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.remindersEnabled ? "bg-royal-amethyst/20 text-royal-amethyst border border-royal-amethyst/30" : "bg-white/5 text-white/20 border border-white/5"}`}
                  >
                    <Bell
                      size={22}
                      className={
                        formData.remindersEnabled ? "animate-bounce" : ""
                      }
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white leading-none uppercase tracking-widest">
                      Reminders
                    </p>
                    <p className="text-[9px] font-black text-white/20 mt-1 uppercase tracking-widest leading-none">
                      Notify 3 days early
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      remindersEnabled: !p.remindersEnabled,
                    }))
                  }
                  className={`w-14 h-8 rounded-full relative transition-all shadow-inner focus:outline-none ${formData.remindersEnabled ? "bg-royal-amethyst" : "bg-white/10"}`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-lg ${formData.remindersEnabled ? "left-7 shadow-royal-amethyst/50" : "left-1"}`}
                  />
                </button>
              </div>
              <button
                type="submit"
                disabled={!formData.name || !formData.price || !formData.nextRenewal}
                className="w-full py-6 bg-white text-midnight-navy rounded-[32px] font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all mt-6 shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed relative z-50"
              >
                {editingId ? "Update Asset" : "Verify & Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubscriptionManager;
