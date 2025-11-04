import React from "react";
import { socket } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export function QrCodeDialog() {
  const [qrCode, setQrCode] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const connect = socket.connect.subscribe();

  React.useEffect(() => {
    connect.on("message", ({ data }) => setQrCode(data));

    return () => {
      connect.close();
    };
  }, [connect]);

  const requestQrCode = () => {
    setQrCode("");
    connect.send("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">Solicitar QR Code</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar ao WhatsApp</DialogTitle>
          <DialogDescription>
            Escaneie o QR Code abaixo com o aplicativo WhatsApp para autenticar
            a sessão do bot.
          </DialogDescription>
        </DialogHeader>

        <Separator />
        <Card className="flex flex-col items-center gap-5 p-8 border border-border bg-background">
          {qrCode ? (
            <div className="bg-white p-6 rounded-2xl">
              <img src={qrCode} alt="WhatsApp QR Code" />
            </div>
          ) : (
            <div className="text-base text-muted-foreground py-24">
              Nenhum QR Code gerado ainda
            </div>
          )}

          <Button onClick={requestQrCode} className="mt-4 w-3/4 text-base py-5">
            {qrCode ? "Atualizar QR Code" : "Gerar QR Code"}
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
