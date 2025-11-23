import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Selection } from '../types/types_of_presentation';

const initialState: Selection | null = null;

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: initialState as Selection | null,
  reducers: {
    selectSlide: (state, action: PayloadAction<string>) => {
      if (state) {
        state.slideId = action.payload;
        state.objectId = '';
        state.typeElement = 'none';
      } else {
        return {
          slideId: action.payload,
          objectId: '',
          typeElement: 'none'
        };
      }
    },
    
    selectObject: (state, action: PayloadAction<{ slideId: string; objectId: string; typeElement: 'text' | 'image' | 'none' } | null>) => {
      if (action.payload === null) {
        return null;
      }
      return action.payload;
    }
  },
});

export const { 
  selectSlide,
  selectObject
} = selectionSlice.actions;
export default selectionSlice.reducer;