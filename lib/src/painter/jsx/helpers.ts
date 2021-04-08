import { JSXChunk } from "@types";

const extractComponentChunks = (content: string): JSXChunk[] => {
    const recursiveChunksSearch = (parent: JSXChunk): JSXChunk[] => {

        let chunks: JSXChunk[] = [];
        let content = parent.body || "";

        while (content.length > 0) {

            const newChunk: JSXChunk = getChunk(content);
            newChunk.parent = parent;

            chunks.push(newChunk);

            if (!newChunk.selfClosing && newChunk.body) {
                chunks = [...chunks, ...recursiveChunksSearch(newChunk)];
            }

            content = content.substring(newChunk.start, newChunk.end);
        }

        return chunks;
    }

    return recursiveChunksSearch({
        head: "",
        body: content,
        start: 0,
        end: content.length
    });
}

const getChunk = (content: string): JSXChunk => {

    return {
        head: "",
        body: "",
        start: 0,
        end: content.length
    };
}

export {
    extractComponentChunks
};
