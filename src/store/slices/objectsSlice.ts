import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SlideObject, TextObject, ImageObject } from '../types/types_of_presentation';

interface ObjectsState {
  slides: {
    [slideId: string]: {
      objects: SlideObject[];
    };
  };
}

const initialState: ObjectsState = {
  slides: {},
};

function generateId(): string {
  return crypto.randomUUID();
}

const createDefaultTextObjectWithId = (id: string, text?: string): TextObject => ({
  type: 'text',
  x: 100,
  y: 100,
  w: 200,
  h: 50,
  text: text?.trim() || 'Новый текст',
  fontSize: 16,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  textDecoration: 'none',
  textAlign: 'left',
  color: '#000000',
  shadow: null,
  id: id,
});

const createDefaultImageObjectWithId = (id: string, src: string): ImageObject => ({
  type: 'image',
  x: 100,
  y: 100,
  w: 200,
  h: 150,
  src: src,
  id: id,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    addObjectToSlide: (state, action: PayloadAction<{ slideId: string; object: SlideObject }>) => {
      const { slideId, object } = action.payload;
      if (!state.slides[slideId]) {
        state.slides[slideId] = { objects: [] };
      }
      state.slides[slideId].objects.push(object);
    },
    
    removeObjectFromSlide: (state, action: PayloadAction<{ slideId: string; objectId: string }>) => {
      const { slideId, objectId } = action.payload;
      if (state.slides[slideId]) {
        state.slides[slideId].objects = state.slides[slideId].objects.filter(obj => obj.id !== objectId);
      }
    },
    
    addTextObject: (state, action: PayloadAction<{ slideId: string; text?: string }>) => {
      const { slideId, text = 'Новый текст' } = action.payload;
      if (!state.slides[slideId]) {
        state.slides[slideId] = { objects: [] };
      }
      const textObject = createDefaultTextObjectWithId(generateId(), text);
      state.slides[slideId].objects.push(textObject);
    },
    
    addImageObject: (state, action: PayloadAction<{ slideId: string; src: string }>) => {
      const { slideId, src } = action.payload;
      if (!state.slides[slideId]) {
        state.slides[slideId] = { objects: [] };
      }
      const imageObject = createDefaultImageObjectWithId(generateId(), src);
      state.slides[slideId].objects.push(imageObject);
    },
    
    changeObjectPosition: (state, action: PayloadAction<{ slideId: string; objectId: string; x: number; y: number }>) => {
      const { slideId, objectId, x, y } = action.payload;
      if (state.slides[slideId]) {
        const object = state.slides[slideId].objects.find(obj => obj.id === objectId);
        if (object) {
          object.x = x;
          object.y = y;
        }
      }
    },
    
    changeObjectSize: (state, action: PayloadAction<{ slideId: string; objectId: string; width: number; height: number; x: number; y: number }>) => {
      const { slideId, objectId, width, height, x, y } = action.payload;
      if (state.slides[slideId]) {
        const object = state.slides[slideId].objects.find(obj => obj.id === objectId);
        if (object) {
          object.w = width;
          object.h = height;
          object.x = x;
          object.y = y;
        }
      }
    },
  },
});

export const { 
  addObjectToSlide,
  removeObjectFromSlide,
  addTextObject,
  addImageObject,
  changeObjectPosition,
  changeObjectSize
} = objectsSlice.actions;
export default objectsSlice.reducer;