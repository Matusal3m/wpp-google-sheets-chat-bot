import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { BotStatusSection } from "./bot-status-section";
import { InProgressSection } from "./in-progress-section";
import { CompletedSection } from "./completed-section";
import { Footer } from "../footer";

export function ChatBotPanel() {
  return (
    <Card className="md:w-1/2 w-full border-border bg-background flex flex-col">
      <CardHeader className="flex items-center justify-between shrink-0">
        <CardTitle className="text-center text-base font-semibold">
          Monitor para chatbot
        </CardTitle>
        <div className="h-9"></div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
        <BotStatusSection />

        <div className="flex md:flex-row flex-col flex-1 gap-4 overflow-hidden">
          <InProgressSection />
          <CompletedSection />
        </div>
      </CardContent>

      <CardFooter className="flex justify-center items-center shrink-0">
        <Footer />
      </CardFooter>
    </Card>
  );
}
