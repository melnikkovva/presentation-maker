import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Slides, Slide, Background, SlideObject, TextObject, ImageObject } from '../types/types_of_presentation';

const initialState: Slides = {
  slides: [],
  currentSlideId: null,
};

function generateId(): string {
  return crypto.randomUUID();
}

const createDefaultTextObject = (): Omit<TextObject, 'id'> => ({
  type: 'text',
  x: 100,
  y: 100,
  w: 200,
  h: 50,
  text: 'Новый текст',
  fontSize: 16,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  textDecoration: 'none',
  textAlign: 'left',
  color: '#000000',
  shadow: null,
});

const createDefaultImageObject = (src: string): Omit<ImageObject, 'id'> => ({
  type: 'image',
  x: 100,
  y: 100,
  w: 200,
  h: 150,
  src,
});

export const slidesSlice = createSlice({
  name: 'slides',
  initialState,
  reducers: {
    selectSlide: (state, action: PayloadAction<string>) => {
      state.currentSlideId = action.payload;
    },
    
    addSlide: (state) => {
      const newSlide: Slide = {
        id: generateId(),
        background: { type: 'color', color: '#ffffff' },
        slideObjects: []
      };
      state.slides.push(newSlide);
      state.currentSlideId = newSlide.id;
    },
    
    removeSlide: (state, action: PayloadAction<string>) => {
      const slideId = action.payload;
      state.slides = state.slides.filter(slide => slide.id !== slideId);
      
      if (state.currentSlideId === slideId) {
        state.currentSlideId = state.slides[0]?.id || null;
      }
    },
    
    changeSlideBackground: (state, action: PayloadAction<{ slideId: string; background: Background }>) => {
      const { slideId, background } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        slide.background = background;
      }
    },
    
    reorderSlides: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedSlide] = state.slides.splice(fromIndex, 1);
      state.slides.splice(toIndex, 0, movedSlide);
    },
    
    addObjectToSlide: (state, action: PayloadAction<{ slideId: string; object: SlideObject }>) => {
      const { slideId, object } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        slide.slideObjects.push(object);
      }
    },
    
    removeObjectFromSlide: (state, action: PayloadAction<{ slideId: string; objectId: string }>) => {
      const { slideId, objectId } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        slide.slideObjects = slide.slideObjects.filter(obj => obj.id !== objectId);
      }
    },
    
    updateObjectInSlide: (state, action: PayloadAction<{ slideId: string; objectId: string; updates: Partial<SlideObject> }>) => {
      const { slideId, objectId, updates } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        const object = slide.slideObjects.find(obj => obj.id === objectId);
        if (object) {
          Object.assign(object, updates);
        }
      }
    },
    
    addTextObject: (state, action: PayloadAction<{ slideId: string; text?: string }>) => {
      const { slideId, text = 'Новый текст' } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        const textObject: TextObject = {
          ...createDefaultTextObject(),
          id: generateId(),
          text: text.trim() || 'Новый текст', 
        };
        slide.slideObjects.push(textObject);
      }
    },
    
    addImageObject: (state, action: PayloadAction<{ slideId: string; src: string }>) => {
      const { slideId, src } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        const imageObject: ImageObject = {
          ...createDefaultImageObject(src),
          id: generateId(),
        };
        slide.slideObjects.push(imageObject);
      }
    },
    
    changeObjectPosition: (state, action: PayloadAction<{ slideId: string; objectId: string; x: number; y: number }>) => {
      const { slideId, objectId, x, y } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        const object = slide.slideObjects.find(obj => obj.id === objectId);
        if (object) {
          object.x = x;
          object.y = y;
        }
      }
    },
    
    changeObjectSize: (state, action: PayloadAction<{ slideId: string; objectId: string; width: number; height: number; x: number; y: number }>) => {
      const { slideId, objectId, width, height, x, y } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        const object = slide.slideObjects.find(obj => obj.id === objectId);
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
  selectSlide, 
  addSlide, 
  removeSlide, 
  changeSlideBackground, 
  reorderSlides,
  addObjectToSlide,
  removeObjectFromSlide,
  updateObjectInSlide,
  addTextObject,
  addImageObject,
  changeObjectPosition,
  changeObjectSize
} = slidesSlice.actions;
export default slidesSlice.reducer;