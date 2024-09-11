import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';

import { $createNewHeaderNode, NewHeaderNode } from '../../nodes/NewHeaderNode/NewHeaderNode';

export const INSERT_NEW_HEADER: LexicalCommand<undefined> = createCommand();

export default function NewHeaderPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([NewHeaderNode])) {
      throw new Error('NewHeaderPlugin: NewHeaderNode is not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_NEW_HEADER,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          // Create the new header node
          const newHeaderNode = $createNewHeaderNode();

          editor.update(() => {
            // Insert the new node at the nearest root of the current selection
            $insertNodeToNearestRoot(newHeaderNode);
          });

          // Focus on the newly inserted header's title element
          setTimeout(() => {
            const titleElement = document.querySelector(`[data-title-key="${newHeaderNode.getKey()}"]`);
            if (titleElement) {
              titleElement.focus();
            }
          }, 0); // Use setTimeout to ensure DOM is updated before focusing

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
