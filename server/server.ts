import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get("/api/transactions", async (req, res) => {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string)
      : undefined;
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      take: limit,
      skip: offset,
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});
app.post("/api/transactions", async (req, res) => {
  const { title, amount, category, type } = req.body;
  try {
    const transaction = await prisma.transaction.create({
      data: { title, amount, category, type },
    });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});
app.delete("/api/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.delete({ where: { id } });
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});
app.get("/api/subscriptions", async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
});
app.post("/api/subscriptions", async (req, res) => {
  const { name, price, billingCycle, nextRenewal, category, remindersEnabled } =
    req.body;
  try {
    const subscription = await prisma.subscription.create({
      data: {
        name,
        price,
        billingCycle,
        nextRenewal: new Date(nextRenewal),
        category,
        remindersEnabled,
      },
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription" });
  }
});
app.put("/api/subscriptions/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, billingCycle, nextRenewal, category, remindersEnabled } =
    req.body;
  try {
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        name,
        price,
        billingCycle,
        nextRenewal: new Date(nextRenewal),
        category,
        remindersEnabled,
      },
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscription" });
  }
});
app.delete("/api/subscriptions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.subscription.delete({ where: { id } });
    res.json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscription" });
  }
});
import { cleanTransactions } from "./services/nlpProcessor";
let trendsCache: any = null;
app.get("/api/analytics/trends", async (req, res) => {
  try {
    const txCount = await prisma.transaction.count();
    // use memory cache
    if (trendsCache) {
      return res.json(trendsCache);
    }
    const allExpenses = await prisma.transaction.findMany({
      where: { type: "expense" },
      select: { date: true, category: true, amount: true },
    });
    const grouped = allExpenses.reduce((acc: any, t) => {
      const dateObj = new Date(t.date);
      const monthStr =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0");
      const key = `${monthStr}_${t.category}`;
      if (!acc[key]) {
        acc[key] = { month: monthStr, category: t.category, total: 0 };
      }
      acc[key].total += Number(t.amount);
      return acc;
    }, {});
    const trends = Object.values(grouped).map((t: any) => ({
      ...t,
      total: Number(t.total.toFixed(2)),
    }));
    trendsCache = trends;
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics trends" });
  }
});
app.get("/api/analytics/safe-spend", async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const currTx = await prisma.transaction.findMany({
      where: {
        date: {
          gte: firstDayOfMonth,
        },
      },
    });
    const income = currTx
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = currTx
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expenses;
    const subscriptions = await prisma.subscription.findMany();
    const subTotal = subscriptions.reduce((sum, sub) => {
      const renewalDate = new Date(sub.nextRenewal);
      if (
        renewalDate.getMonth() === now.getMonth() &&
        renewalDate.getFullYear() === now.getFullYear() &&
        renewalDate.getDate() >= now.getDate()
      ) {
        return sum + sub.price;
      }
      return sum;
    }, 0);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = Math.max(1, lastDayOfMonth.getDate() - now.getDate() + 1);
    const safeDailySpend = (balance - subTotal) / daysLeft;
    res.json({ safeDailySpend, balance, subTotal, daysLeft });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate safe spend" });
  }
});
app.post("/api/nlp/clean", async (req, res) => {
  try {
    const count = await cleanTransactions();
    trendsCache = null;
    res.json({ message: `Successfully cleaned ${count} messy transactions.` });
  } catch (error) {
    res.status(500).json({ error: "Failed to process transactions" });
  }
});
app.listen(PORT, () => {});
