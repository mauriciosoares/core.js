import { Core, useDefaultLogging } from "../../dist/core.es.js";

import * as draw from "./draw.js";
import * as input from "./input.js";


const core = new Core();

useDefaultLogging(core);

core.start(draw);
core.start(input);
