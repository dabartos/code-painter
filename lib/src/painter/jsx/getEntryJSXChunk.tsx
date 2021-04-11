import { getInnerHTML, resolveFooter, resolveHeader } from "./helpers";
import { JSXChunk, JSXComponentTag }from "@types";

const getEntryJSXChunk = (inContent: string): JSXChunk => {

    const getChunk = (content: string): JSXChunk => {

        const isInnerHTML = !content.startsWith("<");

        if (isInnerHTML) {
            const innerHTML = getInnerHTML(content);

            return {
                name: "",
                body: innerHTML,
                isInnerHTML: true
            }
        }
        else {
            const header: JSXComponentTag = resolveHeader(content);
            const footer = resolveFooter(header, content);
            const body: string = content.substring(header.endIndex, footer?.startIndex);

            const clipIndex = header.selfClosing && header.endIndex || footer?.endIndex;

            return {
                name: header.name,
                body,
                props: header.props,
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
        body: inContent
    };

    recursiveChunksSearch(entryChunk);

    return entryChunk;
}

export default getEntryJSXChunk;
