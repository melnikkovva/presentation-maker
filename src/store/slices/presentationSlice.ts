import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../types/types_of_presentation';

const initialState: Presentation = {
  id: '1',
  title: 'Новая презентация',
  slides: {
    slides: [],
    currentSlideId: null,
  },
  selection: null,
};

export const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    renamePresentation: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    updatePresentation: (state, action: PayloadAction<Partial<Presentation>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { renamePresentation, updatePresentation } = presentationSlice.actions;
export default presentationSlice.reducer;