import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

let schema = {
  type: "object",
  properties: {
    string: {
      type: "string",
      minLength: 1,
      maxLength: 20,
    },
    number: {
      type: "number",
      minimum: 0,
      maximum: 20,
    },
    null: {
      type: "null",
    },
  },
};

const validator = new FakeCabidela(schema);

describe("types", () => {
  it("string is string", () => {
    expect(() => validator.validate({ string: "valid string" })).not.toThrowError();
  });
  it("string is number", () => {
    expect(() => validator.validate({ string: 10 })).toThrowError();
  });
  it("string is object", () => {
    expect(() => validator.validate({ string: {} })).toThrowError();
  });
  it("string is array", () => {
    expect(() => validator.validate({ string: {} })).toThrowError();
  });
  it("null is null", () => {
    expect(() => validator.validate({ null: null })).not.toThrowError();
  });
  it("null is false", () => {
    expect(() => validator.validate({ null: false })).toThrowError();
  });
  it("null is 0", () => {
    expect(() => validator.validate({ null: 0 })).toThrowError();
  });
  it(`null is ""`, () => {
    expect(() => validator.validate({ null: "" })).toThrowError();
  });
});
