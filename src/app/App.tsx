import { DataTableWithExport, type Student } from "./components/data-table";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import { api } from "./lib/api";
import React from "react";

export function App() {
  const [students, setStudents] = React.useState<Student[]>([]);

  const fetchStudents = async () => {
    const { data } = await api.students.all.get({ query: { full: true } });

    const students = data?.students;
    if (!students?.length) return;

    const filtered: Student[] = students
      .map(student => {
        if (!("Questionnaire" in student)) return;
        if (student.Questionnaire && !("Questions" in student.Questionnaire))
          return;

        return {
          name: student.name,
          questionnaire: {
            done:
              student.Questionnaire?.Questions.every(q => !!q.response) ||
              false,
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

  React.useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <DataTableWithExport data={students} />
    </ThemeProvider>
  );
}

export default App;
