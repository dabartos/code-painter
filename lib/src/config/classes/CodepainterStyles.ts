import { ConfigClasses, ConfigStyles } from "../styling-types/config";

class CodepainterStyles<T extends ConfigClasses, K extends ConfigStyles>  {

    protected readonly classes: T;
    protected readonly styles: K;

    constructor(classes?: T, styles?: K) {
        this.classes = classes || new ConfigClasses() as T;
        this.styles = styles || new ConfigStyles as K;
    }
}

export default CodepainterStyles;