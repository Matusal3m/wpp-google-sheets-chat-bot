import { ChildProcess, fork } from "child_process";
import path from "path";
import fs from "fs";

export interface EventMessage<E> extends Record<string, any> {
    eventName: E;
}

export interface EventMap {
    [eventName: string]: Record<string, any>;
}

export type Listener<Payload> = (message: Payload) => void;

export class BaseIPC<TEvents extends EventMap> {
    protected readonly childrenDir: string = path.join(
        process.cwd(),
        "src/server/ipc"
    );
    protected readonly process: ChildProcess;

    constructor(dir: string, filename: string) {
        this.process = fork(path.join(this.childrenDir, dir, filename), [], {
            detached: true,
        });
    }

    on<E extends Extract<keyof TEvents, string>>(
        eventName: E,
        listener: Listener<TEvents[E]>
    ): void {
        this.process.on("message", (message: unknown) => {
            if (!this.isValidMessage(message, eventName)) return;
            listener(this.stripEventName(message));
        });
    }

    once<E extends Extract<keyof TEvents, string>>(
        eventName: E,
        listener: Listener<TEvents[E]>
    ): void {
        const handler = (message: unknown) => {
            if (!this.isValidMessage(message, eventName)) return;
            this.process.off("message", handler);
            listener(this.stripEventName(message));
        };
        this.process.on("message", handler);
    }

    emit<E extends Extract<keyof TEvents, string>>(
        eventName: E,
        params: TEvents[E]
    ): void {
        this.process.send?.({ eventName, ...params });
    }

    send(args: Record<string, any> = {}): void {
        this.process.send?.(args);
    }

    kill(): void {
        this.process.kill();
    }

    connected() {
        return this.process.connected;
    }

    private isValidMessage<E extends Extract<keyof TEvents, string>>(
        message: unknown,
        event: E
    ): message is EventMessage<E> & TEvents[E] {
        return (
            typeof message === "object" &&
            message !== null &&
            "eventName" in message &&
            (message as any).eventName === event
        );
    }

    private stripEventName<E extends Extract<keyof TEvents, string>>(
        message: EventMessage<E> & TEvents[E]
    ): TEvents[E] {
        const { eventName: _, ...rest } = message;
        return rest as unknown as TEvents[E];
    }
}
