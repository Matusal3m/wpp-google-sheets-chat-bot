import Elysia, { t } from "elysia";
import {
    StudentService,
    TCreateStudentInput,
} from "../services/student-service";

const service = new StudentService();

export const students = new Elysia({ prefix: "students" })
    .decorate("service", service)
    .get("/all", async () => ({
        students: await service.getAll(),
        message: "success",
    }))
    .get(
        "/:id",
        async ({ params: { id } }) => ({
            student: await service.getById(id),
            message: "success",
        }),
        {
            params: t.Object({ id: t.Number() }),
        }
    )
    .post(
        "/",
        async ({ body }) => ({
            student: await service.create(body),
            message: "success",
        }),
        {
            body: TCreateStudentInput,
            error({ error }) {
                console.log({ error });
            },
        }
    )
    .patch(
        "/:id",
        async ({ body, params: { id } }) => ({
            student: await service.update(id, body),
            message: "success",
        }),
        {
            body: t.Partial(TCreateStudentInput),
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
