import { expect, describe, test } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("$merge", () => {
  test.skipIf(process.env.AJV)("two objects", () => {
    let schema = {
      $merge: {
        source: {
          type: "object",
          properties: { p: { type: "string" } },
          additionalProperties: false,
        },
        with: {
          properties: { q: { type: "number" } },
        },
      },
    };
    const cabidela = new FakeCabidela(schema, { useMerge: true });
    schema = cabidela.getSchema();
    expect(schema).toStrictEqual({
      type: "object",
      properties: { p: { type: "string" }, q: { type: "number" } },
      additionalProperties: false,
    });
  });

  test.skipIf(process.env.AJV)("two objects, with arrays", () => {
    let schema = {
      $merge: {
        source: {
          type: "object",
          properties: { p: [1, 2] },
        },
        with: {
          properties: { p: [3, 4] },
        },
      },
    };
    const cabidela = new FakeCabidela(schema, { useMerge: true });
    schema = cabidela.getSchema();
    expect(schema).toStrictEqual({
      type: "object",
      properties: { p: [1, 2, 3, 4] },
    });
  });

  test.skipIf(process.env.AJV)("two objects, with $defs and $ref", () => {
    let schema = {
      $merge: {
        source: {
          type: "object",
          properties: { p: { type: "string" } },
          additionalProperties: false,
        },
        with: {
          properties: {
            q: {
              type: "string",
              maxLength: { $ref: "$defs#/max_tokens" },
            },
          },
        },
      },
      $defs: {
        max_tokens: 250,
      },
    };
    const cabidela = new FakeCabidela(schema, { useMerge: true });
    schema = cabidela.getSchema();
    expect(schema).toStrictEqual({
      type: "object",
      properties: { p: { type: "string" }, q: { type: "string", maxLength: 250 } },
      additionalProperties: false,
    });
  });
});
