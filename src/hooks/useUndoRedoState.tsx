import { useEffect, useState } from 'react';
import { undoStack } from '../store/UndoRedo';

export function useUndoRedoState() {
    const [canUndo, setCanUndo] = useState(undoStack.canUndo);
    const [canRedo, setCanRedo] = useState(undoStack.canRedo);

    useEffect(() => {
        const interval = setInterval(() => {
            setCanUndo(undoStack.canUndo);
            setCanRedo(undoStack.canRedo);
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return { canUndo, canRedo };
}