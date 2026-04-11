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
exports.cleanTransactions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Normalizes transaction titles by stripping standardized merchant terminal prefixes and payment gateways.
 * Utilizes a rule-based NLP pipeline to evaluate substrings and apply sequential RegEx reductions.
 */
const cleanTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield prisma.transaction.findMany();
    const messyKeywords = [
        "SQ *",
        "POS PURCH",
        "TST*",
        "ACH DEBIT",
        "PENDING -",
        "ONLINE PMT",
        "LLC PPD",
    ];
    let cleanedCount = 0;
    const updates = [];
    for (const txn of transactions) {
        let isMessy = false;
        let originalTitle = txn.title;
        let cleanTitle = txn.title;
        for (const keyword of messyKeywords) {
            if (txn.title.toUpperCase().includes(keyword)) {
                isMessy = true;
                break;
            }
        }
        if (isMessy) {
            // Execute RegEx-based string reductions for known POS terminal identifiers.
            cleanTitle = cleanTitle
                .replace(/SQ \\*/i, "")
                .replace(/POS PURCH/i, "")
                .replace(/TST\*/i, "")
                .replace(/ACH DEBIT/i, "")
                .replace(/PENDING -/i, "")
                .replace(/ONLINE PMT/i, "")
                .replace(/LLC PPD/i, "")
                .replace(/NEW YORK/i, "")
                .replace(/WA/i, "")
                .replace(/#\d{4}/, "")
                .replace(/\d{4}/, "")
                .trim();
            cleanTitle =
                cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1).toLowerCase();
            updates.push(prisma.transaction.update({
                where: { id: txn.id },
                data: { title: cleanTitle },
            }));
            cleanedCount++;
        }
    }
    // Mutate normalized entity states using batched Prisma transactions to prevent memory overflow
    // and maintain optimal connection pool utilization.
    const batchSize = 500;
    for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        yield prisma.$transaction(batch);
    }
    return cleanedCount;
});
exports.cleanTransactions = cleanTransactions;
