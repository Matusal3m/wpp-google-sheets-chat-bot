import type { Question } from "@prisma/client";

export type AnsweredQuestion = Omit<Question, "response"> & {
    response: string;
};

export type OnQuestionnaireFinish = (
    answeredQuestions: AnsweredQuestion[]
) => Promise<void> | void;

export type OnQuestionnaireInit = () => Promise<void> | void;

export type OnQuestionnaireOptionException = (
    currentQuestion: Question,
    response: string
) => Promise<void> | void;

export class Questioner {
    private nextQuestionIndex = 0;
    private answeredQuestions: AnsweredQuestion[] = [];

    constructor(
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
        return this.answeredQuestions.length === this.questions.length;
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

        this.answeredQuestions.push({
            ...currentQuestion,
            response: option,
        });

        if (this.isLastResponse()) {
            await this?.onFinish?.(this.answeredQuestions);
        }
    }
}

export class InvalidOptionException extends Error {}
export class NoMoreQuestionsException extends Error {}
