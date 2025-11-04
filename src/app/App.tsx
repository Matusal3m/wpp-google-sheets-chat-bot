import { DataTableWithExport, type Student } from "./components/data-table";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import { api, socket } from "./lib/api";
import React from "react";

export function App() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [qrCode, setQrCode] = React.useState("");
  const [isBotConnected, setIsBotConnected] = React.useState(false);

  const fetchStudents = async () => {
    const { data } = await api.students.all.get({ query: { full: true } });
    const students = data?.students;
    if (!students?.length) return;

    const filtered: Student[] = students
      .map(student => {
        if (!("Questionnaire" in student)) return;
        if (student.Questionnaire && !("Questions" in student.Questionnaire))
          return;

        const questionnaireDone = student.Questionnaire?.Questions.every(
          q => !!q.response
        );

        return {
          name: student.name,
          questionnaire: {
            done: questionnaireDone || false,
          },
          supervisor: {
            name: student.Supervisor.name,
            phoneNumber: student.Supervisor.phoneNumber,
          },
        };
      })
      .filter(s => !!s);

    setStudents(filtered);
  };

  const status = socket.status.subscribe();
  status.on("message", ({ data: { up } }) => setIsBotConnected(up));

  const connect = socket.connect.subscribe();
  connect.on("message", ({ data }) => setQrCode(data));

  const requestQrCode = () => {
    connect.send("");
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <div className="w-screen flex flex-col min-h-screen">
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
          <h1 className="text-xl font-bold">Bot Control Panel</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  isBotConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm capitalize">
                {isBotConnected ? "Conectado" : "Offline"}
              </span>
            </div>

            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-950">
          <section className="flex justify-center">
            <div className="flex flex-col items-center gap-3 border border-gray-800 rounded-2xl p-6 bg-gray-900">
              <h2 className="text-lg font-semibold">WhatsApp Connection</h2>
              {qrCode && (
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-56 h-56 rounded-md border border-gray-700"
                />
              )}
              <button
                onClick={requestQrCode}
                className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">
                Soliciar QrCode
              </button>
            </div>
          </section>

          <section>
            <DataTableWithExport data={students} />
          </section>
        </main>

        <footer className="text-center py-4 border-t border-gray-700 bg-gray-900 text-gray-400 text-sm">
          <p>
            Developed by{" "}
            <span className="font-semibold text-gray-200">Matusalém Sousa</span>{" "}
            —{" "}
            <a href="mailto:matusalem@example.com" className="hover:underline">
              matusalem@example.com
            </a>{" "}
            —{" "}
            <a
              href="https://github.com/matusalem2"
              target="_blank"
              className="hover:underline">
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
