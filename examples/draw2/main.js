import { createCore, useDefaultLogging } from "../../dist/core.es.js";


import * as draw from "./draw.js";
import * as loader_saver from "./loader_saver.js";


const core = createCore();

useDefaultLogging(core);

core.start(loader_saver);
core.start(draw, {name: `draw`});
