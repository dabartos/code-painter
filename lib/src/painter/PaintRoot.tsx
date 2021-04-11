import React from "react";
import { InternalConfig } from "@config";

class CodepainterRoot {

    protected children: JSX.Element[] = [];
    protected config: InternalConfig;

    constructor(config: InternalConfig)  {
        this.config = config;
    }

    public getRoot(): JSX.Element {
        return <pre {...this.config.getWrapperStyles()}><code>{this.children}</code></pre>
    }

}

export default CodepainterRoot;
