"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/api/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit
            ? parseInt(req.query.limit)
            : undefined;
        const offset = req.query.offset
            ? parseInt(req.query.offset)
            : undefined;
        const transactions = yield prisma.transaction.findMany({
            orderBy: { date: "desc" },
            take: limit,
            skip: offset,
        });
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
}));
app.post("/api/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, amount, category, type } = req.body;
    try {
        const transaction = yield prisma.transaction.create({
            data: { title, amount, category, type },
        });
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create transaction" });
    }
}));
app.delete("/api/transactions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.transaction.delete({ where: { id } });
        res.json({ message: "Transaction deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete transaction" });
    }
}));
app.get("/api/subscriptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriptions = yield prisma.subscription.findMany();
        res.json(subscriptions);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
}));
app.post("/api/subscriptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, billingCycle, nextRenewal, category, remindersEnabled } = req.body;
    try {
        const subscription = yield prisma.subscription.create({
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
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create subscription" });
    }
}));
app.put("/api/subscriptions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, price, billingCycle, nextRenewal, category, remindersEnabled } = req.body;
    try {
        const subscription = yield prisma.subscription.update({
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
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update subscription" });
    }
}));
app.delete("/api/subscriptions/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.subscription.delete({ where: { id } });
        res.json({ message: "Subscription deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete subscription" });
    }
}));
const nlpProcessor_1 = require("./services/nlpProcessor");
let trendsCache = null;
app.get("/api/analytics/trends", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txCount = yield prisma.transaction.count();
        // use memory cache
        if (trendsCache) {
            return res.json(trendsCache);
        }
        const allExpenses = yield prisma.transaction.findMany({
            where: { type: "expense" },
            select: { date: true, category: true, amount: true },
        });
        const grouped = allExpenses.reduce((acc, t) => {
            const dateObj = new Date(t.date);
            const monthStr = dateObj.getFullYear() +
                "-" +
                String(dateObj.getMonth() + 1).padStart(2, "0");
            const key = `${monthStr}_${t.category}`;
            if (!acc[key]) {
                acc[key] = { month: monthStr, category: t.category, total: 0 };
            }
            acc[key].total += Number(t.amount);
            return acc;
        }, {});
        const trends = Object.values(grouped).map((t) => (Object.assign(Object.assign({}, t), { total: Number(t.total.toFixed(2)) })));
        trendsCache = trends;
        res.json(trends);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch analytics trends" });
    }
}));
app.get("/api/analytics/safe-spend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const currTx = yield prisma.transaction.findMany({
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
        const subscriptions = yield prisma.subscription.findMany();
        const subTotal = subscriptions.reduce((sum, sub) => {
            const renewalDate = new Date(sub.nextRenewal);
            if (renewalDate.getMonth() === now.getMonth() &&
                renewalDate.getFullYear() === now.getFullYear() &&
                renewalDate.getDate() >= now.getDate()) {
                return sum + sub.price;
            }
            return sum;
        }, 0);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const daysLeft = Math.max(1, lastDayOfMonth.getDate() - now.getDate() + 1);
        const safeDailySpend = (balance - subTotal) / daysLeft;
        res.json({ safeDailySpend, balance, subTotal, daysLeft });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to calculate safe spend" });
    }
}));
app.post("/api/nlp/clean", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield (0, nlpProcessor_1.cleanTransactions)();
        trendsCache = null;
        res.json({ message: `Successfully cleaned ${count} messy transactions.` });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to process transactions" });
    }
}));
app.listen(PORT, () => { });
