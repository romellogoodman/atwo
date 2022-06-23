import _debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { hot } from "react-hot-loader/root";

function qsStringify(params) {
  return Object.keys(params)
    .map((key) => (params[key] ? `${key}=${params[key]}` : ""))
    .join("&");
}

function getPreviewUrl({ input, sketch, sketchSize }) {
  const queryObj = { ...input, ...sketchSize };
  const iframeUrl = `/${sketch?.meta?.name}.html?${qsStringify(queryObj)}`;

  // console.log(`loading preview: ${iframeUrl}`);

  return iframeUrl;
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

function useInput(sketch) {
  const [input] = useState({});

  return input;
}

function getSketch() {
  // console.log("CONFIG", window?.CONFIG);
  // console.log("SKETCH", window?.SKETCH);

  return {
    ...(window?.CONFIG || {}),
    meta: window?.SKETCH || {},
  };
}

function Easel(props) {
  const sketch = getSketch();
  const sketchSize = useSketchSize(sketch);
  const input = useInput(sketch);
  const iframeUrl = getPreviewUrl({ input, sketch, sketchSize });

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
            src={iframeUrl}
          />
        </div>
      </main>
    </>
  );
}

const Hot = hot(Easel);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Hot />);
