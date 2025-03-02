import { expect, describe, test } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("not", () => {
  let schema = {
    not: { type: "string" },
  };
  const cabidela = new FakeCabidela(schema);
  test("42 is not string", () => {
    expect(() => cabidela.validate(42)).not.toThrowError();
  });
  test("object is not string", () => {
    expect(() => cabidela.validate({ "key": "value" })).not.toThrowError();
  });
  test("string is string", () => {
    expect(() => cabidela.validate("i'm a string")).toThrowError();
  });
});
