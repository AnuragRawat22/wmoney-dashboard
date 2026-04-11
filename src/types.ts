export type Category =
  | "Food"
  | "Transport"
  | "Study"
  | "Entertainment"
  | "Shopping"
  | "Rent"
  | "Salary"
  | "Allowance"
  | "Gift"
  | "Freelance"
  | "Other";
export type TransactionType = "income" | "expense";
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: Category;
  type: TransactionType;
}
export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  nextRenewal: string;
  category: string;
  remindersEnabled: boolean;
}
export interface User {
  name: string;
  avatar: string;
  monthlyBudget: number;
}
export enum AppTab {
  DASHBOARD = "dashboard",
  TRANSACTIONS = "transactions",
  SUBSCRIPTIONS = "subscriptions",
  ANALYTICS = "analytics",
}
