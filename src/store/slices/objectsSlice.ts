import { type JSONContent } from '@tiptap/react';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { scaleToFitSlide } from '../functions/imageDownloader';
import type { Objects, TextObject, ImageObject } from '../types/types_of_presentation';
import {DEFAULT_POSITIONS_X, DEFAULT_TEXT_COLOR, DEFAULT_TEXT_ALIGN, DEFAULT_TEXT_DECORATION, DEFAULT_TEXT_FW, DEFAULT_POSITIONS_Y, DEFAULT_TEXT_WIDTH, DEFAULT_IMAGE_WIDTH, DEFAULT_TEXT_HEIGHT, DEFAULT_IMAGE_HEIGHT, DEFAULT_TEXT_FS, DEFAULT_TEXT_FF} from '../data/const_for_presantation'

const initialState: Objects = {
  objects: []
};

function generateId(): string {
  return crypto.randomUUID();
}

const createEmptyContent = (): JSONContent => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Новый текст'
        }
      ]
    }
  ]
});

type PositionUpdate = { objectId: string; x: number; y: number };
type TextContentUpdate = { objectId: string; content: JSONContent };

const createDefaultTextObject = (slideId: string, text?: string): TextObject => ({
  type: 'text',
  id: generateId(),
  slideId: slideId,
  x: DEFAULT_POSITIONS_X,
  y: DEFAULT_POSITIONS_Y,
  w: DEFAULT_TEXT_WIDTH,
  h: DEFAULT_TEXT_HEIGHT,
  content: text ? {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: text
          }
        ]
      }
    ]
  } : createEmptyContent(),
  fontStyle: 'normal',
  fontSize: DEFAULT_TEXT_FS,
  fontFamily: DEFAULT_TEXT_FF,
  fontWeight: DEFAULT_TEXT_FW,
  textDecoration: DEFAULT_TEXT_DECORATION,
  textAlign: DEFAULT_TEXT_ALIGN,
  color: DEFAULT_TEXT_COLOR,
  shadow: null,
});

const createDefaultImageObject = (
  slideId: string, 
  src: string, 
  originalWidth?: number, 
  originalHeight?: number
): ImageObject => {
  let width = DEFAULT_IMAGE_WIDTH;
  let height = DEFAULT_IMAGE_HEIGHT;
  
  if (originalWidth && originalHeight) {
    const scaled = scaleToFitSlide(originalWidth, originalHeight);
    width = scaled.width;
    height = scaled.height;
  }
  
  return {
    type: 'image',
    id: generateId(),
    slideId: slideId,
    x: DEFAULT_POSITIONS_X,
    y: DEFAULT_POSITIONS_Y,
    w: width,
    h: height,
    src: src,
  };
};

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
    
    addImageObject: (state, action: PayloadAction<{ slideId: string; src: string, width: number, height: number }>) => {
      const { slideId, src , width, height} = action.payload;
      const imageObject = createDefaultImageObject(slideId, src, width, height);
      state.objects.push(imageObject);
    },

    updateImageObjectDimensions: (
      state,
      action: PayloadAction<{
        id: string;
        width: number;
        height: number;
        originalWidth?: number;
        originalHeight?: number;
      }>
    ) => {
      const obj = state.objects.find(o => o.id === action.payload.id);
      if (obj && obj.type === 'image') {
        obj.w = action.payload.width;
        obj.h = action.payload.height;
      }
    },

    addImageObjectWithId: (
      state,
      action: PayloadAction<{ id: string; slideId: string; src: string }>
    ) => {
      const { id, slideId, src } = action.payload;

      state.objects.push({
        type: 'image',
        id,
        slideId,
        x: DEFAULT_POSITIONS_X,
        y: DEFAULT_POSITIONS_Y,
        w: DEFAULT_IMAGE_WIDTH,
        h: DEFAULT_IMAGE_HEIGHT,
        src,
      });
    },

    updateTextObjectStyles: (
      state,
      action: PayloadAction<{
        objectId: string;
        fontSize?: number;
        fontFamily?: string;
        color?: string;
        fontStyle?: 'normal' | 'italic';
        fontWeight?: 'normal' | 'bold';
        textAlign?: 'left' | 'center' | 'right';
        textDecoration?: string;
        shadow?: any;
      }>
    ) => {
      const obj = state.objects.find(o => o.id === action.payload.objectId);
      if (obj && obj.type === 'text') {
        const { fontSize, fontFamily, color, fontWeight, textAlign, textDecoration, shadow } = action.payload;
        if (fontSize !== undefined) obj.fontSize = fontSize;
        if (fontFamily !== undefined) obj.fontFamily = fontFamily;
        if (color !== undefined) obj.color = color;
        if (fontWeight !== undefined) obj.fontWeight = fontWeight;
        if (textAlign !== undefined) obj.textAlign = textAlign;
        if (textDecoration !== undefined) obj.textDecoration = textDecoration;
        if (shadow !== undefined) obj.shadow = shadow;
      }
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
    
    updateObjectPosition: (state, action: PayloadAction<{objectId: string, x: number, y: number}>) => {
      const object = state.objects.find(obj => obj.id === action.payload.objectId);
      if (object) {
        object.x = action.payload.x;
        object.y = action.payload.y;
      }
    },

    updateObjectsPositions: (state, action: PayloadAction<PositionUpdate[]>) => {
      const updates = action.payload;
      for (const { objectId, x, y } of updates) {
        const obj = state.objects.find(o => o.id === objectId);
        if (obj) {
          obj.x = x;
          obj.y = y;
        }
      }
    },

    updateObjectTextContent: (state, action: PayloadAction<TextContentUpdate>) => {
      const { objectId, content } = action.payload;
      const object = state.objects.find(obj => obj.id === objectId);
      if (object && object.type === 'text') {
        object.content = content;
      }
    },
    
    removeObjectsBySlideId: (state, action: PayloadAction<string>) => {
      const slideId = action.payload;
      state.objects = state.objects.filter(obj => obj.slideId !== slideId);
    },

    removeMultipleObjects: (state, action: PayloadAction<string[]>) => {
      const objectIdsToRemove = action.payload;
      state.objects = state.objects.filter(obj => !objectIdsToRemove.includes(obj.id));
    },
    
    setObjects: (state, action: PayloadAction<any[]>) => {
      state.objects = action.payload;
    },

    updateImageSrc: (
      state,
      action: PayloadAction<{ id: string; src: string }>
    ) => {
      const obj = state.objects.find(o => o.id === action.payload.id);
      if (obj && obj.type === 'image') {
        obj.src = action.payload.src;
      }
    },
    
    clearObjects: (state) => {
      state.objects = [];
    },
    
    resetObjects: (state) => {
      state.objects = [];
    }
  },
});

export const { 
  removeObject,
  addTextObject,
  addImageObject,
  changeObjectPosition,
  changeObjectSize,
  removeObjectsBySlideId,
  updateObjectPosition,
  updateObjectsPositions,
  updateObjectTextContent,
  updateTextObjectStyles,
  removeMultipleObjects,
  updateImageSrc,
  setObjects,
  clearObjects,
  addImageObjectWithId,
  updateImageObjectDimensions,
  resetObjects
} = objectsSlice.actions;
export default objectsSlice.reducer;