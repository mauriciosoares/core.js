import resolve from '@rollup/plugin-node-resolve';



const GLOBAL_NAME = `glue`;

const commonOutputOptions = {
    // core output options
    name: GLOBAL_NAME,
    // globals: [],

    // advanced output options
    // paths: {},
    // footer: ``,
    // intro: ``,
    // outro: ``,
    // sourcemap,
    // sourcemapFile,
    interop: false,
    extend: false,

    // danger zone
    // exports,
    // indent,
    strict: true,
    // freeze,
    namespaceToStringTag: false

    // experimental
    // entryFileNames,
    // chunkFileNames,
    // assetFileNames
};

export default { // can be an array (for multiple inputs)
    // core input options
    input: `src/workerGlue.js`,     // required
    plugins: [resolve()],
    
    // external: [],

    // advanced input options
    // onwarn,
    // perf,

    // danger zone
    // acorn,
    // acornInjectPlugins,
    treeshake: {
        moduleSideEffects: true,
        moduleSideEffects: `no-external`,
    },
    // context,
    // moduleContext,

    output: [  // required (can be an array, for multiple outputs),
        Object.assign({
            format: `es`,
            file: `dist/tempGlue.js`,
        }, commonOutputOptions),
    ],
};
