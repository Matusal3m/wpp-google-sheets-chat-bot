import React from "react";
import { DataTableWithExport } from "../components/data-table";
import { api } from "../lib/api";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "lucide-react";
import { cn } from "../lib/utils";

export type Student = {
  name: string;
  supervisor: {
    phoneNumber: string;
    name: string;
  };
  questionnaire: {
    done: boolean;
  };
};

export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Estagiário",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "questionnaire.done",
    header: "Status da avaliação",
    cell: ({ renderValue }) => {
      const done = renderValue();

      const styles = {
        success:
          "bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5",
        processing:
          "bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5",
      };

      return (
        <div className="flex justify-center">
          <Badge
            className={
              (cn("rounded-full border-none focus-visible:outline-none"),
              done ? styles.success : styles.processing)
            }>
            {done ? "Preenchida" : "Pendente"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "supervisor.name",
    header: "Supervisor",
    cell: ({ renderValue }) => {
      const name = renderValue();
      return (
        <div className="capitalize">
          {name ? String(name) : "Não identificado"}
        </div>
      );
    },
  },
  {
    accessorKey: "supervisor.phoneNumber",
    header: () => <div className="text-right">Número do supervisor</div>,
    cell: ({ renderValue }) => {
      const phoneNumber = renderValue();

      return (
        <div className="text-right font-medium">
          {phoneNumber ? String(phoneNumber) : "Não identificado"}
        </div>
      );
    },
  },
];

export function StudentsTable() {
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

  return (
    <section>
      <DataTableWithExport columns={columns} data={students} />
    </section>
  );
}
