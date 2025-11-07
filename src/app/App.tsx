import { ThemeProvider } from "./components/theme-provider";
import { Header } from "./partials/header";
import { ChatBotForm } from "./partials/chat-bot-form";
import { io } from "socket.io-client";
import "./index.css";

export function App() {
  const url = "http://localhost:3001";
  const socket = io(url, { autoConnect: true });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <div className="w-screen flex flex-col min-h-screen">
        <Header socket={socket} />
        <main className="flex justify-center items-center gap-6 p-6 ">
          <ChatBotForm />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
