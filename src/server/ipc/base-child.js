/**
 * @typedef {Object} MessageData
 * @property {string} eventName
 */

export class BaseChild {
    /**
     * @returns {BaseChild}
     */
    constructor() {
        if (!process.send)
            throw new Error("The current process is not a fork of a process.");
    }

    /**
     * @param {string} event
     * @param {Function} listener
     */
    on(event, listener) {
        process.on("message", ({ eventName, ...rest }) => {
            if (eventName !== event) return;
            listener(rest);
        });
    }

    /**
     * @param {string} event
     * @param {Function} listener
     */
    once(event, listener) {
        const handler = ({ eventName, ...rest }) => {
            if (eventName !== event) return;
            process.removeListener("message", handler);
            listener(rest);
        };

        process.on("message", handler);
    }

    /**
     * @param {string} eventName
     * @param {Object} params
     */
    emit(eventName, params) {
        process.send({ ...params, eventName });
    }

    send(params) {
        process.send(params);
    }
}
