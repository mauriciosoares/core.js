// rollup.config.js
import _package from "../package.json";

const {version, name, license} = _package;
const GLOBAL_NAME = `core`;
const banner = `/*  ${name} v${version} ${new Date().toJSON()} licensed ${license} */`;

	const commonOutputOptions = {
	// core output options
	name : GLOBAL_NAME,
	// globals: [],

	// advanced output options
	// paths: {},
	banner,
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
  input: `src/core/core.js`,     // required
  // external: [],
  //plugins: [],

  // advanced input options
  // onwarn,
  // perf,

  // danger zone
  // acorn,
  // acornInjectPlugins,
  treeshake: {
	  pureExternalModules: false,
	  propertyReadSideEffects: false // assume reading properties has no side effect
  },
  // context,
  // moduleContext,


  output: [  // required (can be an array, for multiple outputs),
    Object.assign({
        format: `es`,
        file : `dist/core.js`,
    }, commonOutputOptions),
	Object.assign({
		format: `iife`,
		file : `dist/core.iife.js`,
	}, commonOutputOptions),
	Object.assign({
		format: `umd`,
		file : `dist/core.umd.js`,
		amd: {
			id: GLOBAL_NAME
		}
	}, commonOutputOptions)
  ],

  watch: {
    // chokidar,
    // include,
    // exclude,
    clearScreen: true
  }
};
