export const allOfSimple = {
  allOf: [{ type: "string" }, { maxLength: 5 }],
};

export const allOfTwo = {
  type: "object",
  allOf: [
    {
      properties: {
        string: {
          type: "string",
        },
      },
    },
    {
      properties: {
        number: {
          type: "number",
        },
      },
    },
  ],
};

export const anyOfTwo = {
  anyOf: [
    { type: "string", maxLength: 5 },
    { type: "number", minimum: 0 },
  ],
};

export const oneOfTwo = {
  oneOf: [
    { type: "number", multipleOf: 5 },
    { type: "number", multipleOf: 3 },
  ],
};

export const imageSchema = {
  type: "object",
  properties: {
    image: {
      type: "array",
      items: {
        type: "number",
      },
    },
  },
  required: ["image"],
};

export const twoLevelImageSchema = {
  type: "object",
  properties: {
    child: {
      type: "object",
      properties: {
        image: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
      required: ["image"],
    },
  },
};

export const nestedSchema = (depth: number) =>
  Array.from({ length: depth }, () => "properties").reduce(
    (prev: any, current: any) => ({
      type: "object",
      [current]: {
        image: {
          type: "array",
          items: {
            type: "number",
          },
        },
        child: {
          ...prev,
        },
      },
      required: ["image", "child"],
    }),
    {
      type: "object",
      properties: {
        image: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
      required: ["image"],
    },
  );

export const nestedPayload = (depth: any) =>
  Array.from({ length: depth }, () => "child").reduce(
    (prev, current) => ({ [current]: { image: Array.from({ length: 100 }, (_, i) => i + 1), ...prev } }),
    {},
  );

export const nestedPayloadComplex = (depth: any) =>
  Array.from({ length: depth }, () => "child").reduce(
    (prev, current) => ({ image: Array.from({ length: 100 }, (_, i) => i + 1), [current]: { ...prev } }),
    {
      image: Array.from({ length: 100 }, (_, i) => i + 1),
    },
  );
