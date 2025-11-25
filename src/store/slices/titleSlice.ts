import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState = 'Новая презентация';

export const titleSlice = createSlice({
  name: 'title',
  initialState,
  reducers: {
    renamePresentation: (state, action: PayloadAction<string>) => {
      return state = action.payload;
    }
  },
});

export const { renamePresentation } = titleSlice.actions;
export default titleSlice.reducer;