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
  const [input, setInput] = useState(getInitialInput(controls));
  const updateInput = (key, value) => {
    setInput({ ...input, [key]: value });
  };
  const refreshState = async (seed) => {
    const body = { controls, seed };
    const newInput = await post("/input", body);

    if (newInput.seed) {
      // window.history.replaceState(null, null, `?seed=${newInput.seed}`);
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
  const { iframeUrl, input, refreshState } = props;

  const exportSketch = (type) => () => {
    const url = `/export/${type}`;
    const body = { input, seed: input.seed, url: iframeUrl };

    post(url, body).then((data) => {
      console.log("data", data);
    });
  };

  return (
    <div className="controls">
      <button onClick={exportSketch("png")}>export png</button>
      <button onClick={exportSketch("svg")}>export svg</button>
      <button onClick={() => refreshState()}>seed</button>
    </div>
  );
}

export default Controls;
