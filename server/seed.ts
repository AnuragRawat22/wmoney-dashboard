import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gaussianRandom = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1 + 0.0000001)) * Math.cos(2.0 * Math.PI * u2);
  return Math.max(0.5, mean + z0 * stdDev);
};

const applyOddCents = (amount: number): number => {
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
  { base: "Uber", mean: 18, stdDev: 5, category: "Transport" },
  { base: "Uber Eats", mean: 20, stdDev: 8, category: "Food" },
  { base: "Whole Foods", mean: 45, stdDev: 15, category: "Food" },
  { base: "Target", mean: 35, stdDev: 15, category: "Shopping" },
  { base: "Gas Station", mean: 35, stdDev: 8, category: "Transport" },
  { base: "Library Coffee", mean: 4, stdDev: 1, category: "Food" },
];

const incomeSources = [
  { base: "Software Internship", mean: 5500, stdDev: 500, category: "Salary" },
  { base: "University Payroll", mean: 1500, stdDev: 200, category: "Salary" },
  { base: "Venmo from Mom", mean: 50, stdDev: 10, category: "Gift" },
  { base: "Freelance Design", mean: 450, stdDev: 100, category: "Freelance" },
];

const outliers = [
  { base: "APPLE STORE", amount: 999.0, category: "Shopping" },
  { base: "CAR MAINTENANCE", amount: 350.5, category: "Transport" },
  { base: "ER BILL", amount: 500.0, category: "Other" },
  { base: "SEMESTER BOOKS", amount: 350.0, category: "Study" },
];

const subscriptionsConfig = [
  { name: "Spotify Student", price: 5.99, dayOfMonth: 5, billingCycle: "monthly", category: "Entertainment", remindersEnabled: true },
  { name: "Notion Plus", price: 8.0, dayOfMonth: 10, billingCycle: "monthly", category: "Study", remindersEnabled: true },
  { name: "Amazon Prime Student", price: 7.49, dayOfMonth: 15, billingCycle: "monthly", category: "Shopping", remindersEnabled: false },
  { name: "Netflix", price: 15.49, dayOfMonth: 21, billingCycle: "monthly", category: "Entertainment", remindersEnabled: true },
  { name: "Gym Membership", price: 29.99, dayOfMonth: 1, billingCycle: "monthly", category: "Other", remindersEnabled: false },
  { name: "Rent", price: 1050.0, dayOfMonth: 1, billingCycle: "monthly", category: "Rent", remindersEnabled: true },
];

const generateMessyTitle = (baseName: string): string => {
  const chance = Math.random();
  const idStr = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  const upperBase = baseName.toUpperCase();
  if (chance < 0.15) return `SQ * ${upperBase} NEW YORK #${idStr}`;
  if (chance < 0.3) return `POS PURCH ${upperBase} WA`;
  if (chance < 0.45) return `TST* ${upperBase} ${idStr}`;
  if (chance < 0.6) return `${upperBase} ONLINE PMT`;
  if (chance < 0.75) return `PENDING - ${upperBase}`;
  if (chance < 0.9) return `${upperBase} LLC PPD`;
  return `ACH DEBIT ${upperBase} ${idStr}`;
};

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const main = async () => {
  const transactions: any[] = [];
  const now = new Date();
  
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const end = now;

  console.log("Generating 10,000 transactions...");

  for (let i = 0; i < 9000; i++) {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const rawAmount = gaussianRandom(merchant.mean, merchant.stdDev);
    transactions.push({
      title: generateMessyTitle(merchant.base),
      amount: applyOddCents(rawAmount),
      date: randomDate(start, end).toISOString(),
      category: merchant.category,
      type: "expense"
    });
  }

  for (let i = 0; i < 996; i++) {
    const source = incomeSources[Math.floor(Math.random() * incomeSources.length)];
    const rawAmount = gaussianRandom(source.mean, source.stdDev);
    transactions.push({
      title: generateMessyTitle(source.base),
      amount: applyOddCents(rawAmount),
      date: randomDate(start, end).toISOString(),
      category: source.category,
      type: "income"
    });
  }

  for (const out of outliers) {
    transactions.push({
      title: generateMessyTitle(out.base),
      amount: applyOddCents(out.amount),
      date: randomDate(start, end).toISOString(),
      category: out.category,
      type: "expense"
    });
  }

  console.log("Pushing transactions to Supabase...");
  const batchSize = 1000;
  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    await prisma.transaction.createMany({ data: batch });
    console.log(`Pushed batch ${(i / batchSize) + 1} of ${Math.ceil(transactions.length / batchSize)}`);
  }

  console.log("Pushing subscriptions to Supabase...");
  await prisma.subscription.createMany({
    data: subscriptionsConfig.map((s) => {
      return {
        name: s.name,
        price: s.price,
        billingCycle: s.billingCycle || "monthly",
        nextRenewal: new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          s.dayOfMonth,
        ).toISOString(),
        category: s.category,
        remindersEnabled: s.remindersEnabled,
      };
    }),
  });
  
  console.log("Database seeded completely!");
};

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => await prisma.$disconnect());
