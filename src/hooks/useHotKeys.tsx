import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { undo, redo, canUndo, canRedo } from '../store/undoRedo'; 

export function useHotKeys() {
    const dispatch = useAppDispatch();
    const canU = useAppSelector(canUndo); 
    const canR = useAppSelector(canRedo);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;

            const isInputFocused =
                activeElement instanceof HTMLInputElement ||
                activeElement instanceof HTMLTextAreaElement ||
                activeElement?.getAttribute('contenteditable') === 'true';

            if (isInputFocused) return;

            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                if (canU) {
                    dispatch(undo());
                }
                return;
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                if (canR) {
                    dispatch(redo());
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch, canU, canR]);
}