import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Slides, Slide, Background } from '../types/types_of_presentation';

const initialState: Slides = {
  slides: [],
  currentSlideId: null,
};

function generateId(): string {
  return crypto.randomUUID();
}

export const slidesSlice = createSlice({
  name: 'slides',
  initialState,
  reducers: {
    addSlide: (state) => {
      const newSlide: Slide = {
        id: generateId(),
        background: { type: 'color', color: '#ffffff' },
        objectIds: []
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
    
    removeObjectIdFromSlide: (state, action: PayloadAction<{ slideId: string; objectId: string }>) => {
      const { slideId, objectId } = action.payload;
      const slide = state.slides.find(slide => slide.id === slideId);
      if (slide) {
        slide.objectIds = slide.objectIds.filter(id => id !== objectId);
      }
    },
    
    setCurrentSlide: (state, action: PayloadAction<string>) => {
      state.currentSlideId = action.payload;
    }
  },
});

export const { 
  addSlide, 
  removeSlide, 
  changeSlideBackground, 
  reorderSlides,
  removeObjectIdFromSlide,
  setCurrentSlide
} = slidesSlice.actions;
export default slidesSlice.reducer;