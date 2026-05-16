import { createAsyncThunk } from '@reduxjs/toolkit';
import { getPresentationDB, saveToDB } from '../functions/functions_for_DB';
import { setLoadedPresentation } from '../slices/presentationSlice';
import { setPresentationId } from '../slices/idSlice';
import type { Presentation } from '../types/types_of_presentation';
import { getImageDimensions, scaleToFitSlide } from '../functions/imageDownloader';
import { addImageObjectWithId, updateImageObjectDimensions } from '../slices/objectsSlice';

export const loadPresentation = createAsyncThunk(
  'presentation/loadPresentation',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const row = await getPresentationDB(id);
      if (!row?.json) {
        return rejectWithValue('Presentation not found');
      }

      const data = JSON.parse(row.json);


      dispatch(setLoadedPresentation(data));
      dispatch(setPresentationId(id));
      return data;
    } catch (error) {
      console.error('Failed to load presentation:', error);
      return rejectWithValue('Load error');
    }
  }
);

export const savePresentation = createAsyncThunk(
  'presentation/savePresentation',
  async (presentation: Presentation, { rejectWithValue }) => {
    try {
      await saveToDB(presentation, presentation.id);
      return presentation;
    } catch (error) {
      console.error('Failed to save presentation:', error);
      return rejectWithValue('Save error');
    }
  }
);


export const addImageObjectWithDimensions = createAsyncThunk(
  'objects/addImageObjectWithDimensions',
  async (
    { slideId, src }: { slideId: string; src: string },
    { dispatch }
  ) => {
    try {
      const tempId = crypto.randomUUID();
      
      dispatch(addImageObjectWithId({
        id: tempId,
        slideId,
        src,
      }));
      
      const dimensions = await getImageDimensions(src);
      const scaled = scaleToFitSlide(dimensions.width, dimensions.height);
      
      dispatch(updateImageObjectDimensions({
        id: tempId,
        width: scaled.width,
        height: scaled.height,
        originalWidth: dimensions.width,
        originalHeight: dimensions.height,
      }));
      
      return tempId;
    } catch (error) {
      console.error('Ошибка при добавлении изображения:', error);
      throw error;
    }
  }
);
