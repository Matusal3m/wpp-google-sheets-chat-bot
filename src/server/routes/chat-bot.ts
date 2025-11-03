import Elysia, { t } from "elysia";
import { ChatBotService } from "../services/chat-bot-service";
import Wpp from "@wppconnect-team/wppconnect";

const client = await Wpp.create({
    autoClose: 0,
});
const chatBotService = new ChatBotService(client);

export const chatbot = new Elysia({ prefix: "chatbot" }).post(
    "/start-questionnaire",
    ({ body: { questionnaireId, studentName, to } }) => {
        chatBotService.startStudentEvaluationQuestionnaire(
            to,
            studentName,
            questionnaireId
        );
    },
    {
        body: t.Object({
            to: t.String(),
            studentName: t.String(),
            questionnaireId: t.Number(),
        }),
    }
);
