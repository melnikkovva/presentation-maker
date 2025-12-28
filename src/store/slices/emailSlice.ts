import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: string = '';

export const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setUserEmail: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
});

export const { 
  setUserEmail,
} = emailSlice.actions;
export default emailSlice.reducer;