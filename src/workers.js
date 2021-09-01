export {
    actionKey,
    CORE_EVENT,
    CORE_START,
    started,
    stop,
    stopped,
    getState,
    setState,
    error,
};

// prefix to avoid variable name collision
const actionKey = `action`;

// actions
const CORE_EVENT = `event`;
const CORE_START = `CORE_START`;
const started = `started`;
const stop = `stop`;
const stopped = `stopped`;
const getState = `getState`;
const setState = `setState`;
const error = `error`;
