import React from "react";
import { Component, CodepaintConfig, ComponentProps, PairType }from "@types";
import converter from "./converter";

const jsxToHTML = (inContent: string, config: CodepaintConfig): JSX.Element[] => {

    const padding = config.padding;
    const styles = config.classes.jsx;
    let currentIndent = 0;

    const resolveJSX = (content: string): JSX.Element[] => {

        converter.initialize(content);
        let components: JSX.Element[] = [];

        converter.components.forEach((frag : Component) => {
            components.push(createComponent(frag));
        });

        return components;
    }

    const createComponent = (fragment: Component): JSX.Element => {
        currentIndent = currentIndent + 1;
        let component;

        if (fragment.innerHTML) {
            component = (
                <div style={{paddingLeft: `${currentIndent * padding}rem`}}>
                    {fragment.innerHTML}
                </div>
            );

            currentIndent = currentIndent - 1;

            return component;
        }

        const props = createProps(fragment.props || []);
        const openingBracket = <span style={styles.angleBrackets}>{"<"}</span>;
        const name =  <span style={styles.elements}>{fragment.name}</span>
        const closingBracket =  <span style={styles.angleBrackets}>{">"}</span>

        const children: JSX.Element[] = fragment.children && fragment.children.map((child: Component) => createComponent(child)) || [];
        const footer = fragment.selfClosed ? "" : (
            <div style={styles.angleBrackets}>
                {openingBracket}
                {"/"}<span style={styles.elements}>{fragment.name}</span>
                {closingBracket}
            </div>
        );

        component = (
            <div style={{paddingLeft: `${currentIndent * padding}rem`}}>
                {fragment.innerHTML}
                {openingBracket}{name} {props} {closingBracket}
                {children}
                {footer}
            </div>
        );

        currentIndent = currentIndent - 1;

        return component;
    }

    const createProps = (props: ComponentProps[]): JSX.Element[] => props.map((prop: ComponentProps, index: number) => {

        const propIsVariable = prop.closure === PairType.curlyBrackets;
        const bracketStyle = propIsVariable ? styles.curlyBrackets : styles.strings;
        const contentStyle = propIsVariable ? styles.undefined : styles.strings;

        return (
            <span key={index}>
                <span style={styles.props}>
                    {prop.name}
                </span>
                =
                <span style={bracketStyle}>{propIsVariable ? "{" : '"'}</span>
                <span style={contentStyle}>
                    {prop.value}
                </span>
                <span style={bracketStyle}>{propIsVariable ? "}" : '"'}</span>
                {index < props?.length - 1 ? " " : ""}
            </span>
        )
    })

    return resolveJSX(inContent);
}

export default jsxToHTML;
