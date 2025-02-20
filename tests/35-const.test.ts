import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("const", () => {
  let schema = {
    type: "string",
    const: "red",
  };

  let validator = new FakeCabidela(schema);

  it("red in red", () => {
    expect(() => validator.validate("red")).not.toThrowError();
  });
  it("blue in not red", () => {
    expect(() => validator.validate("blue")).toThrowError();
  });
});

describe("const without type", () => {
  let schema = {
    const: "red",
  };

  let validator = new FakeCabidela(schema);

  it("red in red", () => {
    expect(() => validator.validate("red")).not.toThrowError();
  });
  it("blue not in red", () => {
    expect(() => validator.validate("blue")).toThrowError();
  });
});
