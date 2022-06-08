import React from "react";
import ReactDOM from "react-dom/client";

function Easel(props) {
  const name = window?.SKETCH?.fileName || "_template";

  return (
    <>
      <main>
        <p>atwo</p>
        <iframe
          height="500"
          width="500"
          title={`atwo ${name} sketch.`}
          src={`/${name}.html`}
        />
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Easel />);

if (module.hot) module.hot.accept();
