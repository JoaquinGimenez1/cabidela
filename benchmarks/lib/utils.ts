import { bench } from "vitest";
import { FakeCabidela } from "../../tests/lib/fake-cabidela";
const benchDefaultOptions = { throws: true };

export const benchEngines = (schema: any, testFn: any, iterations: number, options?: any) => {
  let validator: any = false;
  let validatorAJV: any = false;
  let validatorAJVStatic: any = false;

  if (options?.session) {
    validator = new FakeCabidela(schema);
    validatorAJV = new FakeCabidela(schema, { useAJV: true });
    if (options?.$id) {
      validatorAJVStatic = new FakeCabidela({ ...schema, $id: options?.$id }, { useAJVStatic: true });
    }
  }

  bench(
    "Cabidela",
    () => {
      testFn(validator || new FakeCabidela(schema));
    },
    {
      ...benchDefaultOptions,
      iterations,
    },
  );
  bench(
    "Ajv",
    () => {
      testFn(validatorAJV || new FakeCabidela(schema, { useAJV: true }));
    },
    {
      ...benchDefaultOptions,
      iterations,
    },
  );
  if (options?.$id) {
    bench(
      "Ajv static",
      () => {
        testFn(validatorAJVStatic || new FakeCabidela({ ...schema, $id: options?.$id }, { useAJVStatic: true }));
      },
      {
        ...benchDefaultOptions,
        iterations,
      },
    );
  }
};
