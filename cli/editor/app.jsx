import _debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import Controls, { useInput } from "./Controls.jsx";

function qsStringify(params) {
  return Object.keys(params)
    .map((key) => (params[key] ? `${key}=${params[key]}` : ""))
    .join("&");
}

function getUrls({ input, sketch, sketchSize }) {
  const path = `/${sketch?.meta?.name}.html`;
  const iframeUrl = `${path}?${qsStringify({
    ...input,
    ...sketchSize,
  })}`;
  const exportUrl = `${path}?${qsStringify({
    ...input,
    height: sketch.height,
    width: sketch.width,
  })}`;

  // console.log(`loading preview: ${iframeUrl}`);

  return { export: exportUrl, iframe: iframeUrl };
}

function useSketchSize(sketch) {
  const PADDING = 32;
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth - PADDING,
    height: window.innerHeight - PADDING,
  });
  const handleResize = _debounce(() => {
    setWindowSize({
      width: window.innerWidth - PADDING,
      height: window.innerHeight - PADDING,
    });
  }, 10);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scaleX = windowSize.width / sketch.width;
  const scaleY = windowSize.height / sketch.height;
  const smallerSize = Math.min(scaleX, scaleY);
  const height = sketch.height * smallerSize;
  const width = sketch.width * smallerSize;

  return { height, width };
}

function getSketch() {
  // console.log("CONFIG", window?.CONFIG);
  // console.log("SKETCH", window?.SKETCH);

  return {
    ...(window?.CONFIG || {}),
    meta: window?.SKETCH || {},
  };
}

function Editor(props) {
  const sketch = getSketch();
  const sketchSize = useSketchSize(sketch);
  const { input, refreshState, updateInput } = useInput(sketch);
  const urls = getUrls({ input, sketch, sketchSize });

  if (!sketchSize.height || !sketchSize.width) {
    return null;
  }

  return (
    <>
      <main>
        <div className="container">
          <iframe
            height={`${sketchSize.height}px`}
            width={`${sketchSize.width}px`}
            title={`atwo ${sketch?.name} sketch.`}
            src={urls.iframe}
          />
        </div>
        <Controls
          input={input}
          refreshState={refreshState}
          sketch={sketch}
          updateInput={updateInput}
          urls={urls}
        />
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Editor />);
