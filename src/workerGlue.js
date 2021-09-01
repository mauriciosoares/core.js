"use strict";

import EventEmitter from "event-e3";

import {
    CORE_ACTION_KEY,
    CORE_EVENT,
    CORE_START,
    CORE_STARTED,
    CORE_STOP,
    CORE_STOPPED,
    CORE_GET_STATE,
    CORE_SET_STATE,
    CORE_ERROR,
}  from "./workers.js";

let localEmitter;
let localInstance;

self.addEventListener(`error`, function (errorEvent) {
    console.log(errorEvent); // todo
    errorEvent.preventDefault();
    let asString;
    if (errorEvent.message) {
        asString = errorEvent.message;
    } else {
        asString = String(errorEvent);
    }
    self.postMessage({
        [CORE_ACTION_KEY]: CORE_ERROR,
        error: asString,
    });
});


self.addEventListener(`message`, async function(messageEvent) {
    console.log(messageEvent)
    const message = messageEvent.data;
    if (!Object.prototype.hasOwnProperty.call(message, CORE_ACTION_KEY)) {
        return;
    }
    const action = message[CORE_ACTION_KEY];
    if (action === CORE_EVENT) {
        if (!localInstance) {
            return;
        }
        localEmitter.emit(message.name, message.data);
        return;
    }
    if (action === CORE_START) {
        localEmitter = new EventEmitter();
        localEmitter.emit = function (eventName, data) {
            self.postMessage({
                [CORE_ACTION_KEY]: CORE_EVENT,
                name: eventName,
                data,
            });
        };
        
        Promise.resolve().then(() => {
            return start(localEmitter, message.data);
        }).then(instance => {
            localInstance = instance;
        }).catch(errorModuleStart => {
            self.postMessage({
                [CORE_ACTION_KEY]: CORE_ERROR,
                time: Date.now(),
                phase: `module.start`,
                error: errorModuleStart,
            });
        }).then(() => {
            self.postMessage({
                [CORE_ACTION_KEY]: CORE_STARTED,
            });
        });
        return;
    }
    if (action === CORE_STOP) {
        if (!localInstance) {
            // should never happen
            return;
        }
        Promise.resolve().then(() => {
            if (typeof stop === `function`) {
                return stop(wrapper.instance);
            }
        }).catch(errorModuleStop => {
            self.postMessage({
                [CORE_ACTION_KEY]: CORE_ERROR,
                time: Date.now(),
                phase: `module.stop`,
                error: errorModuleStop,
            });
        }).then(() => {
            localInstance = undefined;
            self.postMessage({
                [CORE_ACTION_KEY]: CORE_STOPPED,
            });
        });
        return;
    }

    // todo CORE_GET_STATE, CORE_SET_STATE
    self.postMessage({
        [CORE_ACTION_KEY]: CORE_ERROR,
        error: `action ${action} not implemented`,
    });
});

// module code below (defintion of start and stop)
