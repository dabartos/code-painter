export enum PairType { angleBrackets, singleQuotes, doubleQuotes, curlyBrackets };
export type CPElementHead = {
    name?: string;
    props?: JSX.Element[];
}
export type CPElement = {
    head: CPElementHead;
    children: CPElement[];
    selfClosing: boolean;
    innerHTML?: string;
}
export type ElementHead = {
    name?: string;
    props?: string;
    children?: string;
    innerHTML?: string;
    selfClosing?: boolean;
}
export type Component = {
    name?: string;
    props?: ComponentProps[];
    selfClosed?: boolean;
    children?: Component[];
    innerHTML?: string | null;
};
export type ComponentProps = {
    name: string;
    value: string;
    closure: PairType;
}
export type JSXChunk = {
    parent?: JSXChunk;
    name?: string;
    selfClosing?: boolean;
    head: string;
    body?: string;
    start: number;
    end: number;
}