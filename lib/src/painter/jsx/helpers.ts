import { PairType, JSXComponentTag } from "@types";

const getInnerHTML = (content: string): string => {
    let innerHTML = content;

    for (let i = 0; i < content.length; i++) {
        const char = content[i];

        if (char === "<") {
            const before = content.substring(0, i+1);
            const after = content.substring(i);

            if (!before.match(/{\s*["']\s*<$/g) || !after.match(/^<\s*["']\s*}/g)) {
                innerHTML = content.substring(0, i).trim();
                break;
            }
        }
    }

    return innerHTML;
}

const findIndexBoundsForPair = (content: string, pairType: PairType, nestIndex: number = 0): number[] => {

    let startIndex = nestIndex !== 0 ? 0 : -1;
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
                    if (i === 0) {
                        startIndex = 0;
                    }
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
        throw new Error("Cannot find pair index bounds.");
    }

    return [startIndex, endIndex];
}

const resolveHeader = (content: string): JSXComponentTag => {

    const regxName = content.match(/^<\s*[A-z]*/g);
    const name = (regxName && regxName[0])?.substring(1) || "";
    const contentNoName = content.substring(name.length + 1);

    const props = getComponentProps(contentNoName);
    const spreadProps = props.join("\\s*")
        .replaceAll("(", "\\(")
        .replaceAll(")", "\\)")
        .replaceAll("{", "\\{")
        .replaceAll("}", "\\}");

    // + 2 because ("<" + name.length + props.length + ">").length
    const fullHeader = content.match(new RegExp(`\\s*<\\s*${name}\\s*${spreadProps}\\s*\\/?\\s*>`));

    if (!fullHeader) {
        throw new Error("Cannot find full header in content.");
    }

    const startIndex: number = fullHeader.index !== undefined ? fullHeader.index : -1;
    const selfClosingRegex = fullHeader[0].match(/\/\s*>$/g);

    return {
        name,
        startIndex,
        props,
        endIndex: fullHeader[0].length,
        selfClosing: !!selfClosingRegex,
    };
}

const getComponentProps = (content: string): string[] => {

    const props: string[] = [];

    if (content[0] !== "<") {
        const pairIndex = findIndexBoundsForPair(content, PairType.angleBrackets, 1);
        content = content.substring(0, pairIndex[1]);

        while (content.length > 0) {
            content.trim();
            if (content === "/") {
                break;
            }

            const propRegx = content.match(/[A-z]*="|'|{/) || "";
            const prop: string = propRegx && propRegx[0] || "";

            const pairChar = prop[prop.length-1];
            let pairType: PairType = PairType.doubleQuotes;

            switch (pairChar) {
                case "'": {
                    pairType = PairType.singleQuotes;
                    break;
                }
                case "{": {
                    pairType = PairType.curlyBrackets;
                    break;
                }
            }

            const propPair = findIndexBoundsForPair(content, pairType);
            const fullProp = content.substring(0, propPair[1] + 1);

            content = content.substring(fullProp.length).trim();

            props.push(fullProp.trim());
        }
    }

    return props;
}

const resolveFooter = (header: JSXComponentTag, content: string): JSXComponentTag | null => {

    if (header.selfClosing) {
        return null;
    }

    const name = header.name;
    let startIndex: number = -1;
    let endIndex: number = -1;
    let footerTag = null;

    const regexComponentName = new RegExp(`<\\s*\\/?\\s*${name}(?=.*<\\s*\\/\\s*${name}\\s*>)`, "g");
    footerTag = content.match(regexComponentName);

    if (!footerTag) {
        throw new Error(`Cannot find closing tag for [<${name}>].`)
    }

    if (footerTag.length === 1) {
        footerTag = content.match(new RegExp(`<\\s*\\/\\s*${name}\\s*>`));

        if (footerTag) {
            startIndex = content.indexOf(footerTag[0]);
            endIndex = startIndex + footerTag[0].length;
        }
    }
    else {

        footerTag = getIndexValues(content, regexComponentName);

        for (let i = 1; i < footerTag.length; i++) {
            const tag = footerTag[i];

            if (!tag.text.match(/^<\s*\/\s*[A-z]/)) {
                continue;
            }
            else if (footerTag[i-1].text.match(/^<\s*[A-z]/)) {
                startIndex = tag.index;
                endIndex = tag.endIndex;
                break;
            }
        }

    }

    return {
        name,
        startIndex,
        endIndex,
    };
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

type MatchArray = {
    text: string;
    index: number;
    endIndex: number;
}
// https://dustinpfister.github.io/2020/07/08/js-regex-exec/
const getIndexValues = function (str: string, regex: RegExp): MatchArray[] {
    const patt = new RegExp(regex);
    let match;
    let matchArray: MatchArray[] = [];
    if (patt.global) {
        while (match = patt.exec(str)) {
            matchArray.push({
                text: match[0],
                index: match.index,
                endIndex: match.index + match[0].length
            });
        }
    }
    else {
        match = patt.exec(str);
        if (match) {
            matchArray.push({
                text: match[0],
                index: match.index,
                endIndex: match.index + match[0].length
            });
        }
    }

    return matchArray;
};

export {
    getInnerHTML,
    findIndexBoundsForPair,
    resolveHeader,
    resolveFooter,
};
