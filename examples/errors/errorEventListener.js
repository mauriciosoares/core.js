export { start, stop };


const start = function (emitter) {
    emitter.on(`x`, () => {
        console.log(`event listener error`);
        throw new Error(`event listener error`);
    });
    // console.log('successful start');
};

const stop = function (/*startReturn*/) {
    // console.log('successful stop');
};
