import { serve } from "bun";
import index from "./app/index.html";
import "./server";

const server = serve({
    routes: {
        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        hmr: true,
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
