import { configureStore } from '@reduxjs/toolkit';
import titleReducer from './slices/titleSlice';
import slidesReducer from './slices/slidesSlice';
import selectionReducer from './slices/selectionSlice';
import objectsReducer from './slices/objectsSlice'

export const store = configureStore({
  reducer: {
    title: titleReducer,
    slides: slidesReducer,
    selection: selectionReducer,
    objects: objectsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;