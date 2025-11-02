import index from "@/app/index.html";
import { Elysia } from "elysia";
import { questionnaires } from "./routes/questionnaires";
import { students } from "./routes/students";

const app = new Elysia()
    .get("/", index)
    .use(questionnaires)
    .use(students)
    .listen(3000);

console.log(`🚀 Server running at ${app.server?.port}`);
