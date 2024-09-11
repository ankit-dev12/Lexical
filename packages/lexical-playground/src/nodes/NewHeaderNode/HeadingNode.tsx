import { TextNode, ElementNode, LexicalNode, NodeKey, DOMConversionMap, DOMConversionOutput, $createTextNode } from 'lexical';

export class HeadingNode extends ElementNode {
  __tag: string;

  constructor(tag: string, key?: NodeKey) {
    super(key);
    this.__tag = tag;
  }

  static getType(): string {
    return 'heading';
  }

  static clone(node: HeadingNode): HeadingNode {
    return new HeadingNode(node.__tag, node.__key);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      h2: (domNode: HTMLElement) => ({
        conversion: convertHeadingElement,
        priority: 1,
      }),
    };
  }

  exportJSON(): any {
    return {
      type: 'heading',
      version: 1,
      tag: this.__tag,
    };
  }

  createDOM(): HTMLElement {
    const element = document.createElement(this.__tag);
    element.className = 'my-custom-heading';
    return element;
  }

  updateDOM(prevNode: HeadingNode): boolean {
    return prevNode.__tag !== this.__tag;
  }

  static importJSON(serializedNode: any): HeadingNode {
    const { tag } = serializedNode;
    return $createHeadingNode(tag);
  }
}

function convertHeadingElement(): DOMConversionOutput {
  return { node: $createHeadingNode('h2') };
}

export function $createHeadingNode(tag: string = 'h2'): HeadingNode {
  const headingNode = new HeadingNode(tag);
  const textNode = $createTextNode('Title');
  headingNode.append(textNode);
  return headingNode;
}

export function $isHeadingNode(node: LexicalNode | null | undefined): node is HeadingNode {
  return node instanceof HeadingNode;
}
