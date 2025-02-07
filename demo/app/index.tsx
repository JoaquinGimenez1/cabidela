import "~/common/styles/index.scss";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Cabidela } from "@cloudflare/cabidela";
import { Editor } from "./editor";
import { isJSON } from "./tools";
import { payloadExamples } from "./payloads";
import JSON5 from "json5";

const Validator = () => {
  const [forms, setForms] = useState({
    schema: "",
    payload: "",
    select: 0,
  }) as any;

  const [error, setError] = useState([] as Array<string>);

  useEffect(() => {
    const errors: Array<string> = [];
    if (!isJSON(forms.schema)) {
      errors.push("Schema is not valid JSON");
    }
    if (!isJSON(forms.payload)) {
      errors.push("Payload is not valid JSON");
    }
    try {
      const cabidela = new Cabidela(JSON5.parse(forms.schema));
      cabidela.validate(JSON5.parse(forms.payload));
    } catch (e: any) {
      errors.push(e.message);
    }
    setError(errors);
  }, [forms.schema, forms.payload]);

  useEffect(() => {
    setForms({
      ...forms,
      schema: JSON5.stringify(payloadExamples[forms.select].schema, { replacer: null, space: 2, quote: '"' }),
      payload: JSON5.stringify(payloadExamples[forms.select].payload, { replacer: null, space: 2, quote: '"' }),
    });
  }, [forms.select]);

  return (
    <>
      <div className="card-content">
        <div>
          <a href="https://cabidela.pages.dev/">
            <img
              className="float-right"
              src="https://raw.githubusercontent.com/cloudflare/cabidela/refs/heads/main/assets/cabidela.png"
              width="100"
              height="auto"
              alt="cabidela"
            />
          </a>
          <p className="text-2xl">Demo</p>
          <em>Small, fast, eval-less, Cloudflare Workers compatible, dynamic JSON Schema validator.</em>
        </div>

        <hr className="mt-6 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>
              <span>Select examples</span>
              <select onChange={(e) => setForms({ ...forms, select: e.target.value })}>
                {payloadExamples.map((t: any, index: number) => {
                  return (
                    <option value={index} selected={forms.select == index ? true : false}>
                      {t.title}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div>
            <label>
              <span>Errors</span>
              {error.length ? (
                error.map((e: string) => <p className="text-red-500">{e}</p>)
              ) : (
                <p className="text-green-500">No errors</p>
              )}
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>
              <span>Schema</span>
              <Editor
                validation="json"
                content={forms.schema}
                setContent={(c: string) => {
                  console.log("setting schema");
                  setForms({ ...forms, schema: c });
                }}
              />
            </label>
          </div>
          <div>
            <label>
              <span>Payload</span>
              <Editor
                validation="json"
                content={forms.payload}
                setContent={(c: string) => {
                  console.log("setting schema");
                  setForms({ ...forms, payload: c });
                }}
              />
            </label>
          </div>
        </div>

        <hr className="my-6 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        <div>
          <p className="text-sm mt-2">
            <svg width="20px" className="float-left mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
              <g fill-rule="evenodd" clip-rule="evenodd">
                <circle fill="none" cx="28" cy="28" r="28"></circle>
                <path
                  fill="#181616"
                  d="M28 0C12.54 0 0 12.54 0 28c0 12.37 8.02 22.86 19.15 26.57 1.4.26 1.91-.61 1.91-1.35 0-.66-.02-2.43-.04-4.76-7.79 1.69-9.43-3.75-9.43-3.75-1.27-3.23-3.11-4.1-3.11-4.1-2.54-1.74.19-1.7.19-1.7 2.81.2 4.29 2.89 4.29 2.89 2.5 4.28 6.55 3.04 8.15 2.33.25-1.81.98-3.04 1.78-3.74-6.22-.71-12.75-3.11-12.75-13.84 0-3.06 1.09-5.56 2.88-7.51-.29-.71-1.25-3.56.27-7.41 0 0 2.35-.75 7.7 2.87 2.23-.62 4.63-.93 7.01-.94 2.38.01 4.77.32 7.01.94 5.35-3.62 7.69-2.87 7.69-2.87 1.53 3.85.57 6.7.28 7.41 1.79 1.96 2.88 4.46 2.88 7.51 0 10.76-6.55 13.12-12.78 13.82 1.01.86 1.9 2.57 1.9 5.19 0 3.74-.03 6.76-.03 7.68 0 .75.5 1.62 1.93 1.35C47.98 50.86 56 40.37 56 28 56 12.54 43.46 0 28 0z"
                ></path>
              </g>
            </svg>
            <a href="https://github.com/cloudflare/cabidela">https://github.com/cloudflare/cabidela</a>
          </p>
        </div>


      </div>
    </>
  );
};

let root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<Validator />);
