export { start, stop };


const start = function (/*emitter*/) {
    // console.log('successful start')
};

const stop = function (/*startReturn*/) {
    // console.log('successful start')
};


setTimeout(() => {
    throw new Error(`async Runtime error`);
}, 2 ** 10);
