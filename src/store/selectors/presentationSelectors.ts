import type { RootState } from '../store';
import type { AppState } from '../types/types_of_presentation';

export const selectTitle = (state: RootState) => state.present.title;
export const selectSlidesState = (state: RootState) => state.present.slides;
export const selectObjectsState = (state: RootState) => state.present.objects;
export const selectSelection = (state: RootState) => state.present.selection;

export const selectPresentationTitle = (state: RootState) => state.present.title;

export const selectSlides = (state: RootState) => state.present.slides.slides;
export const selectCurrentSlideId = (state: RootState) => state.present.slides.currentSlideId;

export const selectCurrentSlide = (state: RootState) => {
  const slides = selectSlides(state);
  const currentSlideId = selectCurrentSlideId(state);
  return slides.find(slide => slide.id === currentSlideId) || null;
};

export const selectSlideById = (slideId: string) => (state: RootState) => {
  const slides = selectSlides(state);
  return slides.find(slide => slide.id === slideId) || null;
};

export const selectAllObjects = (state: RootState) => state.present.objects.objects;

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

export const selectSelectedObjects = (state: RootState) => state.present.selection;

export const isObjectSelected = (state: RootState, objectId: string) => 
  state.present.selection.some(item => item.objectId === objectId);

export const selectSelectedObjectIds = (state: RootState) => 
  state.present.selection.map(item => item.objectId);

export const selectAppState = (state: RootState): AppState => ({
  title: state.present.title,
  slides: state.present.slides,
  selection: state.present.selection,
  objects: state.present.objects,
});

export const selectPastLength = (state: RootState) => state.past.length;
export const selectFutureLength = (state: RootState) => state.future.length;