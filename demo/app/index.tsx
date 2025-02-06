import "~/common/styles/index.scss";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Cabidela } from "@cloudflare/cabidela";
import { Editor } from "./editor";
import { isJSON } from "./tools";
import JSON5 from "json5";

const Validator = () => {
  const [forms, setForms] = useState({
    schema: `{
  type: "object",
  properties: {
    prompt: {
      type: "string",
    },
    image: {
      type: "array",
      items: {
        type: "number",
      }
    },
  },
  required: ["prompt", "image"]
}`,
    payload: `{
  prompt: "describe this image",
  image: [1, 2, 3, 4, 5, 6, 7, 8, 9]
}`,
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

  return (
    <>
      <div className="card-content">
        <p className="text-2xl">Cabidela JSON Schema Validator</p>
        <em>Small, fast, eval-less, Cloudflare Workers compatible, dynamic JSON Schema validator.</em>

        <div className="grid grid-cols-2 gap-4">
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
        <div className="">{error && error.map((e: string) => <p className="text-red-500">{e}</p>)}</div>
      </div>
    </>
  );
};

let root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<Validator />);
