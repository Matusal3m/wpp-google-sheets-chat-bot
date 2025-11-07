import React, { useEffect } from "react";
import { socket } from "../lib/api";
import { ModeToggle } from "../components/mode-toggle";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { QrCodeDialog } from "./qrcode-panel";

export type BotStatus = {
  up: boolean;
  isLogged: boolean;
  isLoadingQrCode: boolean;
};

export function Header() {
  const [status, setStatus] = React.useState<BotStatus>({
    up: false,
    isLoadingQrCode: false,
    isLogged: false,
  });
  const botStatus = socket.status.subscribe();

  botStatus.on("message", ({ data }) => {
    console.log(data);
    setStatus(data);
  });

  return (
    <Card className="rounded-none border-b border-border shadow-none bg-background">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <CardTitle className="text-lg font-semibold text-foreground">
          Painel de controle do chatbot
        </CardTitle>

        <div className="flex items-center gap-4">
          <QrCodeDialog status={status} />
          <Badge
            variant={"secondary"}
            className={
              status.up
                ? "border-green-500 text-green-600 dark:text-green-400"
                : "border-red-500 text-red-600 dark:text-red-400"
            }>
            {status.up ? "Conectado" : "Offline"}
          </Badge>
          <ModeToggle />
        </div>
      </CardHeader>
    </Card>
  );
}
