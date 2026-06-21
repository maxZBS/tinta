import { render } from "solid-js/web";
import { AppRouter } from "@/app/router";
import "@/styles/globals.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

render(() => <AppRouter />, root);
