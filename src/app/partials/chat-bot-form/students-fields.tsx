import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

export type Student = {
  name: string;
  enrollmentNumber: string;
  callNumber: string;
};

interface StudentsFieldsProps {
  students: Student[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: string, value: string) => void;
}

export function StudentsFields({
  students,
  onAdd,
  onRemove,
  onChange,
}: StudentsFieldsProps) {
  return (
    <section className="h-[20vh] space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-foreground">Estagiários</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="gap-1">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      <div className="space-y-6  overflow-y-auto">
        {students.map((student, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`student-name-${index}`}>Nome</Label>
                <Input
                  id={`student-name-${index}`}
                  value={student.name}
                  placeholder="Ex: João Silva"
                  onChange={e => onChange(index, "name", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`student-registration-${index}`}>
                  Matrícula
                </Label>
                <Input
                  id={`student-registration-${index}`}
                  value={student.enrollmentNumber}
                  placeholder="Ex: 20230045"
                  onChange={e =>
                    onChange(index, "registration", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor={`student-call-${index}`}>Nº Chamada</Label>
                <Input
                  id={`student-call-${index}`}
                  value={student.callNumber}
                  placeholder="Ex: 15"
                  onChange={e => onChange(index, "callNumber", e.target.value)}
                />
              </div>
            </div>

            {students.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(index)}
                  className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
