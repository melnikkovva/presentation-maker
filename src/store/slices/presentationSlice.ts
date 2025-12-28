import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppState, Presentation } from '../types/types_of_presentation';
import { initialState } from '../presentationReducer';
import { type SlideObject } from '../types/types_of_presentation';

export const buildStateFromPresentation = (presentation: Presentation): AppState => {
  const slides = presentation.slides.map(slide => ({
    id: slide.id,
    background: slide.background,
    objectIds: slide.elements.map(e => e.id),
  }));

  const objects = presentation.slides.flatMap(s =>
    s.elements.map(el => ({
      ...el,
      slideId: s.id, 
    }) as SlideObject)
  );

  return {
    id: presentation.id,
    email: presentation.email,
    title: presentation.title,
    slides: {
      slides,
      currentSlideId: slides[0]?.id || 'slide-1',
    },
    selection: [],
    objects: { objects },
  };
};

const metaSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    setLoadedPresentation: (_, action: PayloadAction<Presentation>) => {
      return buildStateFromPresentation(action.payload);
    },
    resetPresentation: () => initialState,
  },
});

export const { setLoadedPresentation, resetPresentation } = metaSlice.actions;
export default metaSlice.reducer;