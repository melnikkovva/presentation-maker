import type { Background } from '../types/types_of_presentation';

export const renamePresentation = (title: string) => ({
    type: 'RENAME_PRESENTATION' as const,
    payload: title
});

export const selectSlide = (slideId: string) => ({
    type: 'SELECT_SLIDE' as const,
    payload: slideId
});

export const addSlide = () => ({
    type: 'ADD_SLIDE' as const
});

export const removeSlide = (slideId: string) => ({
    type: 'REMOVE_SLIDE' as const,
    payload: slideId
});

export const addTextToSlide = (slideId: string, text: string) => ({
    type: 'ADD_TEXT_TO_SLIDE' as const,
    payload: { slideId, text }
});

export const addImageToSlide = (slideId: string, imageSrc: string) => ({
    type: 'ADD_IMAGE_TO_SLIDE' as const,
    payload: { slideId, imageSrc }
});

export const removeObject = (slideId: string, objectId: string) => ({
    type: 'REMOVE_OBJECT' as const,
    payload: { slideId, objectId }
});

export const changeObjectPosition = (slideId: string, objectId: string, x: number, y: number) => ({
    type: 'CHANGE_OBJECT_POSITION' as const,
    payload: { slideId, objectId, x, y }
});

export const changeObjectSize = (slideId: string, objectId: string, width: number, height: number, x: number, y: number) => ({
    type: 'CHANGE_OBJECT_SIZE' as const,
    payload: { slideId, objectId, width, height, x, y }
});

export const selectObject = (objectId: string | null) => ({
    type: 'SELECT_OBJECT' as const,
    payload: objectId
});

export const changeSlideBackground = (slideId: string, background: Background) => ({
    type: 'CHANGE_SLIDE_BACKGROUND',
    payload: { slideId, background }
});

export const resetObjectSelection = () => ({
    type: 'SELECT_OBJECT' as const,
    payload: null
});

export const changeSlidePosition = (slideId: string, x: number, y: number) => ({
    type: 'CHANGE_SLIDE_POSITION' as const,
    payload: { slideId, x, y }
});

export const reorderSlides = (fromIndex: number, toIndex: number) => ({
    type: 'REORDER_SLIDES' as const,
    payload: { fromIndex, toIndex }
});