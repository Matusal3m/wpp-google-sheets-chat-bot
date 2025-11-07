export type AnsweredQuestion = { questionIndex: number; option: string };

export type OnQuestionnaireFinish = (
    answeredQuestions: AnsweredQuestion[]
) => Promise<void> | void;

export type OnQuestionnaireInit = () => Promise<void> | void;

export type OnQuestionnaireOptionException = (
    currentQuestion: string,
    response: number
) => Promise<void> | void;

export class Questioner {
    private nextQuestionIndex = 0;
    private answeredQuestions: AnsweredQuestion[] = [];

    constructor(
        private questions: string[],
        private options: string[],
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

    private buildInTextQuestion(question: string): string {
        let content = question + "\n\n";

        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            content += `[ ${i + 1} ] ${option}\n`;
        }

        return content;
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

    async handleWaitingResponse(response: number) {
        const currentQuestion = this.getCurrentQuestion();

        if (!currentQuestion) return;

        const option = this.options[response];

        if (!option) {
            this.nextQuestionIndex--;
            await this?.onOptionException?.(currentQuestion, response);
            throw new InvalidOptionException(
                "The option sent is invalid: does not match the index or the value."
            );
        }

        this.answeredQuestions.push({
            option,
            questionIndex: this.nextQuestionIndex - 1,
        });

        if (this.isLastResponse()) {
            await this?.onFinish?.(this.answeredQuestions);
        }
    }
}

export class InvalidOptionException extends Error {}
export class NoMoreQuestionsException extends Error {}
