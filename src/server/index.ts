import index from "@/app/index.html";
import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { questionnaires } from "./routes/questionnaires";
import { students } from "./routes/students";
import { supervisors } from "./routes/supervisors";
import "./chatbot";

const app = new Elysia()
    .get("/", index)
    .group("api", app => app.use(questionnaires).use(students).use(supervisors))
    .use(openapi())
    .listen(3000, ({ port }) => {
        console.log(`🚀 Server running at ${port}`);
    });

export type App = typeof app;
export type { Socket } from "./chatbot";
