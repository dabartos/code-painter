import * as CPT from "./types";

const getComponentsList = (() => {

    let fullContent: string = "";
    const slicedContentList: string[] = [];
    const components: CPT.Component[] = [];

    const initialize = (content: string) => {
        fullContent = content;
        sliceContent();
        makeComponents();
    }

    const sliceContent = () => {

        while (fullContent.length > 0) {
            const endIndex = findIndexBoundsForPair(fullContent, CPT.PairType.angleBrackets);
            const slicedContent = fullContent.substring(0, endIndex[1] + 1).trim();

            slicedContentList.push(slicedContent);

            fullContent = fullContent.substring(endIndex[1] + 1);
        }

        return slicedContentList.reverse();
    }

    const makeComponents = () => {
        while (slicedContentList.length > 0) {
            const el = slicedContentList.pop();

            if (!el) {
                throw new Error("Content was not sliced properly");
            }

            const newComponent = createComponent(el);

            components.push(newComponent);
        }
    }

    const createComponent = (slice: string): CPT.Component => {

        const component: CPT.Component = {};
        const hasInnerHTML = !slice.startsWith("<");
        const isSelfClosing = !hasInnerHTML && slice.match(/<\s*\/\s*[A-z]*\s*>/g)!== null;

        if (hasInnerHTML) {
            const endOfInnerHTMLIndexRegex = slice.match(/<\/?\s*[A-z]+\s*/g);
            const endOfInnerHTMLIndex = slice.indexOf(endOfInnerHTMLIndexRegex ? endOfInnerHTMLIndexRegex[0] : "");
            component.innerHTML = slice.substring(0, endOfInnerHTMLIndex).trim();
            const componentIndexBounds = findIndexBoundsForPair(slice, CPT.PairType.angleBrackets);

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

    const findComponentsInInnerHTML = (content: string, bounds: number[]): CPT.Component[] => {

        const childComponents: CPT.Component[] = [];
        const componentSlice = content.substring(bounds[0]).trim();
        const componentSliceIsValid = componentSlice.match(/<\s*\/\s*[A-z]*\s*>$/g) === null;

        if (componentSliceIsValid) {
            childComponents.push(createComponent(componentSlice));
        }

        return childComponents;
    }

    const findChildrenInComponent = (originalSlice: string): CPT.Component[] => {

        const indexPair = findIndexBoundsForPair(originalSlice, CPT.PairType.angleBrackets);
        const slice = originalSlice.substring(1+indexPair[1]);
        console.log(originalSlice);
        const children: CPT.Component[] = [];


        return children;
    }

    const createComponentProps = (content: string): CPT.ComponentProps[] => {

        const props: CPT.ComponentProps[] = [];
        const propsRegexMatches = content.match(/[A-z]*=[{"']/g);

        propsRegexMatches?.forEach((item: string, itemIndex: number) => {

            const propStartIndex = content.indexOf(item);
            const name = item.substring(0, item.length - 2);        // -2 because all props have "={" or '="' or "='" at their ends
            let closure = CPT.PairType.curlyBrackets;

            if (item.endsWith("'")) {
                closure = CPT.PairType.singleQuotes;
            }
            else if (item.endsWith('"')) {
                closure = CPT.PairType.doubleQuotes;
            }

            const lookupStartIndex = propStartIndex + name.length + 1;
            const pairBounds = findIndexBoundsForPair(content, closure);
            const value = content.substring(lookupStartIndex + 1, pairBounds[1]).trim();

            props.push({name, value, closure});
        });

        return props;
    }

    const findIndexBoundsForPair = (content: string, pairType: CPT.PairType): number[] => {

        let nestIndex = 0;
        let startIndex = -1;
        let endIndex = -1;
        const { symbol, counterSymbol } = getPairSymbols(pairType);

        for (let i = 0; i < content.length; i++) {
            const ch = content[i];

            if (isInvalidSymbol(content, i, pairType)) continue;

            if (pairType === CPT.PairType.angleBrackets || pairType === CPT.PairType.curlyBrackets) {
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

    const isInvalidSymbol = (content: string, index: number, pairType: CPT.PairType): boolean => {

        if (pairType === CPT.PairType.angleBrackets){
            const startToSymbol = content.substring(0, index + 1);
            const symbolToEnd = content.substring(index);

            const isArrowFunction = startToSymbol.match(/=\s*>$/g) !== null;
            const isCompareOperator = symbolToEnd.match(/^[<>]\s*=/g) !== null;
            const isInnerHTMLAngleBracket = startToSymbol.match(/{\s*"\s*[<>]$/g) !== null;

            return isArrowFunction || isCompareOperator || isInnerHTMLAngleBracket;
        }

        return false;
    }

    const getPairSymbols = (pairType: CPT.PairType) => {
        let symbol = "{";
        let counterSymbol = "}";

        switch(pairType) {
            case CPT.PairType.angleBrackets: {
                symbol = "<";
                counterSymbol = ">";
                break;
            }
            case CPT.PairType.singleQuotes: {
                symbol = "'";
                counterSymbol = "'";
                break;
            }
            case CPT.PairType.doubleQuotes: {
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

export default getComponentsList;
