import type { RootState } from '../index';

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

export const selectCurrentSlideObjects = (state: RootState) => {
  const currentSlideId = selectCurrentSlideId(state);
  const objects = selectAllObjects(state);
  
  if (!currentSlideId) return [];
  return objects.filter(obj => obj.slideId === currentSlideId);
};

export const selectObjectById = (objectId: string) => (state: RootState) => {
  const objects = selectAllObjects(state);
  return objects.find(obj => obj.id === objectId) || null;
};

export const selectSelectedSlideId = (state: RootState) => state.selection?.slideId || null;
export const selectSelectedObjectId = (state: RootState) => state.selection?.objectId || null;
export const selectSelectedObjectType = (state: RootState) => state.selection?.typeElement || 'none';

export const selectSelectedObject = (state: RootState) => {
  const selection = selectSelection(state);
  const objects = selectAllObjects(state);
  
  if (!selection?.objectId) return null;
  return objects.find(obj => obj.id === selection.objectId) || null;
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

export const selectSlideObjects = (slideId: string) => (state: RootState) => {
  const slide = selectSlideById(slideId)(state);
  const objects = selectAllObjects(state);
  
  if (!slide) return [];
  return objects.filter(obj => obj.slideId === slideId);
};

export const selectSlideObjectCount = (slideId: string) => (state: RootState) => {
  const objects = selectObjectsBySlideId(slideId)(state);
  return objects.length;
};

export const selectImageObjectsBySlideId = (slideId: string) => (state: RootState) => {
  const objects = selectObjectsBySlideId(slideId)(state);
  return objects.filter(obj => obj.type === 'image');
};

export const selectTextObjectsBySlideId = (slideId: string) => (state: RootState) => {
  const objects = selectObjectsBySlideId(slideId)(state);
  return objects.filter(obj => obj.type === 'text');
};

export const selectSlideObjectIds = (slideId: string) => (state: RootState) => {
  const slide = selectSlideById(slideId)(state);
  return slide?.objectIds || [];
};

export const selectCurrentSlideObjectIds = (state: RootState) => {
  const currentSlide = selectCurrentSlide(state);
  return currentSlide?.objectIds || [];
};