import type { Root, Element, ElementContent, Text } from "hast";

const LATIN_TOKEN = /[A-Za-z0-9][A-Za-z0-9\-_./:%~°]*/g;
const SKIP_TAGS = new Set(["code", "pre", "a", "blockquote"]);

function isolateText(value: string): ElementContent[] | null {
  LATIN_TOKEN.lastIndex = 0;
  if (!LATIN_TOKEN.test(value)) return null;
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
  return newNodes;
}

function walk(children: ElementContent[]): ElementContent[] {
  const result: ElementContent[] = [];
  for (const child of children) {
    if (child.type === "text") {
      const isolated = isolateText((child as Text).value);
      if (isolated) {
        result.push(...isolated);
      } else {
        result.push(child);
      }
    } else if (child.type === "element") {
      const el = child as Element;
      if (SKIP_TAGS.has(el.tagName)) {
        result.push(el);
      } else {
        result.push({ ...el, children: walk(el.children as ElementContent[]) });
      }
    } else {
      result.push(child);
    }
  }
  return result;
}

export default function rehypeBidiIsolate() {
  return (tree: Root) => {
    tree.children = walk(tree.children as ElementContent[]) as Root["children"];
  };
}
