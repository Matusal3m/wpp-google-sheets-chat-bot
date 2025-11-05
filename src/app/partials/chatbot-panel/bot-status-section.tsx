export interface BotStatus {
  student: string;
  currentQuestion: string;
  answered: number;
  total: number;
}

export function BotStatusSection() {
  // TODO: implement logic with socket here

  const currentStatus: BotStatus = {
    student: "João Silva",
    currentQuestion: "Qual sua área de estágio?",
    answered: 3,
    total: 10,
  };

  return (
    <section className="flex-1 min-h-[40%] border border-border rounded-xl p-4 overflow-y-auto bg-muted/10">
      <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Status Atual
      </h2>

      <div className="space-y-2">
        <p className="text-sm text-foreground">
          <span className="font-medium text-muted-foreground">Aluno:</span>{" "}
          {currentStatus.student}
        </p>
        <p className="text-sm text-foreground">
          <span className="font-medium text-muted-foreground">
            Pergunta atual:
          </span>{" "}
          “{currentStatus.currentQuestion}”
        </p>
        <p className="text-sm text-foreground">
          <span className="font-medium text-muted-foreground">
            Respondidas:
          </span>{" "}
          {currentStatus.answered} de {currentStatus.total}
        </p>
      </div>
    </section>
  );
}
