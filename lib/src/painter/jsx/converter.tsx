import { JSXChunk, JSXComponentTag } from "@/config/conversion-types";
import { getInnerHTML, resolveFooter, resolveHeader } from "./helpers";

const getEntryJSXChunk = (inContent: string): JSXChunk => {

    const getChunk = (content: string): JSXChunk => {

        const isInnerHTML = !content.startsWith("<");

        if (isInnerHTML) {
            const innerHTML = getInnerHTML(content);
            if (innerHTML === ">"){
                debugger;
            }
            return {
                name: "",
                children: [],
                body: innerHTML,
                isInnerHTML: true
            }
        }
        else {
            if (content.includes("MenuItem ")){
                debugger;
            }
            const header: JSXComponentTag = resolveHeader(content);
            const footer = resolveFooter(header, content);
            const body: string = content.substring(header.endIndex, footer?.startIndex);

            const clipIndex = header.selfClosing && header.endIndex || footer?.endIndex;

            return {
                name: header.name,
                body,
                props: header.props,
                children: [],
                clipIndex,
                selfClosing: header.selfClosing,
            };
        }
    }

    const recursiveChunksSearch = (parent: JSXChunk) => {

        let content = parent.body.trim();
        let children: JSXChunk[] = [];

        while (content.length > 0) {

            const newChunk: JSXChunk = getChunk(content);
            children.push(newChunk);

            if (!newChunk.isInnerHTML && !newChunk.selfClosing) {
                recursiveChunksSearch(newChunk);
            }

            const clipComponentIndex = newChunk.clipIndex || newChunk.isInnerHTML && newChunk.body.length || -1;

            if (clipComponentIndex === -1) {
                throw new Error("Something went wrong.");
            }

            content = content.substring(clipComponentIndex).trim();
        }

        parent.children = children;
    }

    const entryChunk: JSXChunk = {
        name: "",
        children: [],
        body: inContent
    };

    recursiveChunksSearch(entryChunk);

    return entryChunk;
}

const converter = (() => {

    let globalContent: string = "";

    const getEntryChunk = (content: string): JSXChunk => {
        trimContent();
        return getEntryJSXChunk(content.replace(/[\n\r]/g, ""));
    }

    const trimContent = () => {

        const start = globalContent.indexOf("<");
        const end = globalContent.lastIndexOf(">");

        globalContent = globalContent.substring(start, end);
    }

    return {
        getEntryChunk,
    };
})();

export default converter;