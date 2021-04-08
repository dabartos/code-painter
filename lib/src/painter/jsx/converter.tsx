import { Component, ComponentProps, PairType, JSXChunk }from "@types";
import { extractComponentChunks } from "./helpers";

const converter = (() => {

    let globalContent: string = "";
    let chunks: JSXChunk[] = [];
    const components: Component[] = [];

    const initialize = (content: string) => {
        globalContent = content;

        trimContent();
        chunks = extractComponentChunks(content);
        makeComponents();
    }

    const trimContent = () => {

        const start = globalContent.indexOf("<");
        const end = globalContent.lastIndexOf(">");

        globalContent = globalContent.substring(start, end);
    }

    const makeComponents = () => {
        while (chunks.length > 0) {
            const el = chunks.pop();

            if (!el) {
                throw new Error("Content was not sliced properly");
            }

            const newComponent = createComponent(el);

            components.push(newComponent);
        }
    }

    const createComponent = (chunk: JSXChunk): Component => {

        const slice = chunk.body || "";
        const component: Component = {};
        const hasInnerHTML = !slice.startsWith("<");
        const isSelfClosing = !hasInnerHTML && slice.match(/<\s*\/\s*[A-z]*\s*>/g)!== null;

        if (hasInnerHTML) {
            const endOfInnerHTMLIndexRegex = slice.match(/<\/?\s*[A-z]+\s*/g);
            const endOfInnerHTMLIndex = slice.indexOf(endOfInnerHTMLIndexRegex ? endOfInnerHTMLIndexRegex[0] : "");
            component.innerHTML = slice.substring(0, endOfInnerHTMLIndex).trim();
            const componentIndexBounds = findIndexBoundsForPair(slice, PairType.angleBrackets);

            component.children = findComponentsInInnerHTML(slice, componentIndexBounds);
        }
        else {
            const nameRegex = slice.match(/^<[A-z]*/g);
            const name = nameRegex && nameRegex[0].substring(1) || "";

            component.name = name;

            if (!isSelfClosing) {
                component.children = findChildrenInComponent(slice);
            }
        }

        component.props = createComponentProps(slice);
        component.selfClosed = isSelfClosing;

        // console.log(component);

        return component;
    }

    const findComponentsInInnerHTML = (content: string, bounds: number[]): Component[] => {

        const childComponents: Component[] = [];
        const componentSlice = content.substring(bounds[0]).trim();
        const componentSliceIsValid = componentSlice.match(/<\s*\/\s*[A-z]*\s*>$/g) === null;

        if (componentSliceIsValid) {
            // childComponents.push(createComponent(componentSlice));
        }

        return childComponents;
    }

    const findChildrenInComponent = (originalSlice: string): Component[] => {

        const indexPair = findIndexBoundsForPair(originalSlice, PairType.angleBrackets);
        const slice = originalSlice.substring(1+indexPair[1]);
        console.log(slice);
        const children: Component[] = [];


        return children;
    }

    const createComponentProps = (content: string): ComponentProps[] => {

        const props: ComponentProps[] = [];
        const propsRegexMatches = content.match(/[A-z]*=[{"']/g);

        propsRegexMatches?.forEach((item: string, itemIndex: number) => {

            console.log(itemIndex);
            const propStartIndex = content.indexOf(item);
            const name = item.substring(0, item.length - 2);        // -2 because all props have "={" or '="' or "='" at their ends
            let closure = PairType.curlyBrackets;

            if (item.endsWith("'")) {
                closure = PairType.singleQuotes;
            }
            else if (item.endsWith('"')) {
                closure = PairType.doubleQuotes;
            }

            const lookupStartIndex = propStartIndex + name.length + 1;
            const pairBounds = findIndexBoundsForPair(content, closure);
            const value = content.substring(lookupStartIndex + 1, pairBounds[1]).trim();

            props.push({name, value, closure});
        });

        return props;
    }

    const findIndexBoundsForPair = (content: string, pairType: PairType): number[] => {

        let nestIndex = 0;
        let startIndex = -1;
        let endIndex = -1;
        const { symbol, counterSymbol } = getPairSymbols(pairType);

        for (let i = 0; i < content.length; i++) {
            const ch = content[i];

            if (isInvalidSymbol(content, i, pairType)) continue;

            if (pairType === PairType.angleBrackets || pairType === PairType.curlyBrackets) {
                if (ch === symbol) {
                    if (startIndex === -1) {
                        startIndex = i;
                    }
                    nestIndex = nestIndex + 1;
                }
                else if (ch === counterSymbol) {
                    nestIndex = nestIndex - 1;

                    if (nestIndex <= 0){
                        endIndex = i;
                        break;
                    }
                }
            }
            else {
                if (ch === symbol) {
                    if (startIndex === -1) {
                        startIndex = i;
                    }
                    nestIndex = nestIndex + 1;

                    if (nestIndex == 2){
                        endIndex = i;
                        break;
                    }
                }
            }
        }

        if (startIndex === -1 || endIndex === -1) {
            console.log(content);
            console.log(symbol + " " + counterSymbol);
            console.log(nestIndex);
            console.log(endIndex);
            throw new Error("Cannot find pair index bounds.");
        }

        return [startIndex, endIndex];
    }

    const isInvalidSymbol = (content: string, index: number, pairType: PairType): boolean => {

        if (pairType === PairType.angleBrackets){
            const startToSymbol = content.substring(0, index + 1);
            const symbolToEnd = content.substring(index);

            const isArrowFunction = startToSymbol.match(/=\s*>$/g) !== null;
            const isCompareOperator = symbolToEnd.match(/^[<>]\s*=/g) !== null;
            const isInnerHTMLAngleBracket = startToSymbol.match(/{\s*"\s*[<>]$/g) !== null;

            return isArrowFunction || isCompareOperator || isInnerHTMLAngleBracket;
        }

        return false;
    }

    const getPairSymbols = (pairType: PairType) => {
        let symbol = "{";
        let counterSymbol = "}";

        switch(pairType) {
            case PairType.angleBrackets: {
                symbol = "<";
                counterSymbol = ">";
                break;
            }
            case PairType.singleQuotes: {
                symbol = "'";
                counterSymbol = "'";
                break;
            }
            case PairType.doubleQuotes: {
                symbol = '"';
                counterSymbol = '"';
                break;
            }
        }

        return {
            symbol,
            counterSymbol,
        }
    }

    return {
        initialize,
        components
    };
})();

export default converter;
