import Elysia, { t } from "elysia";
import {
    QuestionnaireService,
    TCreateQuestionnaireInput,
} from "../services/questionnaire-service";

const service = new QuestionnaireService();

export const questionnaires = new Elysia({ prefix: "questionnaires" })
    .get("/all", async () => ({
        questionnaires: await service.getAll(),
        message: "success",
    }))
    .get(
        "/:id",
        async ({ params: { id } }) => ({
            questionnaire: await service.getById(id),
            message: "success",
        }),
        {
            params: t.Object({ id: t.Number() }),
        }
    )
    .post(
        "/",
        async ({ body }) => ({
            questionnaire: await service.create(body),
            message: "success",
        }),
        {
            body: TCreateQuestionnaireInput,
        }
    )
    .patch(
        "/:id",
        async ({ body, params: { id } }) => ({
            questionnaire: await service.update(id, body),
            message: "success",
        }),
        {
            body: t.Partial(TCreateQuestionnaireInput),
            params: t.Object({ id: t.Number() }),
        }
    )
    .delete(
        "/:id",
        async ({ params: { id } }) => {
            await service.delete(id);
            return {
                message: "success",
            };
        },
        {
            params: t.Object({ id: t.Number() }),
        }
    );
