import { CSSProperties } from "react";
import { JSXClasses } from "@types";

const colors = {
    angleBracket: "#808073",
    element: "#3ac9b0",
    elProp: "#7bdcfe",
    string: "#ce723b",
    iHTML: "#f2f2f2",
    curlyBracket: "#8fd3ff",
    undefined: "#f25566"
};

const angleBrackets: CSSProperties = { color: colors.angleBracket };
const elements: CSSProperties = { color: colors.element };
const props: CSSProperties = { color: colors.elProp };
const strings: CSSProperties = { color: colors.string };
const innerHTMLs: CSSProperties = { color: colors.iHTML };
const curlyBrackets: CSSProperties = { color: colors.curlyBracket };
const undefined: CSSProperties = { color: colors.undefined };

const jsxClasses: JSXClasses = {
    angleBrackets,
    elements,
    props,
    strings,
    innerHTMLs,
    curlyBrackets,
    undefined,
}

export default jsxClasses;