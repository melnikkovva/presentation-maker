import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Objects, SlideObject, TextObject, ImageObject } from '../types/types_of_presentation';

const initialState: Objects = {
  objects: []
};

function generateId(): string {
  return crypto.randomUUID();
}

const createDefaultTextObject = (slideId: string, text?: string): TextObject => ({
  type: 'text',
  id: generateId(),
  slideId: slideId,
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
});

const createDefaultImageObject = (slideId: string, src: string): ImageObject => ({
  type: 'image',
  id: generateId(),
  slideId: slideId,
  x: 100,
  y: 100,
  w: 200,
  h: 150,
  src: src,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    addObject: (state, action: PayloadAction<SlideObject>) => {
      state.objects.push(action.payload);
    },
    
    removeObject: (state, action: PayloadAction<string>) => {
      const objectId = action.payload;
      state.objects = state.objects.filter(obj => obj.id !== objectId);
    },
    
    addTextObject: (state, action: PayloadAction<{ slideId: string; text?: string }>) => {
      const { slideId, text } = action.payload;
      const textObject = createDefaultTextObject(slideId, text);
      state.objects.push(textObject);
    },
    
    addImageObject: (state, action: PayloadAction<{ slideId: string; src: string }>) => {
      const { slideId, src } = action.payload;
      const imageObject = createDefaultImageObject(slideId, src);
      state.objects.push(imageObject);
    },
    
    changeObjectPosition: (state, action: PayloadAction<{ objectId: string; x: number; y: number }>) => {
      const { objectId, x, y } = action.payload;
      const object = state.objects.find(obj => obj.id === objectId);
      if (object) {
        object.x = x;
        object.y = y;
      }
    },
    
    changeObjectSize: (state, action: PayloadAction<{ objectId: string; width: number; height: number }>) => {
      const { objectId, width, height } = action.payload;
      const object = state.objects.find(obj => obj.id === objectId);
      if (object) {
        object.w = width;
        object.h = height;
      }
    },
    
    moveObjectToSlide: (state, action: PayloadAction<{ objectId: string; newSlideId: string }>) => {
      const { objectId, newSlideId } = action.payload;
      const object = state.objects.find(obj => obj.id === objectId);
      if (object) {
        object.slideId = newSlideId;
      }
    },
    
    removeObjectsBySlideId: (state, action: PayloadAction<string>) => {
      const slideId = action.payload;
      state.objects = state.objects.filter(obj => obj.slideId !== slideId);
    }
  },
});

export const { 
  addObject,
  removeObject,
  addTextObject,
  addImageObject,
  changeObjectPosition,
  changeObjectSize,
  moveObjectToSlide,
  removeObjectsBySlideId
} = objectsSlice.actions;
export default objectsSlice.reducer;