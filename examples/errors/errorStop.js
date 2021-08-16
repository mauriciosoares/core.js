export { start, stop };


const start = function (/*emitter*/) {
    // console.log('successful start');
};

const stop = function (/*startReturn*/) {
    throw new Error(`force error during stop`);
};
