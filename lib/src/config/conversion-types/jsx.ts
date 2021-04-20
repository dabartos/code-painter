export enum PairType { angleBrackets, singleQuotes, doubleQuotes, curlyBrackets };

type JSXPropContent = string;

export type JSXProp = {
    name: string;
    type: "curly" | "string",
    content: JSXPropContent;
    isValueProp?: boolean;
}

export type JSXChunk = {
    name: string;
    body: string;
    clipIndex?: number;
    selfClosing?: boolean;
    children: JSXChunk[];
    props?: string[];
    isInnerHTML?: boolean;
}

export interface JSXComponentTag {
    name: string;
    startIndex: number;
    endIndex:  number;
    props?: string[];
    selfClosing?: boolean;
}