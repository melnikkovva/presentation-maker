import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Selection } from '../types/types_of_presentation';

const initialState: Selection = [];

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    selectSlide: (_, action: PayloadAction<string>) => {
      return [{
        slideId: action.payload,
        objectId: '',
        typeElement: 'none' 
      }];
    },
    
    toggleObjectSelection: (state, action: PayloadAction<{
        slideId: string; 
        objectId: string; 
        typeElement: 'text' | 'image';
      }>) => {
        const { slideId, objectId, typeElement } = action.payload;
        const existingIndex = state.findIndex(
          item => item.objectId === objectId && item.slideId === slideId
        );

        if (existingIndex >= 0) {
          return state.filter((_, index) => index !== existingIndex);
        } else {
          return [...state, { slideId, objectId, typeElement }];
        }
    },

    clearSelection: () => {
      return [];
    },

    setSelection: (state, action: PayloadAction<Selection>) => {
      return action.payload;
    }
  },
});

export const { 
  selectSlide,
  toggleObjectSelection,
  clearSelection,
  setSelection
} = selectionSlice.actions;
export default selectionSlice.reducer;