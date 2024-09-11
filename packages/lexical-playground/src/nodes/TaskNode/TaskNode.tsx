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
import { useEffect } from 'react';

export type SerializedTaskNode = SerializedLexicalNode;

function TaskComponent({ nodeKey }: { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeTaskNodeOnDelete = (event: KeyboardEvent) => {
      event.preventDefault();
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.getNodes().forEach((node) => {
            if ($isTaskNode(node)) {
              node.remove();
            }
          });
        }
      });
    };

    return mergeRegister(
      editor.registerCommand(KEY_DELETE_COMMAND, removeTaskNodeOnDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, removeTaskNodeOnDelete, COMMAND_PRIORITY_LOW),
    );
  }, [editor, nodeKey]);

  return (
    <div className="task-container">
      <div className="task-title">Title</div>
      <div className="task-shortdesc">Short description</div>
      <div className="task-steps">
        <div className="task-context">Context</div>
        <div className="task-step">Step 1: Start</div>
        <div className="task-step">Step 2: Execute</div>
        <div className="task-step">Step 3: Finish</div>
      </div>
    </div>
  );
}

export class TaskNode extends ElementNode {
  static getType(): string {
    return 'task';
  }

  static clone(node: TaskNode): TaskNode {
    return new TaskNode(node.__key);
  }

  static importJSON(serializedNode: SerializedTaskNode): TaskNode {
    return $createTaskNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      task: (domNode: HTMLElement) => {
        if (domNode.tagName.toLowerCase() === 'task') {
          return {
            conversion: $convertTaskElement,
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

    // Title
    const titleElement = document.createElement('div');
    titleElement.textContent = 'Title: first_task';
    titleElement.style.fontSize = '1.2em';
    titleElement.style.fontWeight = 'bold';

    // Short Description
    const shortDescElement = document.createElement('div');
    shortDescElement.textContent = 'This is a sample description of the first task created for testing.';
    shortDescElement.style.fontStyle = 'italic';

    // Context and Steps
    const stepsContainer = document.createElement('div');
    stepsContainer.textContent = 'Steps for the first task:';
    
    const step1 = document.createElement('div');
    step1.textContent = 'Step 1: start';
    stepsContainer.appendChild(step1);

    const step2 = document.createElement('div');
    step2.textContent = 'Step 2: execute';
    stepsContainer.appendChild(step2);

    const step3 = document.createElement('div');
    step3.textContent = 'Step 3: finish';
    stepsContainer.appendChild(step3);

    container.appendChild(titleElement);
    container.appendChild(shortDescElement);
    container.appendChild(stepsContainer);

    return container;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <TaskComponent nodeKey={this.getKey()} />;
  }
}

function $convertTaskElement(): DOMConversionOutput {
  return { node: $createTaskNode() };
}

export function $createTaskNode(): TaskNode {
  return new TaskNode();
}

export function $isTaskNode(node: LexicalNode | null | undefined): node is TaskNode {
  return node instanceof TaskNode;
}
