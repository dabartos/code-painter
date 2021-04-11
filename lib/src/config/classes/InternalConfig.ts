import { DefaultStyles, CodepaintStyleObject } from "@config";
import CodepaintConfig from "./CodepaintConfig";
import CodepainterJSXStyles from "./CodepainterJSXStyles";

class InternalConfig extends CodepaintConfig {

    private defaultStyles: DefaultStyles;

    constructor(defaultStyles: DefaultStyles) {
        super();

        this.defaultStyles = defaultStyles;
    }

    public getWrapperStyles(): CodepaintStyleObject {
        return {
            className: this.classes?.wrapper,
            style: !this.classes?.wrapper ? this.defaultStyles.wrapper : undefined,
        }
    }

    public getJSXStyles(): CodepainterJSXStyles {
        return new CodepainterJSXStyles(this.classes?.jsx, this.defaultStyles.jsx);
    }
}

export default InternalConfig;
