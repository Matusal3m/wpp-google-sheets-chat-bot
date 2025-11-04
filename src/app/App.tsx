import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import { Header } from "./partials/header";
import { Footer } from "./partials/footer";
import { StudentsTable } from "./partials/students-table";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <div className="w-screen flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-950">
          <StudentsTable />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
