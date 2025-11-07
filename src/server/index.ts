import index from "@/app/index.html";
import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { students } from "./routes/students";
import { supervisors } from "./routes/supervisors";
import { Client } from "./chatbot/client";
import "./chatbot";

const client = new Client();

const api = new Elysia({ prefix: "api", websocket: { ping(ws, data) {} } })
    .use(students)
    .use(supervisors)
    .post(
        "/startChat",
        async ({ body: { phone, students } }) => {
            const bot = await client.load();

            await bot.multipleQuestionnaires(students, phone);
        },
        {
            body: t.Object({
                students: t.ArrayString(),
                phone: t.String(),
            }),
        }
    );

const app = new Elysia()
    .use(openapi())
    .get("/", index)
    .use(api)
    .listen(3000, ({ port }) => {
        console.log(`🚀 Server running at ${port}`);
    });

export type App = typeof app;
export type { Socket } from "./chatbot";
