import {storeWorkerCodeFromIIFEFile} from "../src/prepareWorkerCode.js";

const source = "./examples/gameOfLife/gameOfLife.js";
// todo convert to iife first
const destination = "./examples/gameOfLife/gameOfLifeWorkerReady.js";
storeWorkerCodeFromIIFEFile(source, destination);
