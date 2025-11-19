import { maximalPresentation } from './data/tests_data';

export const initialPresentation = maximalPresentation;

export const presentationInitialState = {
    title: maximalPresentation.title,
};

export const slidesInitialState = {
    slides: maximalPresentation.slides.slides,
    currentSlideId: maximalPresentation.slides.currentSlideId,
};

export const objectsInitialState = {
    selection: maximalPresentation.selection,
};