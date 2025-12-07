import type { Reducer } from "redux";
import type { AppState } from "./types/types_of_presentation";
import type { PayloadAction } from '@reduxjs/toolkit';

export type UndoRedoState = {
    past: AppState[];
    present: AppState;
    future: AppState[];
};

export type UndoAction = { type: 'UNDO' };
export type RedoAction = { type: 'REDO' };

type AppAction = PayloadAction<unknown>;

export type UndoRedoActions = UndoAction | RedoAction | AppAction;

export const canUndo = (state: UndoRedoState) => state.past.length > 0;
export const canRedo = (state: UndoRedoState) => state.future.length > 0;

export const undo = (): UndoAction => ({ type: 'UNDO' });
export const redo = (): RedoAction => ({ type: 'REDO' });

const restoreSelection = (newState: AppState, currentState: AppState): AppState => {
    return {
        ...newState,
        selection: currentState.selection
    };
};

export function undoRedo(
    reducer: Reducer<AppState, AppAction>,
    initialState: AppState
): Reducer<UndoRedoState, UndoRedoActions> {
    const initialUndoRedoState: UndoRedoState = {
        past: [],
        present: initialState,
        future: []
    };

    return function (state = initialUndoRedoState, action: UndoRedoActions): UndoRedoState {
        switch (action.type) {
            case 'UNDO': {
                if (state.past.length === 0) return state;

                const previous = state.past[state.past.length - 1];
                const newPast = state.past.slice(0, -1);
                
                const newPresent = restoreSelection(previous, state.present);

                return {
                    past: newPast,
                    present: newPresent,
                    future: [state.present, ...state.future]
                };
            }

            case 'REDO': {
                if (state.future.length === 0) return state;

                const next = state.future[0];
                const newFuture = state.future.slice(1);
                
                const newPresent = restoreSelection(next, state.present);

                return {
                    past: [...state.past, state.present],
                    present: newPresent,
                    future: newFuture
                };
            }

            default: {
                const newPresent = reducer(state.present, action as AppAction);

                if ((newPresent.title === state.present.title && newPresent.slides === state.present.slides && newPresent.objects === state.present.objects)) {
                    return {...state,
                        present: newPresent
                    }
                }
                
                return {
                    past: [...state.past, state.present],
                    present: newPresent,
                    future: []
                };
            }
        }
    };
}