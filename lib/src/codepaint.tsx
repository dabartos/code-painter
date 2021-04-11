import React from 'react';
import defaultConfig from "./config";
import { CodepaintConfig } from "./types";
import jsxToHTML from "./painter/jsx";

const codepaint = (() => {

    let config: CodepaintConfig = defaultConfig;

    const parseJsx = (content: string): JSX.Element => <pre><code>{jsxToHTML(content, config)}</code></pre>

    const setConfig = (newConfigFile: CodepaintConfig) => config = newConfigFile;

    return {
        parseJsx,
        setConfig
    };
})();

export default codepaint;
