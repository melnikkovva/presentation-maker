export function createUndoStack() {
    const past: Array<{
        doWithData: () => void;
        undoWithData: () => void;
    }> = [];
    const future: Array<{
        doWithData: () => void;
        undoWithData: () => void;
    }> = [];

    return {
        push(doFn: (...args: any[]) => void, undoFn: (...args: any[]) => void, ...argsToClone: any[]) {
            const clonedArgs = structuredClone(argsToClone);
            const action = {
                doWithData: () => doFn(...clonedArgs),
                undoWithData: () => undoFn(...clonedArgs),
            };

            past.push(action);
            future.length = 0; 
        },

        undo() {
            const action = past.pop();
            if (action) {
                action.undoWithData();
                future.unshift(action);
            }
        },

        redo() {
            const action = future.shift();
            if (action) {
                action.doWithData();
                past.push(action);
            }
        },

        get canUndo() {
            return past.length > 0;
        },

        get canRedo() {
            return future.length > 0;
        },
    };
}

export const undoStack = createUndoStack();