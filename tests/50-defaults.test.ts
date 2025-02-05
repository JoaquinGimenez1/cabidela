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
  it("deep defaults non existant object", () => {
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
