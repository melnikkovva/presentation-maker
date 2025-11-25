import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Objects, TextObject, ImageObject } from '../types/types_of_presentation';
import {DEFAULT_POSITIONS_X, DEFAULT_TEXT_COLOR, DEFAULT_TEXT_ALIGN, DEFAULT_TEXT_DECORATION, DEFAULT_TEXT_FW, DEFAULT_POSITIONS_Y, DEFAULT_TEXT_WIDTH, DEFAULT_IMAGE_WIDTH, DEFAULT_TEXT_HEIGHT, DEFAULT_IMAGE_HEIGHT, DEFAULT_TEXT_FS, DEFAULT_TEXT_FF} from '../data/const_for_presantation'

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
  x: DEFAULT_POSITIONS_X,
  y: DEFAULT_POSITIONS_Y,
  w: DEFAULT_TEXT_WIDTH,
  h: DEFAULT_TEXT_HEIGHT,
  text: text || 'Новый текст',
  fontSize: DEFAULT_TEXT_FS,
  fontFamily: DEFAULT_TEXT_FF,
  fontWeight: DEFAULT_TEXT_FW,
  textDecoration: DEFAULT_TEXT_DECORATION,
  textAlign: DEFAULT_TEXT_ALIGN,
  color: DEFAULT_TEXT_COLOR,
  shadow: null,
});

const createDefaultImageObject = (slideId: string, src: string): ImageObject => ({
  type: 'image',
  id: generateId(),
  slideId: slideId,
  x: DEFAULT_POSITIONS_X,
  y: DEFAULT_POSITIONS_Y,
  w: DEFAULT_IMAGE_WIDTH,
  h: DEFAULT_IMAGE_HEIGHT,
  src: src,
});

export const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    
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

    changeMultipleObjectsPosition: (state, action: PayloadAction<{
      primaryObjectId: string;
      primaryNewX: number;
      primaryNewY: number;
      otherObjects: Array<{
        objectId: string;
        deltaX: number;
        deltaY: number;
      }>;
    }>) => {
      const { primaryObjectId, primaryNewX, primaryNewY, otherObjects } = action.payload;
      
      const primaryObject = state.objects.find(obj => obj.id === primaryObjectId);
      if (primaryObject) {
        primaryObject.x = primaryNewX;
        primaryObject.y = primaryNewY;
      }
      
      otherObjects.forEach(({ objectId, deltaX, deltaY }) => {
        const object = state.objects.find(obj => obj.id === objectId);
        if (object) {
          object.x += deltaX;
          object.y += deltaY;
        }
      });
    },
    
    removeObjectsBySlideId: (state, action: PayloadAction<string>) => {
      const slideId = action.payload;
      state.objects = state.objects.filter(obj => obj.slideId !== slideId);
    },

    removeMultipleObjects: (state, action: PayloadAction<string[]>) => {
      const objectIdsToRemove = action.payload;
      state.objects = state.objects.filter(obj => !objectIdsToRemove.includes(obj.id));
    },
  },
  
});

export const { 
  removeObject,
  addTextObject,
  addImageObject,
  changeObjectPosition,
  changeObjectSize,
  removeObjectsBySlideId,
  changeMultipleObjectsPosition,
  removeMultipleObjects
} = objectsSlice.actions;
export default objectsSlice.reducer;