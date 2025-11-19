import type { RootState } from '../index';

export const selectPresentation = (state: RootState) => state.presentation;
export const selectSlidesState = (state: RootState) => state.slides;
export const selectSelectionState = (state: RootState) => state.selection;
export const selectObjectsState = (state: RootState) => state.objects; 

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
  return state.selection?.objectId || null;
}

export const selectSelectedSlideId = (state: RootState) => {
  return state.selection?.slideId || null;
}

export const selectSelectedTypeElement = (state: RootState) => {
  return state.selection?.typeElement || null;
}

export const selectObjectsInCurrentSlide = (state: RootState) => {
  const currentSlideId = selectCurrentSlideId(state);
  if (!currentSlideId) return [];
  
  const objectsInSlide = state.objects.slides[currentSlideId];
  return objectsInSlide ? objectsInSlide.objects : [];
};

export const selectSelectedObjectInCurrentSlide = (state: RootState) => {
  const selectedObjectId = selectSelectedObjectId(state);
  const objects = selectObjectsInCurrentSlide(state);
  return objects.find(obj => obj.id === selectedObjectId) || null;
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
  return state.slides.slides.length;
} 

export const selectTextObjectById = (objectId: string) => (state: RootState) => {
  const slides = state.objects.slides;
  
  for (const slideId in slides) {
    const slide = slides[slideId];
    const foundObject = slide.objects.find(obj => obj.id === objectId); 
    if (foundObject && foundObject.type === 'text') {
      return foundObject;
    }
  }
  return null;
};

export const selectImageObjectById = (objectId: string) => (state: RootState) => {
  const slides = state.objects.slides;
  
  for (const slideId in slides) {
    const slide = slides[slideId];
    const foundObject = slide.objects.find(obj => obj.id === objectId);
    if (foundObject && foundObject.type === 'image') {
      return foundObject;
    }
  }
  return null;
};