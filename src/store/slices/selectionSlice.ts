import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Selection, SelectionItem } from '../types/types_of_presentation';

const initialState: Selection = [];

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelection: (_, action: PayloadAction<Selection>) => {
      return action.payload;
    },

    addToSelection: (state, action: PayloadAction<SelectionItem>) => {
      const newItem = action.payload;
      
      let alreadyExists = false;
      for (let i = 0; i < state.length; i++) {
        if (state[i].objectId === newItem.objectId) {
          alreadyExists = true;
          break;
        }
      }
      
      if (!alreadyExists) {
        state.push(newItem);
      }
    },

    removeFromSelection: (state, action: PayloadAction<string>) => {
      const objectId = action.payload;
      const newSelection: Selection = [];
      
      for (let i = 0; i < state.length; i++) {
        if (state[i].objectId !== objectId) {
          newSelection.push(state[i]);
        }
      }
      
      return newSelection;
    },

    toggleSelection: (state, action: PayloadAction<SelectionItem>) => {
      const itemToToggle = action.payload;
      let foundIndex = -1;
      
      for (let i = 0; i < state.length; i++) {
        if (state[i].objectId === itemToToggle.objectId) {
          foundIndex = i;
          break;
        }
      }
      
      if (foundIndex !== -1) {
        state.splice(foundIndex, 1);
      } else {
        state.push(itemToToggle);
      }
    },

    selectSlide: (_, action: PayloadAction<string>) => {
      return [{
        slideId: action.payload,
        objectId: '',
        typeElement: 'none' as const
      }];
    },

    clearSelection: () => {
      return [];
    },
  },
});

export const { 
  selectSlide,
  clearSelection,
  setSelection,
  addToSelection,
  removeFromSelection,
  toggleSelection
} = selectionSlice.actions;
export default selectionSlice.reducer;