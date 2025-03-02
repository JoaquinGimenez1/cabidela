import { expect, test, describe } from "vitest";
import { Cabidela } from "../src";
import { getMetaData } from "../src/helpers";

let schema = {
  type: "object",
  properties: {
    string: {
      type: "string",
      minLength: 1,
      maxLength: 10,
    },
  },
};

describe("new class and validate", () => {
  test("new validator", () => {
    expect(() => new Cabidela(schema)).not.toThrowError();
  });
  test("validate", () => {
    const validator = new Cabidela({});
    // unsure if correct behavior
    expect(() => validator.validate({})).not.toThrowError();
  });
});

// https://json-schema.org/understanding-json-schema/reference/type.html
describe("getMetaData", () => {
  const validator = new Cabidela({});
  test("42 is number", () => {
    expect(getMetaData(42).types).toContain("number");
  });
  test("-1 is number", () => {
    expect(getMetaData(-1).types).toContain("number");
  });
  test("5.0 is number", () => {
    expect(getMetaData(5.0).types).toContain("number");
  });
  test("2.99792458e8 is number", () => {
    expect(getMetaData(2.99792458e8).types).toContain("number");
  });
  test(`"42" is not number`, () => {
    expect(getMetaData("42").types).not.toContain("number");
  });
  test("42 is integer", () => {
    expect(getMetaData(42).types).toContain("integer");
  });
  test("-1 is integer", () => {
    expect(getMetaData(-1).types).toContain("integer");
  });
  test("1.0 is integer", () => {
    expect(getMetaData(1.0).types).toContain("integer");
  });
  test("3.1415926 is not integer", () => {
    expect(getMetaData(3.1415926).types).not.toContain("integer");
  });
  test(`"42" is not integer`, () => {
    expect(getMetaData("42").types).not.toContain("integer");
  });
  test(`"Déjà vu" is string`, () => {
    expect(getMetaData("Déjà vu").types).toContain("string");
  });
  test(`"" is string`, () => {
    expect(getMetaData("").types).toContain("string");
    expect(getMetaData("").size).toBe(0);
  });
  test(`"42" is string`, () => {
    expect(getMetaData("42").types).toContain("string");
    expect(getMetaData("42").size).toBe(2);
  });
  test(`{ "key": "value", "another_key": "another_value" } is object`, () => {
    expect(
      getMetaData({
        key: "value",
        another_key: "another_value",
      }).types,
    ).toContain("object");
  });
  test(`{ "Sun": 1.9891e30, "Jupiter": 1.8986e27, "Saturn": 5.6846e26, ... } is object`, () => {
    expect(
      getMetaData({
        Sun: 1.9891e30,
        Jupiter: 1.8986e27,
        Saturn: 5.6846e26,
        Neptune: 10.243e25,
        Uranus: 8.681e25,
        Earth: 5.9736e24,
        Venus: 4.8685e24,
        Mars: 6.4185e23,
        Mercury: 3.3022e23,
        Moon: 7.349e22,
        Pluto: 1.25e22,
      }).types,
    ).toContain("object");
  });
  /* Hard to validate invalid JSON - WIP
  test(`{ 0.01: "cm", 1: "m", 1000: "km" } is not an object`, () => {
    expect(
      getTypes({
        0.01: "cm",
        1: "m",
        1000: "km",
      }),
    ).not.toContain("object");
  });
  */
  test(`"Not an object" is not an object`, () => {
    expect(getMetaData("Not an object").types).not.toContain("object");
  });
  test(`["An", "array", "not", "an", "object"] is not an object`, () => {
    expect(getMetaData(["An", "array", "not", "an", "object"]).types).not.toContain("object");
  });
  test(`[1, 2, 3, 4, 5] is array`, () => {
    expect(getMetaData([1, 2, 3, 4, 5]).types).toContain("array");
  });
  test(`[3, "different", { "types": "of values" }] is array`, () => {
    expect(getMetaData([3, "different", { types: "of values" }]).types).toContain("array");
  });
  test(`{"Not": "an array"} is not array`, () => {
    expect(getMetaData({ Not: "an array" }).types).not.toContain("array");
  });
  test(`true is boolean`, () => {
    expect(getMetaData(true).types).toContain("boolean");
  });
  test(`false is boolean`, () => {
    expect(getMetaData(false).types).toContain("boolean");
  });
  test(`"true" is not boolean`, () => {
    expect(getMetaData("true").types).not.toContain("boolean");
  });
  test(`0 is not boolean`, () => {
    expect(getMetaData(0).types).not.toContain("boolean");
  });
  test(`null is null`, () => {
    expect(getMetaData(null).types).toContain("null");
  });
  test(`false is not null`, () => {
    expect(getMetaData(false).types).not.toContain("null");
  });
  test(`0 is not null`, () => {
    expect(getMetaData(0).types).not.toContain("null");
  });
  test(`"" is not null`, () => {
    expect(getMetaData("").types).not.toContain("null");
  });
  test(`undefined is not null`, () => {
    expect(getMetaData(undefined).types).not.toContain("null");
  });
  test(`binary array`, () => {
    expect(getMetaData(Array.from({ length: 100 }, (_, i) => i + 1)).types)
      .toContain("array")
      .toContain("binary");
    expect(getMetaData(["a", "b", "c"]).types)
      .toContain("array")
      .toContain("binary");
  });
  test(`object properties`, () => {
    expect(getMetaData({ a: 1, b: 2, c: 3 }).types).toContain("object");
    expect(getMetaData({ a: 1, b: 2, c: 3 }).properties)
      .toContain("a")
      .toContain("b")
      .toContain("c");
    expect(getMetaData({ a: 1, b: 2, c: 3 }).size).toBe(3);
  });
});
