import Elysia, { t } from "elysia";
import {
    SupervisorService,
    TCreateSupervisorInput,
} from "../services/supervisor-service";

const service = new SupervisorService();

export const supervisors = new Elysia({ prefix: "supervisors" })
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
            body: TCreateSupervisorInput,
        }
    )
    .patch(
        "/:id",
        async ({ body, params: { id } }) => ({
            data: await service.update(id, body),
            message: "success",
        }),
        {
            body: t.Partial(TCreateSupervisorInput),
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
