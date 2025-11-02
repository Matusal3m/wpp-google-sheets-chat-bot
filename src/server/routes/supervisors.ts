import Elysia, { t } from "elysia";
import {
    SupervisorService,
    TCreateSupervisorInput,
} from "../services/supervisor-service";

const service = new SupervisorService();

export const supervisors = new Elysia({ prefix: "supervisors" })
    .get("/all", async () => ({
        supervisors: await service.getAll(),
        message: "success",
    }))
    .get(
        "/:id",
        async ({ params: { id } }) => ({
            supervisor: await service.getById(id),
            message: "success",
        }),
        {
            params: t.Object({ id: t.Number() }),
        }
    )
    .post(
        "/",
        async ({ body }) => ({
            supervisor: await service.create(body),
            message: "success",
        }),
        {
            body: TCreateSupervisorInput,
        }
    )
    .patch(
        "/:id",
        async ({ body, params: { id } }) => ({
            supervisor: await service.update(id, body),
            message: "success",
        }),
        {
            body: t.Partial(TCreateSupervisorInput),
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
