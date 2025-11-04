import Elysia from "elysia";
import { chatbot } from "./chat-bot";

const socket = new Elysia().use(chatbot).listen(3001, ({ port }) => {
    console.log(`🔌 Socket listinig at ${port}`);
});

export type Socket = typeof socket;
