import { ThemeProvider } from "./components/theme-provider";
import { Header } from "./partials/header";
import { Footer } from "./partials/footer";
import "./index.css";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <div className="w-screen flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col gap-6 p-6 "></main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
