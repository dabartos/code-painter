import React, { Fragment } from "react";
import { InternalConfig, CodepainterJSXStyles, JSXChunk, JSXProp, JSXClasses } from "@config";
import converter from "./jsx/converter";
import PaintRoot from "./PaintRoot";

class PaintJSX extends PaintRoot {

    private styles: CodepainterJSXStyles = this.config.getJSXStyles();
    private keyIndex = 1;
    private getKeyIndex = (): number => { this.keyIndex = this.keyIndex + 1; return this.keyIndex; }

    constructor(content: string, config: InternalConfig) {
        super(config);

        const entryChunk: JSXChunk = converter.getEntryChunk(content);

        if (!entryChunk.children){
            console.error("Input content was not translated to jsx.");
        }

        entryChunk.children.forEach((child: JSXChunk) => {
            this.children.push(this.createComponent(child));
        });
    }

    private createComponent(chunk: JSXChunk): JSX.Element {

        const containerStyle = this.styles.getStyleFor("container");

        if (chunk.isInnerHTML) {
            return (
                <div key={`codepainter-key-${this.getKeyIndex()}`} {...containerStyle}>
                    {chunk.body}
                </div>
            );
        }

        return (
            <div {...containerStyle} key={`codepainter-key-${this.getKeyIndex()}`}>
                {this.makeHeader(chunk)}
                {this.makeChildren(chunk)}
                {this.makeFooter(chunk)}
            </div>
        );
    }

    private makeHeader(chunk: JSXChunk): JSX.Element {

        const props = this.createProps(chunk.props);
        const elementsStyleTag: keyof(JSXClasses) = chunk.name[0] !== chunk.name[0].toUpperCase() ? "elementsHTML" : "elements";

        return (
            <Fragment>
                <span {...this.styles.getStyleFor("angleBrackets")}>{"<"}</span>
                <span {...this.styles.getStyleFor(elementsStyleTag)}>{chunk.name}</span>
                {props}
                <span {...this.styles.getStyleFor("angleBrackets")}>{`${chunk.selfClosing ? " /" : ""}>`}</span>
            </Fragment>
        );
    }

    private createProps(props?: string[]): JSX.Element[] {

        if (!props) {
            return [];
        }

        const filteredProps = props.filter((prop: string) => {
            const rgx = prop.trim().match(/^[A-z]*/);

            if (!rgx) {
                // throw new Error(`What sort of prop is this?\nProp name: [${prop}]`);
                console.error(`What sort of prop is this?\nProp name: [${prop}]`);
            }

            return rgx;
        });

        return filteredProps.map((propStr: string): JSX.Element => {
            propStr = propStr.trim();

            const prop = this.makeProp(propStr);

            return (
                <span key={`codepainter-key-${this.getKeyIndex()}`}>
                    {" "}
                    <span {...this.styles.getStyleFor("props")}>
                        {prop.name}
                    </span>
                    {this.getPropValue(prop)}
                </span>
            )
        });
    }

    private makeProp(strContent: string): JSXProp {

        const dividerIndex = strContent.indexOf("=");
        const jsxProp: JSXProp = {
            name: "",
            type: "curly",
            content: "",
            isValueProp: dividerIndex === -1
        }

        if (dividerIndex !== -1) {
            const name = strContent.substring(0, dividerIndex);
            const typeChar = strContent.substring(dividerIndex + 1, dividerIndex + 2);
            const type = typeChar === "{" ? "curly" : "string";
            const content = strContent.substring(name.length + 2, strContent.length - 1);

            jsxProp.name = name;
            jsxProp.type = type;
            jsxProp.content = content;
        }
        else {
            jsxProp.name = strContent;
        }

        return jsxProp;
    }

    private getPropValue(prop: JSXProp) {

        if (prop.isValueProp) {
            return null;
        }

        const propIsVariable = prop.type === "curly";
        const bracketStyle = this.styles.getStyleFor(propIsVariable ? "curlyBrackets" : "strings");
        const contentStyle = this.styles.getStyleFor(propIsVariable ? "undefined" : "strings");

        return (
            <Fragment>
                =
                <span {...bracketStyle}>{propIsVariable ? "{" : '"'}</span>
                <span {...contentStyle}>
                    {prop.content}
                </span>
                <span {...bracketStyle}>{propIsVariable ? "}" : '"'}</span>
            </Fragment>
        );
    }

    private makeChildren(chunk: JSXChunk): JSX.Element[] {

        if (!chunk.children) {
            return [];
        }

        return chunk.children.map((child: JSXChunk) => this.createComponent(child));
    }

    private makeFooter(chunk: JSXChunk): JSX.Element | undefined {
        if (chunk.selfClosing) {
            return;
        }

        const elementsStyleTag: keyof(JSXClasses) = chunk.name[0] !== chunk.name[0].toUpperCase() ? "elementsHTML" : "elements";

        return (
            <Fragment>
                <span {...this.styles.getStyleFor("angleBrackets")}>{"</"}</span>
                <span {...this.styles.getStyleFor(elementsStyleTag)}>{chunk.name}</span>
                <span {...this.styles.getStyleFor("angleBrackets")}>{">"}</span>
            </Fragment>
        );
    }
}

export default PaintJSX;
