import { treaty } from "@elysiajs/eden";
import type { App, Socket } from "@/server";

export const { api } = treaty<App>("localhost:3000");
export const socket = treaty<Socket>("ws://localhost:3001");
