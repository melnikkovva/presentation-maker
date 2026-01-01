import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPresentationDB } from '../functions/functions_for_DB';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Presentation } from '../types/types_of_presentation';
import type { RootState } from '../store';

export const loadPresentation = createAsyncThunk<
  Presentation,
  string,
  { state: RootState }
>('presentation/load', async (presentationId) => {
  const row = await getPresentationDB(presentationId);
  if (!row?.json) throw new Error('Presentation not found');
  return JSON.parse(row.json);
});

const initialState: string = '';

export const idSlice = createSlice({
  name: 'id',
  initialState,
  reducers: {
    generateNewPresentationId: () => crypto.randomUUID(),
    clearPresentationId: () => '',
    setPresentationId: (_, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
   
});

export const { generateNewPresentationId, clearPresentationId, setPresentationId } = idSlice.actions;
export default idSlice.reducer;