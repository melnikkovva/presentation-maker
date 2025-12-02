import { configureStore } from '@reduxjs/toolkit';
import combinedReducer, { initialState } from './presentationReducer';
import { undoRedo } from './undoRedo';

const undoableReducer = undoRedo(combinedReducer, initialState);

export const store = configureStore({
  reducer: undoableReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;