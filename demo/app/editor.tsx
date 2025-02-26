import React, { useEffect, useState } from "react";
import { highlight, languages } from "prismjs";
import { default as ReactEditor } from "react-simple-code-editor";
import { isJSON } from "./tools";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

const codeValidators: any = {
  json: isJSON,
};

export const Editor = (props: any = {}) => {
  useEffect(() => {}, []);

  return (
    <>
      <div className={`code overflow-auto`}>
        <ReactEditor
          value={props.content || ""}
          onValueChange={(code) => {
            props.setContent && props.setContent(code);
          }}
          highlight={(code) => {
            return props.validation && languages[props.validation]
              ? highlight(code, languages[props.validation], props.validation)
              : code;
          }}
          padding={props.padding || 20}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            backgroundColor: "#f5f5f5",
            borderColor: "#ffaaaa",
            borderStyle:
              props.validation && codeValidators[props.validation]
                ? codeValidators[props.validation](props.content)
                  ? "none"
                  : "solid"
                : "none",
            borderWidth: "2px",
            marginTop: "10px",
            borderRadius: "5px",
          }}
          {...(props.tabSize ? { tabSize: props.tabSize } : {})}
          {...(props.insertSpaces ? { insertSpaces: props.insertSpaces } : {})}
          {...(props.ignoreTabKey ? { ignoreTabKey: props.ignoreTabKey } : {})}
        />
      </div>
    </>
  );
};
