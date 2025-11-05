import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { GeneralDataFields } from "./general-data-fields";
import { SupervisorFields } from "./supervisor-fields";
import { StudentsFields, type Student } from "./students-fields";

export type ChatBotFormData = {
  students: Student[];
  companyName: string;
  area: string;
  supervisorName: string;
  supervisorPhone: string;
};

export function ChatBotForm() {
  const [students, setStudents] = React.useState<Student[]>([
    { name: "", enrollmentNumber: "", callNumber: "" },
  ]);

  const handleAddStudent = () =>
    setStudents([
      ...students,
      { name: "", enrollmentNumber: "", callNumber: "" },
    ]);

  const handleRemoveStudent = (index: number) =>
    setStudents(students.filter((_, i) => i !== index));

  const handleChangeStudent = (index: number, field: string, value: string) => {
    const updated = [...students];
    (updated[index] as any)[field] = value;
    setStudents(updated);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: ChatBotFormData = {
      students,
      companyName: formData.get("companyName") as string,
      area: formData.get("area") as string,
      supervisorName: formData.get("supervisorName") as string,
      supervisorPhone: formData.get("supervisorPhone") as string,
    };

    // TODO: implement the logic here
  };

  return (
    <Card className="w-full md:w-[45%] border-border bg-background flex flex-col">
      <CardHeader className="flex items-center justify-between shrink-0">
        <CardTitle className="text-base font-semibold">
          Cadastro para Chatbot
        </CardTitle>

        {/* TODO: implement the chatbot start logic */}
        <Button
          type="submit"
          form="chatbot-form"
          className="h-9 px-4 text-sm rounded-md min-w-[120px]"
          variant="secondary">
          Iniciar Chatbot
        </Button>
      </CardHeader>
      <Separator />

      <CardContent className="flex-1 overflow-y-auto px-4 pb-28">
        <form onSubmit={handleSubmit} className="space-y-8 py-6 min-h-full">
          <GeneralDataFields />
          <SupervisorFields />
          <Separator />
          <StudentsFields
            students={students}
            onAdd={handleAddStudent}
            onRemove={handleRemoveStudent}
            onChange={handleChangeStudent}
          />
        </form>
      </CardContent>
    </Card>
  );
}
