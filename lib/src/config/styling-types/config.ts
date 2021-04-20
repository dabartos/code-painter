import { CSSProperties } from "react";

export type CodepaintStyleObject = {
    className?: string;
    style?: CSSProperties;
};

export enum CodepainterStyleType {
    jsx = "jsx"
};

export class ConfigStyles {};
export class ConfigClasses {}

export class JSXClasses extends ConfigClasses {
    angleBrackets?: string;
    elements?: string;
    elementsHTML?: string;
    props?: string;
    strings?: string;
    innerHTMLs?: string;
    curlyBrackets?: string;
    undefined?: string;
    container?: string;
}

export type ClassesList = {
    wrapper?: string;
    jsx: JSXClasses;
}
