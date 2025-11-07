import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Label } from "@/app/components/ui/label";
import { StudentsFields, type Student } from "./students-fields";
import { Input } from "@/app/components/ui/input";

export type ChatBotFormData = {
  students: Student[];
  phone: string;
};

export function ChatBotForm() {
  const [students, setStudents] = React.useState<Student[]>([
    { name: "", enrollmentNumber: "", callNumber: "" },
  ]);
  const [phone, setPhone] = React.useState("");

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
    const payload = {
      students: students.map(s => s.name),
      phone,
    };

    fetch("/startChat", { method: "POST", body: JSON.stringify(payload) });
  };

  const ref = React.useRef<HTMLButtonElement>(null);

  return (
    <Card className="border-border bg-background flex flex-col">
      <CardHeader className="flex items-center justify-between shrink-0">
        <CardTitle className="text-base font-semibold">
          Cadastro para Chatbot
        </CardTitle>

        <Button
          onClick={_ => ref.current?.click()}
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
          <section className="space-y-4">
            <h2 className="text-base font-medium text-foreground">
              Supervisor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="supervisorPhone">Número</Label>
                <Input
                  id="supervisorPhone"
                  onChange={e => {
                    if (e.target.value.length > 14) return;
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
          </section>
          <Separator />
          <StudentsFields
            students={students}
            onAdd={handleAddStudent}
            onRemove={handleRemoveStudent}
            onChange={handleChangeStudent}
          />

          <button className="invisible" ref={ref}></button>
        </form>
      </CardContent>
    </Card>
  );
}
