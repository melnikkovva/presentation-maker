import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectPresentation = (state: RootState) => state.presentation;
export const selectSlidesState = (state: RootState) => state.slides;
export const selectSelectionState = (state: RootState) => state.selection;

export const selectTitle = createSelector(
  [selectPresentation],
  (presentation) => presentation.title
);

export const selectSlides = createSelector(
  [selectSlidesState],
  (slidesState) => slidesState.slides
);

export const selectCurrentSlideId = createSelector(
  [selectSlidesState],
  (slidesState) => slidesState.currentSlideId
);

export const selectCurrentSlide = createSelector(
  [selectSlides, selectCurrentSlideId],
  (slides, currentSlideId) => slides.find(slide => slide.id === currentSlideId) || null
);

export const selectSelection = createSelector(
  [selectSelectionState],
  (selection) => selection
);

export const selectSelectedObjectId = createSelector(
  [selectSelection],
  (selection) => selection?.objectId || null
);

export const selectSelectedSlideId = createSelector(
  [selectSelection],
  (selection) => selection?.slideId || null
);

export const selectSelectedTypeElement = createSelector(
  [selectSelection],
  (selection) => selection?.typeElement || null
);

export const makeSelectObjectById = (objectId: string) => 
  createSelector(
    [selectSlides],
    (slides) => {
      for (const slide of slides) {
        const object = slide.slideObjects.find(obj => obj.id === objectId);
        if (object) return object;
      }
      return null;
    }
  );

export const makeSelectTextObjectById = (objectId: string) => 
  createSelector(
    [makeSelectObjectById(objectId)],
    (object) => object?.type === 'text' ? object : null
  );

export const makeSelectImageObjectById = (objectId: string) => 
  createSelector(
    [makeSelectObjectById(objectId)],
    (object) => object?.type === 'image' ? object : null
  );

export const selectObjectsInCurrentSlide = createSelector(
  [selectCurrentSlide],
  (currentSlide) => currentSlide?.slideObjects || []
);

export const selectSelectedObjectInCurrentSlide = createSelector(
  [selectCurrentSlide, selectSelectedObjectId],
  (currentSlide, selectedObjectId) => 
    currentSlide?.slideObjects.find(obj => obj.id === selectedObjectId) || null
);

export const selectIsObjectSelected = (objectId: string) => 
  createSelector(
    [selectSelectedObjectId],
    (selectedObjectId) => selectedObjectId === objectId
  );

export const selectIsSlideSelected = (slideId: string) => 
  createSelector(
    [selectCurrentSlideId],
    (currentSlideId) => currentSlideId === slideId
  );

export const selectSlidesCount = createSelector(
  [selectSlides],
  (slides) => slides.length
);

export const selectObjectsCountInCurrentSlide = createSelector(
  [selectObjectsInCurrentSlide],
  (objects) => objects.length
);