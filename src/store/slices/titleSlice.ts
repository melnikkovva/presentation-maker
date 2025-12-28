import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = 'Новая презентация';

export const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    renamePresentation: (state, action: PayloadAction<string>) => {
      return state = action.payload;
    },
    setTitle: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
    resetTitle: () => {
      return initialState;
    }
  },
});

export const { 
  renamePresentation, 
  setTitle, 
  resetTitle 
} = titleSlice.actions;
export default titleSlice.reducer;