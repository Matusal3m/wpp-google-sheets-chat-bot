import Elysia, { t } from "elysia";
import {
    QuestionnaireService,
    TCreateQuestionnaireInput,
} from "../services/questionnaire-service";

const service = new QuestionnaireService();

export const questionnaires = new Elysia({ prefix: "questionnaires" })
    .get("/", async () => ({
        data: await service.getAll(),
        message: "success",
    }))
    .get(
        "/:id",
        async ({ params: { id } }) => ({
            data: await service.getById(id),
            message: "success",
        }),
        {
            params: t.Object({ id: t.Number() }),
        }
    )
    .post(
        "/",
        async ({ body }) => ({
            data: await service.create(body),
            message: "success",
        }),
        {
            body: TCreateQuestionnaireInput,
        }
    )
    .patch(
        "/:id",
        async ({ body, params: { id } }) => ({
            data: await service.update(id, body),
            message: "success",
        }),
        {
            body: t.Partial(TCreateQuestionnaireInput),
            params: t.Object({ id: t.Number() }),
        }
    )
    .delete(
        "/:id",
        async ({ params: { id } }) => ({
            data: await service.delete(id),
            message: "success",
        }),
        {
            params: t.Object({ id: t.Number() }),
        }
    );
