import { Badge } from "@/app/components/ui/badge";

export interface CompanyForm {
  company: string;
  count: number;
}

export function CompletedSection() {
  // TODO: also implement the socket logic (and on the backend)

  const companies: CompanyForm[] = [
    { company: "neWave", count: 2 },
    { company: "C3C", count: 5 },
    { company: "Sertanos", count: 2 },
  ];

  return (
    <section className="flex-1 border border-border rounded-xl p-4 flex flex-col overflow-y-auto bg-muted/10">
      <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Formulários Concluídos
      </h2>

      <div className="flex flex-col gap-2">
        {companies.length ? (
          companies.map(({ company, count }) => (
            <div
              key={company}
              className="flex items-center justify-between text-sm border border-border rounded-lg px-3 py-2 bg-background/60 hover:bg-muted/20 transition-colors">
              <span>{company}</span>
              <Badge variant="outline">{count} alunos</Badge>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum formulário concluído
          </p>
        )}
      </div>
    </section>
  );
}
