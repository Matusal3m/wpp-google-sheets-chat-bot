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
import { Loader2 } from "lucide-react";
import type { BotStatus } from "./header";

export function QrCodeDialog({ status }: { status: BotStatus }) {
  const [qrCode, setQrCode] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [socketOpen, setSocketOpen] = React.useState(false);

  const qr = socket.qrcode.subscribe();

  qr.on("open", () => setSocketOpen(true));
  qr.on("message", ({ data }) => {
    setQrCode(data);
  });

  const requestQrCode = () => {
    setQrCode("");
    qr.send("");
  };

  const disabled = status.isLogged || status.isLoadingQrCode;

  return (
    <Dialog open={open || status.isLoadingQrCode} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className="flex items-center gap-2">
          {status.isLoadingQrCode && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {status.isLoadingQrCode
            ? "Carregando..."
            : status.isLogged
            ? "Bot conectado"
            : "Solicitar QR Code"}
        </Button>
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
          {status.isLoadingQrCode ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p>Gerando QR Code...</p>
            </div>
          ) : qrCode ? (
            <div className="bg-white p-6 rounded-2xl">
              <img src={qrCode} alt="WhatsApp QR Code" />
            </div>
          ) : (
            <div className="text-base text-muted-foreground py-24">
              Nenhum QR Code gerado ainda
            </div>
          )}

          <Button
            onClick={requestQrCode}
            disabled={!socketOpen || disabled}
            className={`${
              socketOpen ? "cursor-pointer" : "cursor-not-allowed"
            } mt-4 w-3/4 text-base py-5`}>
            {status.isLoadingQrCode ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Carregando...
              </>
            ) : qrCode ? (
              "Atualizar QR Code"
            ) : (
              "Gerar QR Code"
            )}
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
