import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("additionalProperties: false", () => {
  let schema = {
    type: "object",
    properties: {
      number: { type: "number" },
      street_name: { type: "string" },
      street_type: { enum: ["Street", "Avenue", "Boulevard"] },
    },
    additionalProperties: false,
  };

  let validator = new FakeCabidela(schema);

  it("no additional", () => {
    expect(() =>
      validator.validate({ number: 1600, street_name: "Pennsylvania", street_type: "Avenue" }),
    ).not.toThrowError();
  });
  test.skipIf(process.env.AJV)("additional", () => {
    expect(() =>
      validator.validate({ number: 1600, street_name: "Pennsylvania", street_type: "Avenue", direction: "NW" }),
    ).toThrowError();
  });
});

describe(`additionalProperties: { "type": "string" }`, () => {
  let schema = {
    type: "object",
    properties: {
      number: { type: "number" },
      street_name: { type: "string" },
      street_type: { enum: ["Street", "Avenue", "Boulevard"] },
    },
    additionalProperties: { type: "string" },
  };
  let validator = new FakeCabidela(schema);

  it("no additional", () => {
    expect(() =>
      validator.validate({ number: 1600, street_name: "Pennsylvania", street_type: "Avenue" }),
    ).not.toThrowError();
  });
  it("additional", () => {
    expect(() =>
      validator.validate({ number: 1600, street_name: "Pennsylvania", street_type: "Avenue", direction: "NW" }),
    ).not.toThrowError();
  });
  it("additional failing", () => {
    expect(() =>
      validator.validate({ number: 1600, street_name: "Pennsylvania", street_type: "Avenue", office_number: 201 }),
    ).toThrowError();
  });
});

describe(`additionalProperties: extended schemas`, () => {
  let schema = {
    allOf: [
      {
        type: "object",
        properties: {
          street_address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
        },
        required: ["street_address", "city", "state"],
        additionalProperties: false,
      },
    ],
    properties: {
      type: { enum: ["residential", "business"] },
    },
    required: ["type"],
  };
  let validator = new FakeCabidela(schema);
  it("type not allowed", () => {
    expect(() =>
      validator.validate({
        street_address: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        state: "DC",
        type: "business",
      }),
    ).toThrowError();
  });
  it("type is required", () => {
    expect(() =>
      validator.validate({
        street_address: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        state: "DC",
      }),
    ).toThrowError();
  });
});

describe(`additionalProperties: combined extended schemas`, () => {
  let schema = {
    allOf: [
      {
        type: "object",
        properties: {
          street_address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
        },
        required: ["street_address", "city", "state"],
      },
    ],
    properties: {
      street_address: true,
      city: true,
      state: true,
      type: { enum: ["residential", "business"] },
    },
    required: ["type"],
    additionalProperties: false,
  };
  let validator = new FakeCabidela(schema);
  it("type allowed", () => {
    expect(() =>
      validator.validate({
        street_address: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        state: "DC",
        type: "business",
      }),
    ).not.toThrowError();
  });
  test.skipIf(process.env.AJV)("something that doesn't belong", () => {
    expect(() =>
      validator.validate({
        street_address: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        state: "DC",
        type: "business",
        "something that doesn't belong": "hi!",
      }),
    ).toThrowError();
  });
  test.skipIf(process.env.AJV)("should fail", () => {
    let schema = {
      allOf: [
        {
          type: "object",
          properties: {
            street_address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
          },
          required: ["street_address", "city", "state"],
        },
      ],
      properties: {
        type: { enum: ["residential", "business"] },
      },
      required: ["type"],
      additionalProperties: false,
    };
    let validator = new FakeCabidela(schema);
    expect(() =>
      validator.validate({
        street_address: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        state: "DC",
        type: "business",
      }),
    ).toThrowError();
  });
});

describe(`unevaluatedProperties`, () => {
  let schema = {
    allOf: [
      {
        type: "object",
        properties: {
          street_address: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
        },
        required: ["street_address", "city", "state"],
      },
    ],

    properties: {
      type: { enum: ["residential", "business"] },
    },
    required: ["type"],
    unevaluatedProperties: false,
  };
  let validator = new FakeCabidela(schema);
  it("recognize properties declared in subschemas", () => {
    expect(() =>
      validator.validate({
        street_address: "1600 Pennsylvania Avenue NW",
        city: "Washington",
        state: "DC",
        type: "business",
      }),
    ).not.toThrowError();
  });
});

describe(`Size`, () => {
  let schema = {
    type: "object",
    minProperties: 2,
    maxProperties: 3,
  };
  let validator = new FakeCabidela(schema);
  it("0 properties", () => {
    expect(() => validator.validate({})).toThrowError();
    expect(() => validator.validate({ a: 0 })).toThrowError();
    expect(() => validator.validate({ a: 0, b: 1 })).not.toThrowError();
  });
  it("1 property", () => {
    expect(() => validator.validate({ a: 0 })).toThrowError();
  });
  it("2 properties", () => {
    expect(() => validator.validate({ a: 0, b: 1 })).not.toThrowError();
  });
  it("3 properties", () => {
    expect(() => validator.validate({ a: 0, b: 1, c: 2 })).not.toThrowError();
  });
  it("4 properties", () => {
    expect(() => validator.validate({ a: 0, b: 1, c: 2, d: 3 })).toThrowError();
  });
});
