import React from "react";
import ReactDOM from "react-dom/client";
import { hot } from "react-hot-loader/root";

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

const Hot = hot(Easel);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Hot />);
