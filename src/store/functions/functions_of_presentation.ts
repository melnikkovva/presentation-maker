import type { Presentation, Slide, TextObject, ImageObject, Background } from "../types/types_of_presentation.js";

export function generateId(): string {
    return crypto.randomUUID();
}

export function renamePresentation(presentation: Presentation, newTitle: string): Presentation {
    return {
        ...presentation,
        title: newTitle
    };
}

export function addSlide(presentation: Presentation): Presentation {
    const newSlide: Slide = {
        id: generateId(), 
        slideObjects: [], 
        background: { type: 'color', color: '#ffffff' }
    };

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: [...presentation.slides.slides, newSlide],
            currentSlideId: newSlide.id
        }
    };
}

export function removeSlide(presentation: Presentation, slideId: string): Presentation {
    const newSlides = presentation.slides.slides.filter(slide => slide.id !== slideId);
    
    let newCurrentSlideId = presentation.slides.currentSlideId;
    if (presentation.slides.currentSlideId === slideId) {
        newCurrentSlideId = newSlides.length > 0 ? newSlides[0].id : null;
    }

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: newSlides,
            currentSlideId: newCurrentSlideId
        }
    };
}

export function selectSlide(presentation: Presentation, slideId: string): Presentation {
    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            currentSlideId: slideId
        }
    };
}

export function selectObject(presentation: Presentation, payload: {slideId: string, objectId: string, typeElement: 'text' | 'image'}): Presentation {
    return {
        ...presentation,
        selection: {
            slideId: payload.slideId,
            objectId: payload.objectId,
            typeElement: payload.typeElement
        }
    };
}

export function resetObjectSelection(presentation: Presentation): Presentation {
    return {
        ...presentation, 
        selection: null
    }
}

export function changeCurrentSlide(presentation: Presentation, slideId: string): Presentation {
    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            currentSlideId: slideId
        }
    };
}

export function addTextToSlide(presentation: Presentation, payload: {slideId: string, text: string}): Presentation {
    const { slideId, text } = payload;
    
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        const newText: TextObject = {
            id: generateId(),
            type: "text",
            x: 80,
            y: 50,
            w: 200,
            h: 100,
            text: text,
            fontSize: 16,
            fontFamily: "Arial",
            fontWeight: "normal",
            textDecoration: "none",
            textAlign: "left",
            color: "#000000",
            shadow: null
        };

        return {
            ...slide,
            slideObjects: [...slide.slideObjects, newText]
        };
    });

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        }
    };
}

export function addImageToSlide(presentation: Presentation, payload: {slideId: string, imageSrc: string}): Presentation {
    const { slideId, imageSrc } = payload;
    
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        const newImage: ImageObject = {
            id: generateId(),
            type: "image",
            x: 20,
            y: 20,
            w: 60,
            h: 60,
            src: imageSrc
        };

        return {
            ...slide,
            slideObjects: [...slide.slideObjects, newImage]
        };
    });

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        }
    };
}

export function removeObject(presentation: Presentation, payload: {slideId: string, objectId: string}): Presentation {
    const { slideId, objectId } = payload;
    
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        return {
            ...slide,
            slideObjects: slide.slideObjects.filter(obj => obj.id !== objectId)
        };
    });

    let newSelection = presentation.selection;
    if (presentation.selection?.objectId === objectId && presentation.selection?.slideId === slideId) {
        newSelection = null;
    }

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        },
        selection: newSelection
    };
}

export function changeObjectText(presentation: Presentation, slideId: string, objectId: string, newText: string): Presentation {
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        return {
            ...slide,
            slideObjects: slide.slideObjects.map(obj => {
                if (obj.id === objectId && obj.type === "text") {
                    return { ...obj, text: newText };
                }
                return obj;
            })
        };
    });

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        }
    };
}

export function changeObjectPosition(presentation: Presentation, slideId: string, objectId: string, x: number, y: number): Presentation {
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        return {
            ...slide,
            slideObjects: slide.slideObjects.map(obj => {
                if (obj.id === objectId) {
                    return { ...obj, x: x, y: y };
                }
                return obj;
            })
        };
    });

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        }
    };
}

export function changeObjectSize(presentation: Presentation, slideId: string, objectId: string, width: number, height: number): Presentation {
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        return {
            ...slide,
            slideObjects: slide.slideObjects.map(obj => {
                if (obj.id === objectId) {
                    return { ...obj, w: width, h: height };
                }
                return obj;
            })
        };
    });

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        }
    };
}

export function changeSlideBackground(presentation: Presentation, slideId: string, background: Background): Presentation {
    const slides = presentation.slides.slides.map(slide => {
        if (slide.id !== slideId) return slide;

        return {
            ...slide,
            background: background
        };
    });

    return {
        ...presentation,
        slides: {
            ...presentation.slides,
            slides: slides
        }
    };
}

export function createColorBackground(color: string): Background {
    return { type: 'color', color: color };
}

export function createImageBackground(src: string): Background {
    return { type: 'picture', src: src };
}
