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

import { $createTaskNode, TaskNode } from '../../nodes/TaskNode/TaskNode';

export const INSERT_TASK: LexicalCommand<undefined> = createCommand();

export default function TaskPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TaskNode])) {
      throw new Error('TaskPlugin: TaskNode is not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_TASK,
        () => {
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) {
            return false;
          }

          const taskNode = $createTaskNode();

          editor.update(() => {
            $insertNodeToNearestRoot(taskNode);
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
