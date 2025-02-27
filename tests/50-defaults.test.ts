import { expect, test, describe, it } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

let cabidela = new FakeCabidela({}, { applyDefaults: true });

describe("applyDefaults", () => {
  it("top level", () => {
    cabidela.setSchema({
      type: "object",
      properties: {
        prompt: { type: "string" },
        temperature: { type: "number", default: 10 },
      },
    });
    const payload: any = { prompt: "tell me a joke" };
    cabidela.validate(payload);
    expect(payload.temperature).toStrictEqual(10);
  });
  it("defaults can meet 'required' constraints", () => {
    cabidela.setSchema({
      type: "object",
      properties: {
        prompt: { type: "string" },
        temperature: { type: "number", default: 10 },
      },
      required: ["temperature"],
    });
    const payload: any = { prompt: "tell me a joke" };
    cabidela.validate(payload);
    expect(payload.temperature).toStrictEqual(10);
  });
  it("defaults in arrays", () => {
    cabidela.setSchema({
      type: "object",
      properties: {
        prompt: {
          type: "string",
        },
        messages: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: {
                type: "string",
                default: "system",
              },
              content: {
                type: "string",
                description: "The content of the message as a string.",
              },
            },
            required: ["content", "role"],
          },
        },
      },
      required: ["messages"],
    });
    const payload: any = {
      messages: [
        { content: "tell me a joke" },
        { content: "second item too" },
        { role: "user", content: "no need for default" },
      ],
    };
    cabidela.validate(payload);
    expect(payload.messages[0].role).toStrictEqual("system");
    expect(payload.messages[1].role).toStrictEqual("system");
    expect(payload.messages[2].role).toStrictEqual("user");
  });
  // AJv does not support default values for oneOf
  // See "Unexpected results when using removeAdditional with anyOf/oneOf" at https://ajv.js.org/guide/modifying-data.html
  // https://github.com/ajv-validator/ajv/issues/127
  test.skipIf(process.env.AJV)("deep defaults non existant object", () => {
    cabidela.setSchema({
      oneOf: [
        {
          type: "object",
          contentType: "application/json",
          properties: {
            response: {
              type: "string",
              description: "The generated text response from the model",
            },
            usage: {
              type: "object",
              description: "Usage statistics for the inference request",
              properties: {
                prompt_tokens: {
                  type: "number",
                  description: "Total number of tokens in input",
                  default: 0,
                },
                completion_tokens: {
                  type: "number",
                  description: "Total number of tokens in output",
                  default: 0,
                },
                total_tokens: {
                  type: "number",
                  description: "Total number of input and output tokens",
                  default: 0,
                },
              },
            },
          },
        },
      ],
    });
    const payload: any = {
      response: "a joke",
    };
    cabidela.validate(payload);
    expect(payload).toStrictEqual({
      response: "a joke",
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    });
  });
});

describe("oneOf defaults", () => {
  let schema = {
    type: "object",
    oneOf: [
      {
        properties: {
          shouldnotbehere: {
            type: "number",
            default: 9000,
          },
          shouldbehere: {
            type: "number",
            default: 9000,
          },
        },
        required: ["shouldnotbehere"],
      },
      {
        properties: {
          prompts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  minLength: 1,
                },
                stream: {
                  type: "boolean",
                  default: false,
                },
                max_tokens: {
                  type: "integer",
                  default: 256,
                },
              },
            },
          },
        },
        required: ["prompts"],
      },
    ],
  };
  let validator = new FakeCabidela(schema, { applyDefaults: true });
  test.skipIf(process.env.AJV)("oneOf prompts met", () => {
    let payload = {
      prompts: [
        {
          stream: false,
          temperature: 0.7,
          prompt: "tell me a joke",
        },
        {
          stream: false,
          temperature: 0.7,
          prompt: "write an email from user to provider.",
          max_tokens: 100,
        },
        {
          stream: false,
          temperature: 0.7,
          prompt: "tell me a joke about llamas",
          max_tokens: 100,
        },
      ],
    };
    expect(() => validator.validate(payload)).not.toThrowError();
    expect(payload.prompts[0].max_tokens).toStrictEqual(256);
  });
  test.skipIf(process.env.AJV)("oneOf shouldnotbehere met", () => {
    let payload = {
      shouldnotbehere: 10,
    };
    expect(() => validator.validate(payload)).not.toThrowError();
    // @ts-ignore
    expect(payload.shouldbehere).toStrictEqual(9000);
  });
  test.skipIf(process.env.AJV)("oneOf options with same property names", () => {
    validator.setSchema({
      type: "object",
      oneOf: [
        {
          properties: {
            sun: {
              type: "number",
            },
            moon: {
              type: "number",
              default: 9000,
            },
            flowers: {
              type: "number",
              default: 9000,
            },
          },
          required: ["sun"],
        },
        {
          properties: {
            sun: {
              type: "number",
              default: 9000,
            },
            moon: {
              type: "number",
              default: 9000,
            },
          },
          required: ["moon"],
        },
      ],
    });
    let payload: any = { sun: 10 };
    expect(() => validator.validate(payload)).not.toThrowError();
    expect(payload).toStrictEqual({ sun: 10, moon: 9000, flowers: 9000 });
    payload = { moon: 10 };
    expect(() => validator.validate(payload)).not.toThrowError();
    expect(payload).toStrictEqual({ sun: 9000, moon: 10 });
  });
});
