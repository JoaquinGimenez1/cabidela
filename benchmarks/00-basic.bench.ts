import { bench, describe, test } from "vitest";
import { benchEngines } from "./lib/utils";
import { allOfSimple, allOfTwo, anyOfTwo, oneOfTwo } from "./lib/schemas-n-payloads";
import { FakeCabidela } from "../tests/lib/fake-cabidela";

const round = (prefix: string, options?: any) => {
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
      validator.validate("short", {...options, $id: 'allOfSimple'});
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
