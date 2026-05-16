import type { RootState } from '../store';
import type { TextObject } from '../types/types_of_presentation';

export const selectTitle = (state: RootState) => state.present.title;
export const selectSlidesState = (state: RootState) => state.present.slides;
export const selectObjectsState = (state: RootState) => state.present.objects;
export const selectSelection = (state: RootState) => state.present.selection;
export const selectPresentationId = (state: RootState) => state.present.id;
export const selectUserEmail = (state: RootState) => state.present.email;

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

export const selectTextObjectById = (state: RootState, objectId: string): TextObject | null => {
  const object = state.present.objects.objects.find(obj => obj.id === objectId);
  return object && object.type === 'text' ? object as TextObject : null;
};

export const selectSelectedObjects = (state: RootState) => state.present.selection;

export const isObjectSelected = (state: RootState, objectId: string) => 
  state.present.selection.some(item => item.objectId === objectId);

export const selectSelectedObjectIds = (state: RootState) => 
  state.present.selection.map(item => item.objectId);

export const selectSelectedSlideId = (state: RootState) => {
  const slideSelection = state.present.selection.find(item => 
    item.slideId && !item.objectId
  );
  return slideSelection?.slideId || null;
};
