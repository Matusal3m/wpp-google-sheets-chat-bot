import { treaty } from "@elysiajs/eden";
import type { Bot } from "@/server";

export const bot = treaty<Bot>("ws://localhost:3000");
export const api = treaty<Bot>("localhost:3000");
