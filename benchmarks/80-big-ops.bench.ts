import { bench, describe, test } from "vitest";
import { benchEngines } from "./lib/utils";
import {
  nestedPayloadComplex,
  nestedPayload,
  oneOfTwo,
  anyOfTwo,
  allOfTwo,
  allOfSimple,
  imageSchema,
  twoLevelImageSchema,
  nestedSchema,
} from "./lib/schemas-n-payloads";

const big10000 = Array.from({ length: 10000 }, (_, i) => i + 1);

const round = (prefix: string, options?: any) => {
  describe(`${prefix}: Big array payload`, () => {
    const testFn = (validator: any) => {
      validator.validate({
        image: big10000,
      });
    };
    benchEngines(imageSchema, testFn, 1000, {...options, $id: 'imageSchema'});
  });

  describe(`${prefix}: Big object payload`, () => {
    const testFn = (validator: any) => {
      validator.validate(nestedPayload(100));
    };
    benchEngines(twoLevelImageSchema, testFn, 1000, {...options, $id: 'twoLevelImageSchema'});
  });

  describe(`${prefix}: Deep schema, deep payload`, () => {
    const testFn = (validator: any) => {
      validator.validate(nestedPayloadComplex(10));
    };

    benchEngines(nestedSchema(10), testFn, 1000, options);
  });

  describe(`${prefix}: allOf, two properties`, () => {
    const testFn = (validator: any) => {
      validator.validate("short");
    };

    benchEngines(allOfSimple, testFn, 1000, {...options, $id: 'allOfSimple'});
  });

  describe(`${prefix}: allOf, two objects`, () => {
    const testFn = (validator: any) => {
      validator.validate({ string: "string", number: 10 });
    };

    benchEngines(allOfTwo, testFn, 1000, {...options, $id: 'allOfTwo'});
  });

  describe(`${prefix}: anyOf, two conditions`, () => {
    const testFn = (validator: any) => {
      validator.validate("short");
    };

    benchEngines(anyOfTwo, testFn, 1000, {...options, $id: 'anyOfTwo'});
  });

  describe(`${prefix}: oneOf, two conditions`, () => {
    const testFn = (validator: any) => {
      validator.validate(5);
    };

    benchEngines(oneOfTwo, testFn, 1000, {...options, $id: 'oneOfTwo'});
  });
};

round("single");
round("session", { session: true });
