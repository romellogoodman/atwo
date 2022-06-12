import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { hot } from "react-hot-loader/root";

function Easel(props) {
  const name = window?.SKETCH?.name || "_template";

  console.log("CONFIG", window?.CONFIG);
  console.log("SKETCH", window?.SKETCH);

  const [foo, setFoo] = useState("100");
  const handleInput = (ev) => {
    console.log("handleInput", ev.target.value);

    setFoo(ev.target.value);
  };

  if (!name) {
    return <p>An error occurred while accessing the sketch's name.</p>;
  }

  return (
    <>
      <main>
        <p>atwo</p>
        <input type="range" onChange={handleInput}></input>
        <iframe
          height="500"
          width="500"
          title={`atwo ${name} sketch.`}
          src={`/${name}.html?size=${foo}`}
        />
      </main>
    </>
  );
}

const Hot = hot(Easel);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Hot />);
