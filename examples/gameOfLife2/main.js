import { createCore, useDefaultLogging } from "../../dist/core.es.js";

const simplestModule = `./test.js`;

import * as timeModule from "./time.js";
import * as status from "./status.js";
import * as loaderSaver from "./loaderSaver.js";
import * as game from "./game.js";

const core = createCore();
useDefaultLogging(core);

const start  = async () => {
    await core.start(timeModule);
    await core.start(status)
    await core.start(loaderSaver);
    await core.start(game);
};


start().catch(console.error);
