import { createSlice } from '@reduxjs/toolkit';

const initialState: string = '';

export const idSlice = createSlice({
  name: 'id',
  initialState,
  reducers: {
    generateNewPresentationId: () => {
        return crypto.randomUUID();
    },
  },
});

export const { 
    generateNewPresentationId,
} = idSlice.actions;
export default idSlice.reducer;