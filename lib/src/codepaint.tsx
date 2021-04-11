import { CodepaintConfig, InternalConfig, defaultConfig } from "@config";
import { PaintJSX } from "./painter";

const codepaint = (() => {

    let config: InternalConfig = new InternalConfig(defaultConfig);

    const parseJsx = (content: string): JSX.Element => {
        return new PaintJSX(content, config).getRoot();
    }

    const setConfig = (newConfigFile: CodepaintConfig) => config.setClasses(newConfigFile) ;

    return {
        parseJsx,
        setConfig
    };
})();

export default codepaint;
