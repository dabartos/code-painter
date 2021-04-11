import { CSSProperties } from "react";
import { CodepainterStyleType, ConfigStyles } from "./config";

export interface JSXStyles extends ConfigStyles {
    angleBrackets: CSSProperties;
    elements: CSSProperties;
    props: CSSProperties;
    strings: CSSProperties;
    innerHTMLs: CSSProperties;
    curlyBrackets: CSSProperties;
    undefined: CSSProperties;
    container: CSSProperties;
};

export type DefaultStyles = {
    wrapper?: CSSProperties;
    [CodepainterStyleType.jsx]: JSXStyles;
}