import React from "react";
import ReactDOM from "react-dom/client";

function Easel(props) {
  console.log("atwo - easel on down the road.");

  const name = window?.SKETCH?.name || "_template";

  return (
    <>
      <main>
        <p>atwo</p>
        <iframe title={`atwo ${name} sketch.`} src={`/${name}.html`} />
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Easel />);

if (module.hot) module.hot.accept();
