import { ThemeProvider } from "./components/theme-provider";
import { Header } from "./partials/header";
import "./index.css";
import { ChatBotForm } from "./partials/chat-bot-form";
import { ChatBotPanel } from "./partials/chatbot-panel";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <div className="w-screen flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col md:flex-row justify-between gap-6 p-6 ">
          <ChatBotForm />
          <ChatBotPanel />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
