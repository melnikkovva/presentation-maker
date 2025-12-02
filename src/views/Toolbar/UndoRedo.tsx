import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { undo, redo, canUndo, canRedo } from '../../store/undoRedo';
import { Button } from '../../common/Button/Button';
import undoIcon from '../../assets/icons/undo.png';
import redoIcon from '../../assets/icons/redo.png';
import styles from './UndoRedo.module.css';

export function UndoRedo() {
    const dispatch = useAppDispatch();
    
    const undoAvailable = useAppSelector(canUndo);
    const redoAvailable = useAppSelector(canRedo);

    function handleUndo(): void {
        dispatch(undo()); 
    }

    function handleRedo(): void {
        dispatch(redo()); 
    }

    return (
        <div className={styles.undoRedoContainer}>
        <Button
            onClick={handleUndo}
            icon={undoIcon}
            disabled={!undoAvailable}
        />
        <Button
            onClick={handleRedo}
            icon={redoIcon}
            disabled={!redoAvailable}
        />
        </div>
    );
}