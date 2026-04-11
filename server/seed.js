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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const gaussianRandom = (mean, stdDev) => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1 + 0.0000001)) * Math.cos(2.0 * Math.PI * u2);
    return Math.max(0.5, mean + z0 * stdDev);
};
const applyOddCents = (amount) => {
    if (Math.random() < 0.9) {
        const cents = Math.floor(Math.random() * 99);
        const safeCents = cents === 0 ? 99 : cents;
        return Math.floor(amount) + safeCents / 100;
    }
    return Math.floor(amount);
};
const merchants = [
    { base: "Amazon", mean: 15, stdDev: 5, category: "Shopping" },
    { base: "Starbucks", mean: 5.5, stdDev: 1.5, category: "Food" },
    { base: "Uber", mean: 18, stdDev: 5, category: "Transportation" },
    { base: "Uber Eats", mean: 20, stdDev: 8, category: "Food" },
    { base: "Whole Foods", mean: 45, stdDev: 15, category: "Food" },
    { base: "Target", mean: 35, stdDev: 15, category: "Shopping" },
    { base: "Gas Station", mean: 35, stdDev: 8, category: "Transportation" },
    { base: "Library Coffee", mean: 4, stdDev: 1, category: "Food" },
];
const incomeSources = [
    { base: "Software Internship", mean: 5500, stdDev: 500, category: "Income" },
    { base: "University Payroll", mean: 1500, stdDev: 200, category: "Income" },
    { base: "Venmo from Mom", mean: 50, stdDev: 10, category: "Income" },
    { base: "Freelance Design", mean: 450, stdDev: 100, category: "Income" },
];
const outliers = [
    { base: "APPLE STORE", amount: 999.0, category: "Shopping" },
    { base: "CAR MAINTENANCE", amount: 350.5, category: "Transportation" },
    { base: "ER BILL", amount: 500.0, category: "Health" },
    { base: "SEMESTER BOOKS", amount: 350.0, category: "Study" },
];
const subscriptionsConfig = [
    {
        name: "Spotify Student",
        price: 5.99,
        dayOfMonth: 5,
        billingCycle: "monthly",
        category: "Entertainment",
        remindersEnabled: true,
    },
    {
        name: "Notion Plus",
        price: 8.0,
        dayOfMonth: 10,
        billingCycle: "monthly",
        category: "Study",
        remindersEnabled: true,
    },
    {
        name: "Amazon Prime Student",
        price: 7.49,
        dayOfMonth: 15,
        billingCycle: "monthly",
        category: "Shopping",
        remindersEnabled: false,
    },
    {
        name: "Netflix",
        price: 15.49,
        dayOfMonth: 21,
        billingCycle: "monthly",
        category: "Entertainment",
        remindersEnabled: true,
    },
    {
        name: "Gym Membership",
        price: 29.99,
        dayOfMonth: 1,
        billingCycle: "monthly",
        category: "Health",
        remindersEnabled: false,
    },
    {
        name: "Rent",
        price: 1050.0,
        dayOfMonth: 1,
        billingCycle: "monthly",
        category: "Housing",
        remindersEnabled: true,
    },
];
const generateMessyTitle = (baseName) => {
    const chance = Math.random();
    const idStr = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0");
    const upperBase = baseName.toUpperCase();
    if (chance < 0.15)
        return `SQ * ${upperBase} NEW YORK #${idStr}`;
    if (chance < 0.3)
        return `POS PURCH ${upperBase} WA`;
    if (chance < 0.45)
        return `TST* ${upperBase} ${idStr}`;
    if (chance < 0.6)
        return `${upperBase} ONLINE PMT`;
    if (chance < 0.75)
        return `PENDING - ${upperBase}`;
    if (chance < 0.9)
        return `${upperBase} LLC PPD`;
    return `ACH DEBIT ${upperBase} ${idStr}`;
};
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getMonthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = [];
    const now = new Date();
    const batchSize = 1000;
    for (let i = 0; i < transactions.length; i += batchSize) {
        const batch = transactions.slice(i, i + batchSize);
        yield prisma.transaction.createMany({ data: batch });
    }
    yield prisma.subscription.createMany({
        data: subscriptionsConfig.map((s) => {
            return {
                name: s.name,
                price: s.price,
                billingCycle: s.billingCycle,
                nextRenewal: new Date(now.getFullYear(), now.getMonth() + 1, s.dayOfMonth),
                category: s.category,
                remindersEnabled: s.remindersEnabled,
            };
        }),
    });
});
main()
    .catch(() => { })
    .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
