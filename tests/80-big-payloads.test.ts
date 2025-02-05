import { expect, describe, test } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("Big array payload", () => {
  let schema = {
    type: "object",
    properties: {
      image: {
        type: "array",
        items: {
          type: "number",
        },
      },
    },
    required: ["image"],
  };

  let validator = new FakeCabidela(schema);

  const big10000 = Array.from({ length: 10000 }, (_, i) => i + 1);
  test("10000", () => {
    expect(() =>
      validator.validate({
        image: big10000,
      }),
    ).not.toThrowError();
  });
  const big100000 = Array.from({ length: 100000 }, (_, i) => i + 1);
  test("100000", () => {
    expect(() =>
      validator.validate({
        image: big100000,
      }),
    ).not.toThrowError();
  });
  const big1000000 = Array.from({ length: 1000000 }, (_, i) => i + 1);
  test("1000000", () => {
    expect(() =>
      validator.validate({
        image: big1000000,
      }),
    ).not.toThrowError();
  });
  const big10000000 = Array.from({ length: 10000000 }, (_, i) => i + 1);
  test("10000000", () => {
    expect(() =>
      validator.validate({
        image: big10000000,
      }),
    ).not.toThrowError();
  });
});

describe("Big object payload", () => {
  let schema = {
    type: "object",
    properties: {
      child: {
        type: "object",
        properties: {
          image: {
            type: "array",
            items: {
              type: "number",
            },
          },
        },
        required: ["image"],
      },
    },
  };

  let validator = new FakeCabidela(schema);

  const nestedPayload = (depth) =>
    Array.from({ length: depth }, () => "child").reduce(
      (prev, current) => ({ [current]: { image: Array.from({ length: 100 }, (_, i) => i + 1), ...prev } }),
      {},
    );

  test("100 levels deep nested payload", () => {
    expect(() => validator.validate(nestedPayload(100))).not.toThrowError();
  });
  test("1000 levels deep nested payload", () => {
    expect(() => validator.validate(nestedPayload(1000))).not.toThrowError();
  });
  test("10000 levels deep nested payload", () => {
    expect(() => validator.validate(nestedPayload(10000))).not.toThrowError();
  });
});

describe("Deep schema, deep payload", () => {
  const nestedSchema = (depth) =>
    Array.from({ length: depth }, () => "properties").reduce(
      (prev, current) => ({
        type: "object",
        [current]: {
          image: {
            type: "array",
            items: {
              type: "number",
            },
          },
          child: {
            ...prev,
          },
        },
        required: ["image", "child"],
      }),
      {
        type: "object",
        properties: {
          image: {
            type: "array",
            items: {
              type: "number",
            },
          },
        },
        required: ["image"],
      },
    );

  const nestedPayload = (depth) =>
    Array.from({ length: depth }, () => "child").reduce(
      (prev, current) => ({ image: Array.from({ length: 100 }, (_, i) => i + 1), [current]: { ...prev } }),
      {
        image: Array.from({ length: 100 }, (_, i) => i + 1),
      },
    );

  test("10 levels deep nested schema and payload", () => {
    let validator = new FakeCabidela(nestedSchema(10));
    expect(() => validator.validate(nestedPayload(10))).not.toThrowError();
  });
  test("100 levels deep nested schema and payload", () => {
    let validator = new FakeCabidela(nestedSchema(100));
    expect(() => validator.validate(nestedPayload(100))).not.toThrowError();
  });
  test.skipIf(process.env.AJV)("1000 levels deep nested schema and payload", () => {
    let validator = new FakeCabidela(nestedSchema(1000));
    expect(() => validator.validate(nestedPayload(1000))).not.toThrowError();
  });
});
