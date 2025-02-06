export const payloadExamples = [
  {
    title: "Big string error",
    schema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          maxLength: 5,
        },
      },
    },
    payload: {
      prompt: "long string",
    },
  },
  {
    title: "oneOf, multipleOf",
    schema: {
      oneOf: [
        { type: "number", multipleOf: 5 },
        { type: "number", multipleOf: 3 },
      ],
    },
    payload: 5
  },
  {
    title: "Two required properties",
    schema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
        },
        image: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
      required: ["prompt", "image"],
    },
    payload: {
      prompt: "describe this image",
      image: [1, 2, 3],
    },
  },
  {
    title: "oneOf",
    schema: {
      type: "object",
      oneOf: [
        {
          title: "Prompt",
          properties: {
            prompt: {
              type: "string",
            },
          },
          required: ["prompt", "image"],
        },
        {
          title: "Messages",
          properties: {
            messages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                  },
                  content: {
                    type: "string",
                  },
                },
                required: ["role", "content"],
              },
            },
          },
          required: ["messages"],
        },
      ],
    },
    payload: {
      messages: [
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
        { role: "user", content: "How are you?" },
        { role: "assistant", content: "I'm doing well, thank you." },
      ],
    },
  },
  {
    title: "anyOf",
    schema: {
      type: "object",
      anyOf: [
        {
          title: "Prompt",
          properties: {
            prompt: {
              type: "string",
            },
          },
          required: ["prompt"],
        },
        {
          title: "Messages",
          properties: {
            messages: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                  },
                  content: {
                    type: "string",
                  },
                },
                required: ["role", "content"],
              },
            },
          },
          required: ["messages"],
        },
      ],
    },
    payload: {
      messages: [{ role: "user", content: "Hello" }],
      prompt: "this doesn't make sense",
    },
  },
];
