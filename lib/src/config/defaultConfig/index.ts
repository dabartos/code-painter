import { CSSProperties } from "react";
import { DefaultStyles } from "../styling-types";
import jsx from "./jsx";

const wrapper: CSSProperties = {
    backgroundColor: "#1e1e1e",
    padding: "2rem",
    color: "white",
    whiteSpace: "pre-wrap"
}

const defaultConfig: DefaultStyles = {
    wrapper,
    jsx,
};

export default defaultConfig;