import { PhoneInput } from "@/app/components/phone-input";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export function SupervisorFields() {
  return (
    <section className="space-y-4">
      <h2 className="text-base font-medium text-foreground">Supervisor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="supervisorName">Nome</Label>
          <Input id="supervisorName" placeholder="Ex: João" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="supervisorPhone">Número</Label>
          <PhoneInput defaultCountry="BR" limitMaxLength onChange={() => {}} />
        </div>
      </div>
    </section>
  );
}
