import { Button } from '../../common/Button/Button';
import { undoStack } from '../../store/UndoRedo';
import { useUndoRedoState } from '../../hooks/useUndoRedoState';

export function UndoRedo() {
    const { canUndo, canRedo } = useUndoRedoState();

    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
                onClick={() => undoStack.undo()}
                disabled={!canUndo}
            >
                Undo
            </Button>
            <Button 
                onClick={() => undoStack.redo()}
                disabled={!canRedo}
            >
                Redo
            </Button>
        </div>
    );
}