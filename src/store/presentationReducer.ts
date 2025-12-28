import { combineReducers } from 'redux';
import titleReducer from './slices/titleSlice';
import slidesReducer from './slices/slidesSlice';
import selectionReducer from './slices/selectionSlice';
import objectsReducer from './slices/objectsSlice';
import idReducer from './slices/idSlice';
import emailReducer from './slices/emailSlice';
import type { AppState } from './types/types_of_presentation';

export const initialState: AppState = {
  id: '',
  email: '',
  title: 'Новая презентация',
  slides: {
    slides: [{
      id: 'slide-1',
      objectIds: [],
      background: { type: 'color', color: '#ffffff' }
    }],
    currentSlideId: 'slide-1'
  },
  selection: [],
  objects: { objects: [] }
};

const combinedReducer = combineReducers({
  id: idReducer,
  email: emailReducer,
  title: titleReducer,
  slides: slidesReducer,
  selection: selectionReducer,
  objects: objectsReducer,
});

export default combinedReducer;
