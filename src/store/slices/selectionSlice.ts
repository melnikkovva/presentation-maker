import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Selection } from '../types/types_of_presentation';

const initialState: Selection | null = null;

export const selectionSlice = createSlice({
  name: 'selection',
  initialState: initialState as Selection | null,
  reducers: {
    selectObject: (state, action: PayloadAction<{ slideId: string; objectId: string; typeElement: 'text' | 'image' | 'none' } | null>) => {
      return action.payload;
    },
    
    clearSelection: () => {
      return null;
    },
  },
});

export const { selectObject, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;