import { Badge } from "@/app/components/ui/badge";

export function InProgressSection() {
  const students = [
    "Matusalém de Sousa",
    "Kayo Lucas Lima",
    "Isaac Sales Rodrigues",
  ];

  // TODO: implement the logic here

  return (
    <section className="md:w-1/3 w-full border border-border rounded-xl p-4 flex flex-col overflow-y-auto bg-muted/10">
      <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Em andamento
      </h2>

      <div className="flex flex-col gap-2">
        {students.length ? (
          students.map(student => (
            <div
              key={student}
              className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2 bg-background/60 hover:bg-muted/20 transition-colors">
              <span>{student}</span>
              <Badge variant="secondary">Esperando</Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum aluno em andamento
          </p>
        )}
      </div>
    </section>
  );
}
