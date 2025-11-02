import index from "@/app/index.html";
import { Elysia } from "elysia";
import { questionnaires } from "./routes/questionnaires";
import { students } from "./routes/students";
import { supervisors } from "./routes/supervisors";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
    .get("/", index)
    .use(openapi())
    .use(questionnaires)
    .use(students)
    .use(supervisors)
    .listen(3000);

console.log(`🚀 Server running at ${app.server?.port}`);
