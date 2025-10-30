import type { Background, TextDecoration, TextAlign } from "../types/types_of_presentation";
export const TEXT_OBJECT_DEFAULTS = {
    WIDTH: 200,
    HEIGHT: 100,
    FONT_SIZE: 14,
    FONT_FAMILY: "Gill Sans",
    FONT_WEIGHT: "400",
    TEXT_DECORATION: "none" as TextDecoration, 
    TEXT_ALIGN: "left" as TextAlign, 
    COLOR: "#000000",
    SHADOW: {
        COLOR: "#000000",
        BLUR: 0
    }
};

export const IMAGE_OBJECT_DEFAULTS = {
    WIDTH: 300,
    HEIGHT: 200
};

export const DEFAULT_BACKGROUND: Background = { 
    type: 'color', 
    color: "#ffffff" 
};

export const DEFAULT_POSITIONS = {
    X: 100,
    Y: 100
};

export const SLIDE_WIDTH = 1000; 
export const SLIDE_HEIGHT = 550; 
export const PREVIEW_SCALE = 0.2; 
export const DEFAULT_PADDING_TEXT_FIELD = 8;
export const MIN_DIV_WIDTH = 20;
export const MIN_DIV_HEIGHT = 20;