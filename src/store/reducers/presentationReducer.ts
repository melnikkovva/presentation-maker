import { maximalPresentation } from '../data/tests_data';
import type { Presentation } from '../types/types_of_presentation';

const initialState: Presentation = maximalPresentation;

function generateId(): string {
    return crypto.randomUUID();
}

export function presentationReducer(state = initialState, action: any): Presentation {
    switch (action.type) {
        case 'RENAME_PRESENTATION':
            return {
                ...state,
                title: action.payload
            };

        case 'SELECT_SLIDE':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    currentSlideId: action.payload
                }
            };

        case 'ADD_SLIDE':
            const newSlide = {
                id: generateId(),
                background: { type: 'color' as const, color: '#ffffff' },
                slideObjects: []
            };
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: [...state.slides.slides, newSlide],
                    currentSlideId: newSlide.id
                }
            };

        case 'REMOVE_SLIDE':
            const filteredSlides = state.slides.slides.filter(slide => slide.id !== action.payload);
            const newCurrentSlideId = filteredSlides.length > 0 
                ? filteredSlides[0].id 
                : null;
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: filteredSlides,
                    currentSlideId: newCurrentSlideId
                }
            };

        case 'ADD_TEXT_TO_SLIDE':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: state.slides.slides.map(slide => 
                        slide.id === action.payload.slideId 
                            ? {
                                ...slide,
                                slideObjects: [
                                    ...slide.slideObjects,
                                    {
                                        id: generateId(),
                                        type: 'text',
                                        text: action.payload.text,
                                        fontSize: 16,
                                        fontFamily: "Arial",
                                        fontWeight: "normal",
                                        textDecoration: "none",
                                        textAlign: "left",
                                        color: "#000000",
                                        shadow: null,
                                        x: 80,
                                        y: 50,
                                        w: 200,
                                        h: 100
                                    }
                                ]
                            }
                            : slide
                    )
                }
            };

        case 'ADD_IMAGE_TO_SLIDE':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: state.slides.slides.map(slide => 
                        slide.id === action.payload.slideId 
                            ? {
                                ...slide,
                                slideObjects: [
                                    ...slide.slideObjects,
                                    {
                                        id: generateId(),
                                        type: 'image',
                                        src: action.payload.imageSrc,
                                        x: 20,
                                        y: 20,
                                        w: 60,
                                        h: 60
                                    }
                                ]
                            }
                            : slide
                    )
                }
            };

        case 'REMOVE_OBJECT':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: state.slides.slides.map(slide => 
                        slide.id === action.payload.slideId 
                            ? {
                                ...slide,
                                slideObjects: slide.slideObjects.filter(obj => obj.id !== action.payload.objectId)
                            }
                            : slide
                    )
                },
                selection: state.selection?.objectId === action.payload.objectId 
                    ? null 
                    : state.selection
            };

        case 'CHANGE_OBJECT_POSITION':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: state.slides.slides.map(slide => 
                        slide.id === action.payload.slideId 
                            ? {
                                ...slide,
                                slideObjects: slide.slideObjects.map(obj => 
                                    obj.id === action.payload.objectId 
                                        ? { ...obj, x: action.payload.x, y: action.payload.y }
                                        : obj
                                )
                            }
                            : slide
                    )
                }
            };

        case 'CHANGE_OBJECT_SIZE':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: state.slides.slides.map(slide => 
                        slide.id === action.payload.slideId 
                            ? {
                                ...slide,
                                slideObjects: slide.slideObjects.map(obj => 
                                    obj.id === action.payload.objectId 
                                        ? { 
                                            ...obj, 
                                            w: Math.round(action.payload.width),
                                            h: Math.round(action.payload.height),
                                            x: Math.round(action.payload.x),
                                            y: Math.round(action.payload.y)
                                        }
                                        : obj
                                )
                            }
                            : slide
                    )
                }
            };

        case 'SELECT_OBJECT':
            return {
                ...state,
                selection: action.payload ? { 
                    slideId: state.slides.currentSlideId || '',
                    objectId: action.payload,
                    typeElement: 'none'
                } : null
            };

        case 'CHANGE_SLIDE_BACKGROUND':
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: state.slides.slides.map(slide => 
                        slide.id === action.payload.slideId 
                            ? { ...slide, background: action.payload.background }
                            : slide
                    )
                }
            };

        case 'REORDER_SLIDES': {
            const { fromIndex, toIndex } = action.payload;
            const newSlides = [...state.slides.slides];
            const [movedSlide] = newSlides.splice(fromIndex, 1);
            newSlides.splice(toIndex, 0, movedSlide);
            return {
                ...state,
                slides: {
                    ...state.slides,
                    slides: newSlides
                }
            };
        }

        default:
            return state;
    }
    
}