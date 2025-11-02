import { db } from "@/prisma";
import type { Question } from "@prisma/client";

export type Response = {
    option: string;
    question: Question;
};

export type OnQuestionnaireFinish = (
    responses: Response[]
) => Promise<void> | void;

export type OnQuestionnaireInit = () => Promise<void> | void;

export type OnQuestionnaireOptionException = (
    currentQuestion: Question,
    response: string
) => Promise<void> | void;

export class Questioner {
    private nextQuestionIndex = 0;
    private responses: Response[] = [];

    constructor(
        private questionnaireId: number,
        private questions: Question[],
        public onFinish?: OnQuestionnaireFinish,
        public onInit?: OnQuestionnaireInit,
        public onOptionException?: OnQuestionnaireOptionException
    ) {}

    private getCurrentQuestion() {
        return this.questions[this.nextQuestionIndex - 1];
    }

    private getNextQuestion() {
        return this.questions[this.nextQuestionIndex];
    }

    private isInitialQuestion() {
        return this.nextQuestionIndex === 0;
    }

    private buildInTextQuestion(question: Question): string {
        if (!question.options) return question.command;

        let content = question.command + "\n\n";

        for (let i = 0; i < question.options.length; i++) {
            const option = question.options[i];
            content += `[ ${i + 1} ] ${option}\n`;
        }

        return content;
    }

    private getRelatedOption(question: Question, response: string) {
        if (!question.options) return response;

        response = response.trim();

        const matchIndex = (index: number) => index === Number(response) - 1;
        const matchValue = (option: string) =>
            option.toLowerCase() === response.toLowerCase();

        return question.options.find(
            (option, index) => matchIndex(index) || matchValue(option)
        );
    }

    private isLastResponse() {
        return this.responses.length === this.questions.length;
    }

    private normalizeResponses(responses: Response[]) {
        const result = [];

        for (const response of responses) {
            result.push({
                id: response.question.id,
                command: response.question.command,
                questionnaireId: this.questionnaireId,
                response: String(response.option),
            });
        }

        return result;
    }

    async nextQuestion() {
        if (this.isInitialQuestion()) {
            await this?.onInit?.();
        }

        const question = this.getNextQuestion();

        if (!question) {
            throw new NoMoreQuestionsException(
                "The is no more questions available on the quesitonnaire."
            );
        }

        this.nextQuestionIndex++;

        return { raw: question, inText: this.buildInTextQuestion(question) };
    }

    async handleWaitingResponse(response: string) {
        const currentQuestion = this.getCurrentQuestion();

        if (!currentQuestion) return;

        const option = this.getRelatedOption(currentQuestion, response);

        if (!option) {
            this.nextQuestionIndex--;

            await this?.onOptionException?.(currentQuestion, response);

            throw new InvalidOptionException(
                "The option sent is invalid: does not match the index or the value."
            );
        }

        this.responses.push({
            question: currentQuestion,
            option: option,
        });

        if (this.isLastResponse()) {
            await this?.onFinish?.(this.responses);
        }
    }

    async save(responses?: Response[]) {
        const normalizedQuestions = this.normalizeResponses(
            responses ?? this.responses
        );

        const promises = [];
        for (const { id, ...question } of normalizedQuestions) {
            promises.push(
                db.question.update({
                    data: question,
                    where: { id },
                })
            );
        }

        try {
            await Promise.all(promises);
            console.info(
                `Saved questions to Questionnaire ${this.questionnaireId}.`
            );
        } catch (error) {
            console.error(
                `Something whent wrong saving questions of questionnaire ${this.questionnaireId}.`
            );
            console.error(error);
        }
    }
}

export class InvalidOptionException extends Error {}
export class NoMoreQuestionsException extends Error {}
