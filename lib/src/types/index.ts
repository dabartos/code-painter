export * from "./classes";
export * from "./jsx";

import { JSXClasses } from "./classes";

export type ClassesList = {
    jsx: JSXClasses;
}

export type CodepaintConfig = {
    classes: ClassesList;
    padding: number;
}
