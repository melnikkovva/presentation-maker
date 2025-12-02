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

                return {
                    past: newPast,
                    present: previous,
                    future: [state.present, ...state.future]
                };
            }

            case 'REDO': {
                if (state.future.length === 0) return state;

                const next = state.future[0];
                const newFuture = state.future.slice(1);

                return {
                    past: [...state.past, state.present],
                    present: next,
                    future: newFuture
                };
            }

            default: {
                const newPresent = reducer(state.present, action as AppAction);

                if (newPresent === state.present) {
                    return state;
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