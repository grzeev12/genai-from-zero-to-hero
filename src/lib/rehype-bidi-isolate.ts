import { visit } from "unist-util-visit";
import type { Root, Text, Element, ElementContent } from "hast";

const LATIN_TOKEN = /[A-Za-z0-9][A-Za-z0-9\-_./:%~°]*/g;
const SKIP_TAGS = new Set(["code", "pre", "a"]);

export default function rehypeBidiIsolate() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (index === null || !parent) return;
      if (parent.type === "element" && SKIP_TAGS.has((parent as Element).tagName)) return;

      const value = node.value;
      LATIN_TOKEN.lastIndex = 0;
      if (!LATIN_TOKEN.test(value)) return;
      LATIN_TOKEN.lastIndex = 0;

      const newNodes: ElementContent[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = LATIN_TOKEN.exec(value)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({ type: "text", value: value.slice(lastIndex, match.index) });
        }
        newNodes.push({
          type: "element",
          tagName: "bdi",
          properties: {},
          children: [{ type: "text", value: match[0] }],
        });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < value.length) {
        newNodes.push({ type: "text", value: value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
}
