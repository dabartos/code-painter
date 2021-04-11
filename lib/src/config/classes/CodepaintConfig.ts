import { ClassesList } from "../styling-types";

class CodepaintConfig {
    classes: ClassesList;
    padding: number;

    public setClasses(newConfig: CodepaintConfig) {
        this.classes = newConfig.classes;
    }
}

export default CodepaintConfig;