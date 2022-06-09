import React from "react";
import ReactDOM from "react-dom/client";

function Easel(props) {
  const name = window?.SKETCH?.name || "_template";

  if (!name) {
    return <p>An error occurred while accessing the sketch's name.</p>;
  }

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
