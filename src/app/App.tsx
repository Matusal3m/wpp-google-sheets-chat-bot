import React from "react";
import { DataTableWithExport, type Student } from "./components/data-table";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { api, socket } from "./lib/api";
import "./index.css";
import { Button } from "./components/ui/button";

export function App() {
  const chatbot = socket.health.subscribe();
  const qr = socket.qr.subscribe();

  const [connected, setConnected] = React.useState(false);

  chatbot.on("message", message => {
    setConnected(message.data);
  });

  const callHealth = () => chatbot.send("oi");
  const requestQr = () => qr.send("qr code");

  return (
    <div>
      <p>Conectado: {JSON.stringify(connected)}</p>
      <div className="flex flex-col">
        <Button onClick={callHealth}>Fazer chamada</Button>
        <Button onClick={requestQr}>Solicitar qrcode</Button>
      </div>
    </div>
  );
}

export default App;
// const [students, setStudents] = React.useState<Student[]>([]);
// const [qrCode, setQrCode] = React.useState<string | null>(null);
// const [botStatus, setBotStatus] = React.useState<
//   "connected" | "disconnected" | "connecting"
// >("disconnected");

// const fetchStudents = async () => {
//   const { data } = await api.students.all.get({ query: { full: true } });
//   const students = data?.students;
//   if (!students?.length) return;

//   const filtered: Student[] = students
//     .map(student => {
//       if (!("Questionnaire" in student)) return;
//       if (student.Questionnaire && !("Questions" in student.Questionnaire))
//         return;

//       return {
//         name: student.name,
//         questionnaire: {
//           done:
//             student.Questionnaire?.Questions.every(q => !!q.response) ||
//             false,
//         },
//         supervisor: {
//           name: student.Supervisor.name,
//           phoneNumber: student.Supervisor.phoneNumber,
//         },
//       };
//     })
//     .filter(s => !!s);

//   setStudents(filtered);
// };

// const fetchQRCode = async () => {
//   setBotStatus("connecting");
//   try {
//     const { data } = await api.chatbot.qr.get();
//     setQrCode(data?.qr || null);
//     setBotStatus("disconnected");
//   } catch {
//     setBotStatus("disconnected");
//   }
// };

// React.useEffect(() => {
//   fetchStudents();
//   fetchQRCode();
// }, []);

// return (
//   <ThemeProvider defaultTheme="dark" storageKey="theme">
//     <div className="flex flex-col min-h-screen">
//       {/* HEADER */}
//       <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
//         <h1 className="text-xl font-bold">Bot Control Panel</h1>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span
//               className={`w-3 h-3 rounded-full ${
//                 botStatus === "connected"
//                   ? "bg-green-500"
//                   : botStatus === "connecting"
//                   ? "bg-yellow-500"
//                   : "bg-red-500"
//               }`}
//             />
//             <span className="text-sm capitalize">{botStatus}</span>
//           </div>

//           <ModeToggle />
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-950">
//         {/* QR CODE SECTION */}
//         <section className="flex justify-center">
//           <div className="flex flex-col items-center gap-3 border border-gray-800 rounded-2xl p-6 bg-gray-900">
//             <h2 className="text-lg font-semibold">WhatsApp Connection</h2>
//             {qrCode ? (
//               <img
//                 src={qrCode}
//                 alt="WhatsApp QR Code"
//                 className="w-56 h-56 rounded-md border border-gray-700"
//               />
//             ) : (
//               <p className="text-gray-400 text-sm">Loading QR Code...</p>
//             )}
//             <button
//               onClick={fetchQRCode}
//               className="mt-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">
//               Refresh QR Code
//             </button>
//           </div>
//         </section>

//         {/* STUDENTS TABLE */}
//         <section>
//           <DataTableWithExport data={students} />
//         </section>
//       </main>

//       {/* FOOTER */}
//       <footer className="text-center py-4 border-t border-gray-700 bg-gray-900 text-gray-400 text-sm">
//         <p>
//           Developed by{" "}
//           <span className="font-semibold text-gray-200">Matusalém Sousa</span>{" "}
//           —{" "}
//           <a href="mailto:matusalem@example.com" className="hover:underline">
//             matusalem@example.com
//           </a>{" "}
//           —{" "}
//           <a
//             href="https://github.com/matusalem2"
//             target="_blank"
//             className="hover:underline">
//             GitHub
//           </a>
//         </p>
//       </footer>
//     </div>
//   </ThemeProvider>
// );
