import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalNode,
  TextNode,
  DOMConversionMap,
  DOMExportOutput,
  NodeKey,
  createCommand,
  COMMAND_PRIORITY_LOW,
  $getRoot,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

// Define the AnkitHeaderNode
export class AnkitHeaderNode extends TextNode {
  static getType(): string {
    return 'ankit-header';
  }

  static clone(node: AnkitHeaderNode): AnkitHeaderNode {
    return new AnkitHeaderNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(): HTMLElement {
    const element = document.createElement('h2');
    element.textContent = this.getTextContent();
    return element;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement): boolean {
    if (dom.textContent !== this.getTextContent()) {
      dom.textContent = this.getTextContent();
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      h2: (domNode: HTMLElement) => ({
        conversion: () => ({ node: new AnkitHeaderNode(domNode.textContent || '') }),
        priority: 1,
      }),
    };
  }

  static exportDOM(node: LexicalNode): DOMExportOutput {
    const element = document.createElement('h2');
    element.textContent = (node as AnkitHeaderNode).getTextContent();
    return { element };
  }
}

// Define the AnkitParagraphNode
export class AnkitParagraphNode extends TextNode {
  static getType(): string {
    return 'ankit-paragraph';
  }

  static clone(node: AnkitParagraphNode): AnkitParagraphNode {
    return new AnkitParagraphNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(): HTMLElement {
    const element = document.createElement('p');
    element.textContent = this.getTextContent();
    return element;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement): boolean {
    if (dom.textContent !== this.getTextContent()) {
      dom.textContent = this.getTextContent();
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      p: (domNode: HTMLElement) => ({
        conversion: () => ({ node: new AnkitParagraphNode(domNode.textContent || '') }),
        priority: 1,
      }),
    };
  }

  static exportDOM(node: LexicalNode): DOMExportOutput {
    const element = document.createElement('p');
    element.textContent = (node as AnkitParagraphNode).getTextContent();
    return { element };
  }
}

// Define the custom command for inserting nodes
export const INSERT_ANKIT_COMMAND: LexicalCommand<void> = createCommand();

// Export node creation functions
export function $createAnkitHeaderNode(text = 'Default Header Text'): AnkitHeaderNode {
  return new AnkitHeaderNode(text);
}

export function $createAnkitParagraphNode(text = 'This is a default paragraph text.'): AnkitParagraphNode {
  return new AnkitParagraphNode(text);
}

// The AnkitPlugin component
export default function AnkitPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([AnkitHeaderNode, AnkitParagraphNode])) {
      throw new Error('AnkitPlugin: AnkitHeaderNode or AnkitParagraphNode not registered on editor');
    }

    // Register a custom command to insert nodes
    return editor.registerCommand(
      INSERT_ANKIT_COMMAND,
      () => {
        editor.update(() => {
          const root = $getRoot();
          const headerNode = $createAnkitHeaderNode();
          const paragraphNode = $createAnkitParagraphNode();
          root.append(headerNode, paragraphNode);
        });
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return null;
}
