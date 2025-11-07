import React from "react";
import { ModeToggle } from "../components/mode-toggle";
import { Badge } from "../components/ui/badge";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { QrCodeDialog } from "./qrcode-panel";
import type { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "socket.io";

export type BotStatus = {
  up: boolean;
  isLogged: boolean;
  isLoadingQrCode: boolean;
};

export function Header({
  socket,
}: {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}) {
  const [status, setStatus] = React.useState<BotStatus>({
    up: false,
    isLoadingQrCode: false,
    isLogged: false,
  });

  socket.on("status:update", data => {
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
          <QrCodeDialog status={status} socket={socket} />
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
