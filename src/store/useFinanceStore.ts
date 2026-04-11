import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Subscription, AppTab, User } from "../types";
interface FinanceState {
  transactions: Transaction[];
  subscriptions: Subscription[];
  user: User;
  activeTab: AppTab;
  isAuthenticated: boolean;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addSubscription: (s: Omit<Subscription, "id">) => void;
  deleteSubscription: (id: string) => void;
  setTab: (tab: AppTab) => void;
  login: () => void;
  logout: () => void;
  getStats: () => {
    incomeTotal: number;
    expenseTotal: number;
    balance: number;
    subTotal: number;
  };
}
export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      subscriptions: [],
      user: {
        name: "Student",
        avatar: "https://picsum.photos/seed/student/200",
        monthlyBudget: 2000,
      },
      activeTab: AppTab.DASHBOARD,
      isAuthenticated: false,
      addTransaction: (t) =>
        set((state) => ({
          transactions: [
            { ...t, id: Math.random().toString(36).substr(2, 9) },
            ...state.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      addSubscription: (s) =>
        set((state) => ({
          subscriptions: [
            ...state.subscriptions,
            { ...s, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      deleteSubscription: (id) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        })),
      setTab: (tab) => set({ activeTab: tab }),
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      getStats: () => {
        const { transactions, subscriptions } = get();
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
          subTotal,
        };
      },
    }),
    { name: "wmoney-storage" },
  ),
);
