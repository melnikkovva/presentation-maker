import type { RootState } from '../store';

export const selectTitle = (state: RootState) => state.title;
export const selectSlidesState = (state: RootState) => state.slides;
export const selectObjectsState = (state: RootState) => state.objects;
export const selectSelection = (state: RootState) => state.selection;

export const selectPresentationTitle = (state: RootState) => state.title;

export const selectSlides = (state: RootState) => state.slides.slides;
export const selectCurrentSlideId = (state: RootState) => state.slides.currentSlideId;

export const selectCurrentSlide = (state: RootState) => {
  const slides = selectSlides(state);
  const currentSlideId = selectCurrentSlideId(state);
  return slides.find(slide => slide.id === currentSlideId) || null;
};

export const selectSlideById = (slideId: string) => (state: RootState) => {
  const slides = selectSlides(state);
  return slides.find(slide => slide.id === slideId) || null;
};

export const selectAllObjects = (state: RootState) => state.objects.objects;

export const selectObjectsBySlideId = (slideId: string) => (state: RootState) => {
  const objects = selectAllObjects(state);
  return objects.filter(obj => obj.slideId === slideId);
};

export const selectImageObjectById = (objectId: string) => (state: RootState) => {
  const objects = selectAllObjects(state);
  const object = objects.find(obj => obj.id === objectId);
  return object && object.type === 'image' ? object : null;
};

export const selectTextObjectById = (objectId: string) => (state: RootState) => {
  const objects = selectAllObjects(state);
  const object = objects.find(obj => obj.id === objectId);
  return object && object.type === 'text' ? object : null;
};

export const selectSelectedObjects = (state: RootState) => state.selection;

export const isObjectSelected = (state: RootState, objectId: string) => 
  state.selection.some(item => item.objectId === objectId);

export const selectSelectedObjectIds = (state: RootState) => 
  state.selection.map(item => item.objectId);
