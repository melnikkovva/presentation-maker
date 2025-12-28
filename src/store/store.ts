import { configureStore } from '@reduxjs/toolkit';
import combinedReducer, { initialState } from './presentationReducer';
import { setLoadedPresentation, resetPresentation, buildStateFromPresentation } from './slices/presentationSlice';
import { undoRedo } from './undoRedo';

const rootReducer = (state: any, action: any) => {
  if (action.type === setLoadedPresentation.type) {
    return buildStateFromPresentation(action.payload);
  }
  if (action.type === resetPresentation.type) {
    return initialState;
  }
  return combinedReducer(state, action);
};

const undoableReducer = undoRedo(rootReducer, initialState);

export const store = configureStore({
  reducer: undoableReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;