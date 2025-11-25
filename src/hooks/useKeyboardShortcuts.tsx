import { useEffect } from 'react';
import { undoStack } from '../store/store';

export function useKeyboardShortcuts() {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const ctrlKey = event.ctrlKey || event.metaKey; 
                console.log('Key:', event.key, 'Code:', event.code, 'Which:', event.which);

            if (ctrlKey && event.key === 'z') {
                event.preventDefault();
                undoStack.undo();
            }
            
            if (ctrlKey && event.key === 'y') {
                event.preventDefault();
                undoStack.redo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
}