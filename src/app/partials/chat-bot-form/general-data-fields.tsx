import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export function GeneralDataFields() {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-medium text-foreground">Dados gerais</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyName">Nome da empresa</Label>
          <Input id="companyName" placeholder="Ex: neWave Telecom" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="area">Área</Label>
          <Input id="area" placeholder="Ex: Desenvolvimento" />
        </div>
      </div>
    </section>
  );
}
