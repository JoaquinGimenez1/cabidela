import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("pattern 1", () => {
  let validator = new FakeCabidela({
    type: "string",
    pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
  });
  it("555-1212 passes", () => {
    expect(() => validator.validate("555-1212")).not.toThrowError();
  });
  it("(888)555-1212 passes", () => {
    expect(() => validator.validate("(888)555-1212")).not.toThrowError();
  });
  it("(888)555-1212 ext. 532 fails", () => {
    expect(() => validator.validate("(888)555-1212 ext. 532")).toThrowError();
  });
});

describe("pattern 2", () => {
  let validator = new FakeCabidela({ type: "string", pattern: "^\\{\\{(.|[\\r\\n])*\\}\\}$" });
  it("{{ foo\\nbar }} passes", () => {
    expect(() => validator.validate("{{ foo\nbar }}")).not.toThrowError();
  });
  it("{ foo } fails", () => {
    expect(() => validator.validate("{ foo }")).toThrowError();
  });
});
