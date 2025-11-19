import { configureStore } from '@reduxjs/toolkit';
import presentationReducer from './slices/presentationSlice';
import slidesReducer from './slices/slidesSlice';
import selectionReducer from './slices/selectionSlice';
import objectsReducer from './slices/objectsSlice'

export const store = configureStore({
  reducer: {
    presentation: presentationReducer,
    slides: slidesReducer,
    objects: objectsReducer,
    selection: selectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;