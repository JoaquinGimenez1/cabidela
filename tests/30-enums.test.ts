import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("enum", () => {
  let schema = {
    type: "string",
    enum: ["red", "amber", "green"],
  };

  let validator = new FakeCabidela(schema);

  it("red in enum", () => {
    expect(() => validator.validate("red")).not.toThrowError();
  });
  it("blue not in enum", () => {
    expect(() => validator.validate("blue")).toThrowError();
  });
});

describe("enum without type", () => {
  let schema = {
    enum: ["red", "amber", "green", null, 42],
  };

  let validator = new FakeCabidela(schema);

  it("red in enum", () => {
    expect(() => validator.validate("red")).not.toThrowError();
  });
  it("null in enum", () => {
    expect(() => validator.validate(null)).not.toThrowError();
  });
  it("42 in enum", () => {
    expect(() => validator.validate(42)).not.toThrowError();
  });
  it("0 not in enum", () => {
    expect(() => validator.validate(0)).toThrowError();
  });
});
