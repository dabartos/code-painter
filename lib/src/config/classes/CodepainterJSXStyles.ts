import CodepainterStyles from "./CodepainterStyles";
import { JSXStyles, JSXClasses, CodepaintStyleObject } from "../styling-types";

class CodepainterJSXStyles extends CodepainterStyles<JSXClasses, JSXStyles> {
    constructor(classes?: JSXClasses, styles?: JSXStyles) {
        super(classes, styles);
    }

    public getStyleFor = (key: keyof(JSXClasses)): CodepaintStyleObject => {
        const existingClass = this.classes[key];

        return {
            className: existingClass,
            style: !existingClass ? this.styles[key] : undefined,
        };
    }
}

export default CodepainterJSXStyles;
