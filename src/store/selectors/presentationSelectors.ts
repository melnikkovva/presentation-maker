import type { RootState } from '../index';

export const selectPresentation = (state: RootState) => state.presentation;
export const selectSlidesState = (state: RootState) => state.slides;
export const selectSelectionState = (state: RootState) => state.selection;

export const selectTitle = (state: RootState) => {
  return state.presentation.title;
};

export const selectSlides = (state: RootState) => {
  return state.slides.slides;
};

export const selectCurrentSlideId = (state: RootState) => {
  return state.slides.currentSlideId;
};

export const selectCurrentSlide = (state: RootState) => {
  const slides = selectSlides(state);
  const currentSlideId = selectCurrentSlideId(state);
  return slides.find(slide => slide.id === currentSlideId);
};

export const selectSelection = (state: RootState) => {
  return state.selection;
};

export const selectSelectedObjectId = (state: RootState) => {
  return state.selection?.objectId || null
}

export const selectSelectedSlideId = (state: RootState) => {
  return state.selection?.slideId || null
}

export const selectSelectedTypeElement = (state: RootState) => {
  return state.selection?.typeElement || null
}

export const selectObjectsInCurrentSlide = (state: RootState) => {
  const currentSlide = selectCurrentSlide(state);
  return currentSlide?.slideObjects || [];
};

export const selectSelectedObjectInCurrentSlide = (state: RootState) => {
  const currentSlide = selectCurrentSlide(state);
  const selectedObjectId = selectSelectedObjectId(state);
  return currentSlide?.slideObjects.find(obj => obj.id === selectedObjectId) || null;
};

export const selectIsObjectSelected = (objectId: string) => (state: RootState) => {
  const selectedObjectId = selectSelectedObjectId(state);
  return selectedObjectId === objectId;
};

export const selectIsSlideSelected = (slideId: string) => (state: RootState) => {
  const currentSlideId = selectCurrentSlideId(state);
  return currentSlideId === slideId;
};

export const selectSlidesCount = (state: RootState) => {
  return state.slides.slides.length
} 
