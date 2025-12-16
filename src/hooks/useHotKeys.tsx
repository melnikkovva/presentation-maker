import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { undo, redo, canUndo, canRedo } from '../store/undoRedo'; 

export function useHotKeys() {
    const dispatch = useAppDispatch();
    const canU = useAppSelector(canUndo); 
    const canR = useAppSelector(canRedo);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && (event.key === 'z' || event.key === 'Z' || event.key === 'я' || event.key === 'Я')){
                event.preventDefault();
                if (canU) {
                    dispatch(undo());
                }
                return;
            }

            if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || event.key === 'Y' || event.key === 'н' || event.key === 'Н')) {
                event.preventDefault();
                if (canR) {
                    dispatch(redo());
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [canU, canR]);
}