import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("allOf, two properties", () => {
  let schema = {
    allOf: [{ type: "string" }, { maxLength: 5 }],
  };

  let validator = new FakeCabidela(schema);

  it("short string", () => {
    expect(() => validator.validate("short")).not.toThrowError();
  });
  it("long string", () => {
    expect(() => validator.validate("too long")).toThrowError();
  });
});

describe("allOf, two objects", () => {
  let schema = {
    type: "object",
    allOf: [
      {
        properties: {
          string: {
            type: "string",
          },
        },
      },
      {
        properties: {
          number: {
            type: "number",
          },
        },
      },
    ],
  };
  let validator = new FakeCabidela(schema);

  it("string is string, number is number", () => {
    expect(() => validator.validate({ string: "string", number: 10 })).not.toThrowError();
  });
  it("string is string, number is string", () => {
    expect(() => validator.validate({ string: "string", number: "string" })).toThrowError();
  });
});

describe("anyOf, two conditions", () => {
  let schema = {
    anyOf: [
      { type: "string", maxLength: 5 },
      { type: "number", minimum: 0 },
    ],
  };

  let validator = new FakeCabidela(schema);

  it("short string", () => {
    expect(() => validator.validate("short")).not.toThrowError();
  });
  it("too long string", () => {
    expect(() => validator.validate("too long")).toThrowError();
  });
  it("bigger than 0 number", () => {
    expect(() => validator.validate(12)).not.toThrowError();
  });
  it("negative number", () => {
    expect(() => validator.validate(-5)).toThrowError();
  });
});

describe("oneOf, two conditions", () => {
  let schema = {
    oneOf: [
      { type: "number", multipleOf: 5 },
      { type: "number", multipleOf: 3 },
    ],
  };

  let validator = new FakeCabidela(schema);

  it("number is multipleOf", () => {
    expect(() => validator.validate(5)).not.toThrowError();
  });
  it("number is multipleOf", () => {
    expect(() => validator.validate(9)).not.toThrowError();
  });
  it("number is not multipleOf", () => {
    expect(() => validator.validate(2)).toThrowError();
  });
});
