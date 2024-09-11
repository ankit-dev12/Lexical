import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import * as React from 'react';
import { useEffect, useState } from 'react';

export type SerializedNewHeaderNode = SerializedLexicalNode;

function NewHeaderComponent({ nodeKey }: { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true); // State to manage placeholder visibility

  useEffect(() => {
    const removeHeaderNodeOnDelete = (event: KeyboardEvent) => {
      event.preventDefault();
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.getNodes().forEach((node) => {
            if ($isNewHeaderNode(node)) {
              node.remove();
            }
          });
        }
      });
    };

    // Register typing event to hide placeholder
    const onType = () => {
      setPlaceholderVisible(false);
    };

    const unregisterCommands = mergeRegister(
      editor.registerCommand(KEY_DELETE_COMMAND, removeHeaderNodeOnDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, removeHeaderNodeOnDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand('INSERT_CHARACTER', onType, COMMAND_PRIORITY_LOW) // Register typing command
    );

    return () => {
      unregisterCommands();
    };
  }, [editor, nodeKey]);

  return null;
}

export class NewHeaderNode extends ElementNode {
  static getType(): string {
    return 'new-header';
  }

  static clone(node: NewHeaderNode): NewHeaderNode {
    return new NewHeaderNode(node.__key);
  }

  static importJSON(serializedNode: SerializedNewHeaderNode): NewHeaderNode {
    return $createNewHeaderNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      h2: (domNode: HTMLElement) => {
        if (domNode.tagName.toLowerCase() === 'h2') {
          return {
            conversion: $convertNewHeaderElement,
            priority: COMMAND_PRIORITY_LOW,
          };
        }
        return null;
      },
    };
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: this.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const container = document.createElement('div');
    container.setAttribute('type', this.getType());
    container.contentEditable = 'true'; // Make the container editable

    // Create and style the title to look like an h2 element
    const titleElement = document.createElement('div');
    titleElement.textContent = 'Title';
    titleElement.style.fontSize = '1.5em'; // Equivalent to h2 font-size
    titleElement.style.fontWeight = 'bold'; // Equivalent to h2 font-weight
    titleElement.style.marginBottom = '0.5em'; // Spacing similar to h2

    // Placeholder element
    const placeholderElement = document.createElement('div');
    placeholderElement.textContent = 'Type your title here...'; // Placeholder text
    placeholderElement.style.fontSize = '1.5em';
    placeholderElement.style.fontWeight = 'bold';
    placeholderElement.style.color = '#888';
    placeholderElement.style.position = 'absolute'; // Positioned absolutely to overlap the title

    // Append both title and placeholder to the container
    container.appendChild(titleElement);
    container.appendChild(placeholderElement);

    // Create a paragraph element for the content
    const paragraphElement = document.createElement('p');
    paragraphElement.textContent =
      '';
    container.appendChild(paragraphElement);

    // Add event listeners to handle placeholder visibility
    container.addEventListener('focus', () => {
      placeholderElement.style.display = 'none'; // Hide placeholder on focus
    });

    container.addEventListener('blur', () => {
      if (!container.textContent.trim()) {
        placeholderElement.style.display = 'block'; // Show placeholder if empty
      }
    });

    return container;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <NewHeaderComponent nodeKey={this.getKey()} />;
  }
}

function $convertNewHeaderElement(): DOMConversionOutput {
  return { node: $createNewHeaderNode() };
}

export function $createNewHeaderNode(): NewHeaderNode {
  return new NewHeaderNode();
}

export function $isNewHeaderNode(node: LexicalNode | null | undefined): node is NewHeaderNode {
  return node instanceof NewHeaderNode;
}
