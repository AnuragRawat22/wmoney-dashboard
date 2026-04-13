import React, { useState } from "react";
import {
  Plus,
  Search,
  Tag,
  DollarSign,
  Calendar,
  X,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Transaction, Category, TransactionType } from "../../types";
import { Card, Button, Input } from "../common/UIComponents";
interface TransactionManagerProps {
  transactions: Transaction[];
  onAdd: (transaction: Omit<Transaction, "id">) => void;
  onDelete: (id: string) => void;
}
const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Study",
  "Entertainment",
  "Shopping",
  "Rent",
  "Salary",
  "Allowance",
  "Gift",
  "Freelance",
  "Other",
];
const TransactionManager: React.FC<TransactionManagerProps> = ({
  transactions,
  onAdd,
  onDelete,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Other" as Category,
    type: "expense" as TransactionType,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    onAdd({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: new Date().toISOString(),
    });
    setFormData({ title: "", amount: "", category: "Other", type: "expense" });
    setIsAdding(false);
  };
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((t) => {
      const matchesFilter = filter === "all" || t.type === filter;
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchQuery]);
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-700">
      {}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-[28px] font-black text-white tracking-tighter leading-none">
            Journal
          </h2>
          <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mt-1.5">
            Manage Transactions
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
      <div className="space-y-4">
        <Input
          icon={<Search size={18} />}
          placeholder="Search by title or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-[20px] border border-white/5">
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`py-3 text-[10px] font-black tracking-widest uppercase rounded-xl transition-all ${
                filter === t
                  ? "bg-white text-midnight-navy shadow-lg"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {t === "expense" ? "Spent" : t === "income" ? "Earned" : "All"}
            </button>
          ))}
        </div>
      </div>
      {}
      <div className="space-y-4">
        {paginatedTransactions.length === 0 ? (
          <Card innerClassName="p-16 text-center border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-white/10" size={32} />
            </div>
            <p className="text-white/20 font-black uppercase tracking-widest text-xs">
              No entries found
            </p>
          </Card>
        ) : (
          paginatedTransactions.map((t) => (
            <div
              key={t.id}
              className="soma-card p-5 flex items-center justify-between hover:border-royal-amethyst/30 transition-all group overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    t.type === "income"
                      ? "bg-emerald-green/10 text-emerald-green border border-emerald-green/20"
                      : "bg-white/5 text-white/40 border border-white/5"
                  }`}
                >
                  {t.type === "income" ? (
                    <ArrowUpRight size={24} />
                  ) : (
                    <Tag size={24} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-none group-hover:text-royal-amethyst transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                    {t.category} •{" "}
                    {new Date(t.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 relative z-10">
                <div className="text-right">
                  <p
                    className={`font-black text-base ${t.type === "income" ? "text-emerald-green" : "text-white"}`}
                  >
                    {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(t.id)}
                  className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-sunset-rose hover:bg-sunset-rose/10 rounded-xl transition-all opacity-100 lg:opacity-0 group-hover:opacity-100 border border-transparent hover:border-sunset-rose/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/10 mt-6 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="text-white/60"
          >
            Previous
          </Button>
          <span className="text-[10px] uppercase font-black tracking-widest text-white/40">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
      {}
      {isAdding && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center p-0">
          <div
            className="absolute inset-0 bg-midnight-navy/60 backdrop-blur-md"
            onClick={() => setIsAdding(false)}
          ></div>
          <div className="relative w-full max-w-md bg-card-navy border-t border-white/10 rounded-t-[40px] p-6 pb-24 sm:pb-8 sm:p-8 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter">
                  Add Money
                </h3>
                <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mt-1">
                  New Entry
                </p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-white/5 p-3 rounded-2xl text-white/40 border border-white/5"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex bg-white/5 p-1.5 rounded-[24px] border border-white/10">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, type: "expense" }))
                  }
                  className={`flex-1 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${
                    formData.type === "expense"
                      ? "bg-sunset-rose text-white shadow-lg"
                      : "text-white/30"
                  }`}
                >
                  Spend
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, type: "income" }))}
                  className={`flex-1 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all ${
                    formData.type === "income"
                      ? "bg-emerald-green text-white shadow-lg"
                      : "text-white/30"
                  }`}
                >
                  Earn
                </button>
              </div>
              <Input
                autoFocus
                required
                label="Description"
                placeholder="e.g. Coffee, Freelance..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  required
                  type="number"
                  step="0.01"
                  label="Amount"
                  icon={<DollarSign size={18} />}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, amount: e.target.value }))
                  }
                />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        category: e.target.value as Category,
                      }))
                    }
                    className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[28px] text-white text-base font-bold appearance-none transition-all focus:ring-2 focus:ring-royal-amethyst/40"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-midnight-navy">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!formData.title || !formData.amount}
                className="w-full py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                variant={formData.type === "income" ? "success" : "primary"}
              >
                Log {formData.type === "income" ? "Earnings" : "Expense"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TransactionManager;
