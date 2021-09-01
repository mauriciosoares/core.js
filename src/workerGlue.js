"use strict";

import EventEmitter from "event-e3";

import {
    actionKey,
    event,
    CORE_START,
    started,
    stop,
    stopped,
    getState,
    setState,
    error,
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
        [actionKey]: error,
        error: asString,
    });
});


self.addEventListener(`message`, async function(messageEvent) {
    console.log(messageEvent)
    const message = messageEvent.data;
    if (!Object.prototype.hasOwnProperty.call(message, actionKey)) {
        return;
    }
    const action = message[actionKey];
    if (action === event) {
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
                [actionKey]: event,
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
                [actionKey]: error,
                time: Date.now(),
                phase: `module.start`,
                error: errorModuleStart,
            });
        }).then(() => {
            self.postMessage({
                [actionKey]: started,
            });
        });
        return;
    }
    if (action === stop) {
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
                [actionKey]: error,
                time: Date.now(),
                phase: `module.stop`,
                error: errorModuleStop,
            });
        }).then(() => {
            localInstance = undefined;
            self.postMessage({
                [actionKey]: stopped,
            });
        });
        return;
    }

    // todo getState, setState
    self.postMessage({
        [actionKey]: error,
        error: `action ${action} not implemented`,
    });
});

// module code below (defintion of start and stop)
