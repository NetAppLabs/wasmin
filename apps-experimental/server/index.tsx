import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { App } from "./src/App";

const rootElement = document.getElementById("root")!;

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
