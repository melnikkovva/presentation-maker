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

    updateEmailFromSession: () => {
      try {
        const session = JSON.parse(localStorage.getItem('session') || '{}');
        return session.email || '';
      } catch {
        return '';
      }
    },
  },
});

export const { 
    setUserEmail,
    updateEmailFromSession,
} = emailSlice.actions;
export default emailSlice.reducer;