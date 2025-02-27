import { expect, describe, test } from "vitest";
import { FakeCabidela } from "./lib/fake-cabidela";

describe("Speech recognition", () => {
  let schema = {
    oneOf: [
      { type: "string", format: "binary" },
      {
        type: "object",
        properties: {
          audio: {
            type: "array",
            description:
              "An array of integers that represent the audio data constrained to 8-bit unsigned integer values",
            items: {
              type: "number",
              description: "A value between 0 and 255",
            },
          },
          source_lang: {
            type: "string",
            description: "The language of the recorded audio",
          },
          target_lang: {
            type: "string",
            description: "The language to translate the transcription into. Currently only English is supported.",
          },
        },
        required: ["audio"],
      },
    ],
  };

  let validator = new FakeCabidela(schema, { applyDefaults: true, errorMessages: true });

  test("binary audio", () => {
    expect(() => validator.validate({ audio: [...new Uint8Array([1, 2, 3, 4, 5])] })).not.toThrowError();
  });
});

describe("Text to image", () => {
  let schema = {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        minLength: 1,
        description: "A text description of the image you want to generate",
      },
      negative_prompt: {
        type: "string",
        description: "Text describing elements to avoid in the generated image",
      },
      height: {
        type: "integer",
        minimum: 256,
        maximum: 2048,
        description: "The height of the generated image in pixels",
      },
      width: {
        type: "integer",
        minimum: 256,
        maximum: 2048,
        description: "The width of the generated image in pixels",
      },
      image: {
        type: "array",
        description:
          "For use with img2img tasks. An array of integers that represent the image data constrained to 8-bit unsigned integer values",
        items: {
          type: "number",
          description: "A value between 0 and 255",
        },
      },
      image_b64: {
        type: "string",
        description: "For use with img2img tasks. A base64-encoded string of the input image",
      },
      mask: {
        type: "array",
        description:
          "An array representing An array of integers that represent mask image data for inpainting constrained to 8-bit unsigned integer values",
        items: {
          type: "number",
          description: "A value between 0 and 255",
        },
      },
      num_steps: {
        type: "integer",
        default: 20,
        maximum: 20,
        description: "The number of diffusion steps; higher values can improve quality but take longer",
      },
      strength: {
        type: "number",
        default: 1.0,
        description:
          "A value between 0 and 1 indicating how strongly to apply the transformation during img2img tasks; lower values make the output closer to the input image",
      },
      guidance: {
        type: "number",
        default: 7.5,
        description:
          "Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt",
      },
      seed: {
        type: "integer",
        description: "Random seed for reproducibility of the image generation",
      },
    },
    required: ["prompt"],
  };

  let validator = new FakeCabidela(schema, { errorMessages: true });

  test("empty prompt", () => {
    expect(() => validator.validate({ prompt: "", num_steps: 20 })).toThrowError();
  });
});

describe("Text embeddings", () => {
  let schema = {
    type: "object",
    properties: {
      text: {
        oneOf: [
          {
            type: "string",
            description: "The text to embed",
            minLength: 1,
          },
          {
            type: "array",
            description: "Batch of text values to embed",
            items: {
              type: "string",
              description: "The text to embed",
              minLength: 1,
            },
            maxItems: 100,
          },
        ],
      },
    },
    required: ["text"],
  };

  let validator = new FakeCabidela(schema, { errorMessages: true });

  test("empty text", () => {
    expect(() => validator.validate({ text: "" })).toThrowError();
  });
  test("not empty text", () => {
    expect(() => validator.validate({ text: "Tell me a joke about Cloudflare" })).not.toThrowError();
  });
});

describe("Structured outputs", () => {
  let schema = {
    title: "JSON Mode",
    type: "object",
    oneOf: [
      {
        properties: {
          type: {
            type: "string",
            const: "json_object",
          },
        },
        required: ["type"],
      },
      {
        properties: {
          type: {
            type: "string",
            const: "json_schema",
          },
          json_schema: {},
        },
        required: ["type", "json_schema"],
      },
    ],
  };

  let validator = new FakeCabidela(schema, { errorMessages: true });

  test("json_object type", () => {
    expect(() => validator.validate({ type: "json_object" })).not.toThrowError();
  });
  test("json_schema type", () => {
    expect(() => validator.validate({ type: "json_schema", json_schema: { something: "here" } })).not.toThrowError();
  });
  test("json_schema type without schema", () => {
    expect(() => validator.validate({ type: "json_schema" })).toThrowError();
  });
});
