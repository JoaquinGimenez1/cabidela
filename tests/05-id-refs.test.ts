import { expect, describe, test } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";
import { getMetaData } from "../src/helpers";

describe("ref and subschema", () => {
  const schema = {
    $id: "http://example.com/schemas/main",
    type: "object",
    properties: {
      name: { type: "string" },
      contacts: { $ref: "customer#/contacts" },
      address: { $ref: "customer#/address" },
    },
    required: ["name", "contacts", "address"],
  };

  const contactSchema = {
    $id: "http://example.com/schemas/customer",
    contacts: {
      type: "object",
      properties: {
        email: { type: "string" },
        phone: { type: "string" },
      },
      required: ["email", "phone"],
    },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
        zip: { type: "string" },
        country: { type: "string" },
      },
      required: ["street", "city", "zip", "country"],
    },
  };

  test("instance", () => {
    expect(() => new FakeCabidela(schema, { subSchemas: [contactSchema] }));
  });

  test("consolidated schema", () => {
    const cabidela = new FakeCabidela(schema, { subSchemas: [contactSchema] });
    const cs = cabidela.getSchema();
  });

  test("fail validate", () => {
    const cabidela = new FakeCabidela(schema, { subSchemas: [contactSchema] });
    expect(() =>
      cabidela.validate({
        name: "John",
        contacts: {
          email: "john@example.com",
          phone: "+123456789",
        },
        address: {
          city: "San Francisco",
          zip: "94105",
          country: "USA",
        },
      }),
    ).toThrowError();
  });

  test.skipIf(process.env.AJV)("addSchema, fail validate", () => {
    const cabidela = new FakeCabidela(schema);
    cabidela.addSchema(contactSchema);
    expect(() =>
      cabidela.validate({
        name: "John",
        contacts: {
          email: "john@example.com",
          phone: "+123456789",
        },
        address: {
          city: "San Francisco",
          zip: "94105",
          country: "USA",
        },
      }),
    ).toThrowError();
  });
});
