export { start, stop };


const start = function (emitter) {
    console.log('successful start')
};

const stop = function (emitter) {
    throw `Error`;
};
