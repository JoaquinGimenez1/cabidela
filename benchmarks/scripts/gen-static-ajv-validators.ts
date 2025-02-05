#!/usr/bin/env NODE_NO_WARNINGS=1 npx tsx

import Ajv from "ajv";
import ajvErrors from "ajv-errors";

import standaloneCode from "ajv/dist/standalone";
import * as fs from "node:fs";
import { twoLevelImageSchema, imageSchema, allOfTwo, anyOfTwo, oneOfTwo, allOfSimple } from "../lib/schemas-n-payloads";

const schemas: any = [];

schemas.push({ ...allOfTwo, $id: "#/definitions/allOfTwo" });
schemas.push({ ...anyOfTwo, $id: "#/definitions/anyOfTwo" });
schemas.push({ ...oneOfTwo, $id: "#/definitions/oneOfTwo" });
schemas.push({ ...imageSchema, $id: "#/definitions/imageSchema" });
schemas.push({ ...twoLevelImageSchema, $id: "#/definitions/twoLevelImageSchema" });
schemas.push({ ...allOfSimple, $id: "#/definitions/allOfSimple" });

const ajv = new Ajv({ allErrors: true, strict: true, strictTypes: false, useDefaults: true, schemas: schemas, code: { source: true } });
ajvErrors(ajv);

ajv.addFormat("binary", true);
const moduleCode: string = standaloneCode(ajv);

// eslint-disable-next-line @typescript-eslint/no-var-requires
// require("ajv/dist/runtime/ucs2length").default;

// fixes https://github.com/ajv-validator/ajv/issues/2209 temporarily
const patchedModuleCode = moduleCode.replace(
  /require\("ajv\/dist\/runtime\/ucs2length"\)\.default/g,
  "function ucs2length(str) { const len = str.length; let length = 0; let pos = 0; let value; while (pos < len) { length++; value = str.charCodeAt(pos++); if (value >= 0xd800 && value <= 0xdbff && pos < len) { value = str.charCodeAt(pos); if ((value & 0xfc00) === 0xdc00) pos++; } } return length; }",
);

console.log(`Writing validators`);
fs.writeFileSync("../../tests/lib/static-validators.js", patchedModuleCode);
