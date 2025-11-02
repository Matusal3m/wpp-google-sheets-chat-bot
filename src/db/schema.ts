import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const supervisors = sqliteTable("supervisors", {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    phoneNumber: text("phone_number").notNull(),
});

export const students = sqliteTable("students", {
    id: int("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    supervisorId: int("supervisor_id")
        .notNull()
        .references(() => supervisors.id, { onDelete: "cascade" }),
});

export const questionnaires = sqliteTable("questionnaires", {
    id: int("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    studentId: int("student_id")
        .notNull()
        .references(() => students.id, { onDelete: "cascade" }),
    defaultOptions: text("default_options").$type<string[]>(),
});

export const questions = sqliteTable("questions", {
    id: int("id").primaryKey({ autoIncrement: true }),
    questionnaireId: int("questionnaire_id")
        .notNull()
        .references(() => questionnaires.id, { onDelete: "cascade" }),
    command: text("command").notNull(),
    response: text("response"),
});
