import React, { useState } from "react";
import useCPStyles from "./useCPStyles";
import * as CPT from "./types";
import converter from "./converter";

const jsxToHTML = (inContent: string, type?: CPT.ContentType, scale?: number) => {

    const styles = useCPStyles();
    const [paddingScale, setPaddingScale] = useState<number>(scale || 1.2);
    let currentIndent = 0;

    const resolveJSX = (content: string): JSX.Element[] => {

        converter.initialize(content);
        let components: JSX.Element[] = [];

        converter.components.forEach((frag : CPT.Component) => {
            components.push(createComponent(frag));
        });

        return components;
    }

    const createComponent = (fragment: CPT.Component): JSX.Element => {
        currentIndent = currentIndent + 1;
        let component;

        if (fragment.innerHTML) {
            component = (
                <div style={{paddingLeft: `${currentIndent * paddingScale}rem`}}>
                    {fragment.innerHTML}
                </div>
            );

            currentIndent = currentIndent - 1;

            return component;
        }

        const props = createProps(fragment.props || []);
        const openingBracket = <span className={styles.angleBracket}>{"<"}</span>;
        const name =  <span className={styles.jsxEl}>{fragment.name}</span>
        const closingBracket =  <span className={styles.angleBracket}>{">"}</span>

        const children: JSX.Element[] = fragment.children && fragment.children.map((child: CPT.Component) => createComponent(child)) || [];
        const footer = fragment.selfClosed ? "" : (
            <div className={styles.angleBracket}>
                {openingBracket}
                {"/"}<span className={styles.jsxEl}>{fragment.name}</span>
                {closingBracket}
            </div>
        );

        component = (
            <div style={{paddingLeft: `${currentIndent * paddingScale}rem`}}>
                {fragment.innerHTML}
                {openingBracket}{name} {props} {closingBracket}
                {children}
                {footer}
            </div>
        );

        currentIndent = currentIndent - 1;

        return component;
    }

    const createProps = (props: CPT.ComponentProps[]): JSX.Element[] => props.map((prop: CPT.ComponentProps, index: number) => {

        const propIsVariable = prop.closure === CPT.PairType.curlyBrackets;
        const bracketStyle = propIsVariable ? styles.curlyBracket : styles.string;
        const contentStyle = propIsVariable ? styles.undefined : styles.string;

        return (
            <span key={index}>
                <span className={styles.jsxProp}>
                    {prop.name}
                </span>
                =
                <span className={bracketStyle}>{propIsVariable ? "{" : '"'}</span>
                <span className={contentStyle}>
                    {prop.value}
                </span>
                <span className={bracketStyle}>{propIsVariable ? "}" : '"'}</span>
                {index < props?.length - 1 ? " " : ""}
            </span>
        )
    })


    //         return (
    //             <span key={itemIndex}>
    //                 <span className={styles.jsxProp}>
    //                     {propName}
    //                 </span>
    //                 =
    //                 <span className={bracketStyle}>{propIsVariable ? "{" : '"'}</span>
    //                 <span className={contentStyle}>
    //                     {signature}
    //                 </span>
    //                 <span className={bracketStyle}>{propIsVariable ? "}" : '"'}</span>
    //                 {itemIndex < propNames?.length - 1 ? " " : ""}
    //             </span>
    //         );
    //     }) || [];


    const getContent = (): JSX.Element[] => {
        switch(type) {
            case undefined:
            case "jsx": return resolveJSX(inContent.trim());
        }
    }

    return (
        <pre>
            <code className={styles.cpContainer}>
                {getContent()}
            </code>
        </pre>
    );
}

export {
    jsxToHTML as convert
};