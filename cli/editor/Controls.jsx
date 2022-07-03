import React, { useEffect, useState } from "react";

import { post } from "../common/fetch.cjs";

const getInitialInput = (controls) => {
  return Object.keys(controls).reduce((result, key) => {
    const value = controls[key]?.value;

    if (value) result[key] = value;

    return result;
  }, {});
};

export function useInput(sketch) {
  const controls = sketch.controls || {};
  const [input, setInput] = useState(getInitialInput(sketch.controls));
  const updateInput = (key, value) => {
    setInput({ ...input, [key]: value });
  };
  const refreshState = async (seed) => {
    const body = { controls, seed };
    const newInput = await post("/input", body);

    if (newInput.seed) {
      window.history.replaceState(null, null, `?seed=${newInput.seed}`);
    }

    setInput(newInput);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seed = params.get("seed") || "";

    refreshState(seed);
  }, []);

  return { input, refreshState, updateInput };
}

function Controls(props) {
  const { iframeUrl, input, refreshState, sketch, updateInput } = props;
  const { controls } = sketch;
  const fields = Object.keys(controls);

  const exportSketch = (type) => () => {
    const url = `/export/${type}`;
    const body = { input, seed: input.seed, url: iframeUrl };

    post(url, body).then((data) => {
      console.log("data", data);
    });
  };

  return (
    <div className="controls">
      {fields.map((fieldName, index) => {
        const field = controls[fieldName];
        const handleInput = (ev) => {
          const target = ev.target;
          const value = parseFloat(target.value, 10);

          updateInput(fieldName, value);
        };
        const handleSelect = (ev) => {
          updateInput(fieldName, ev.target.value);
        };

        if (Array.isArray(field)) {
          return (
            <div key={index}>
              <label>{fieldName}</label>
              <select onChange={handleSelect} value={input[fieldName]}>
                {field.map((value) => {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        }

        return (
          <div key={index}>
            <label>{fieldName}</label>
            <input
              type="range"
              min={field?.min || "1"}
              max={field?.max || "100"}
              step={field?.step || "1"}
              onChange={handleInput}
              value={input[fieldName]}
            />
          </div>
        );
      })}
      <button onClick={exportSketch("png")}>export png</button>
      <button onClick={exportSketch("svg")}>export svg</button>
      <button onClick={() => refreshState()}>seed</button>
    </div>
  );
}

export default Controls;
