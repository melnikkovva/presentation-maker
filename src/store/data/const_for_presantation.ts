import type { Background } from "../types/types_of_presentation";
export const TEXT_OBJECT_DEFAULTS = {
    WIDTH: 200,
    HEIGHT: 100,
    FONT_SIZE: 14,
    FONT_FAMILY: "Gill Sans",
    FONT_WEIGHT: "400",
    TEXT_DECORATION: "none", 
    TEXT_ALIGN: "left", 
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
export const PLAYER_RATIO = 1.4
export const SLIDE_WIDTH_PLAYER = SLIDE_WIDTH * PLAYER_RATIO;
export const SLIDE_HEIGHT_PLAYER = SLIDE_HEIGHT * PLAYER_RATIO;
export const PREVIEW_SCALE = 0.2; 
export const DEFAULT_PADDING_TEXT_FIELD = 8;
export const MIN_DIV_WIDTH = 20;
export const MIN_DIV_HEIGHT = 20;
export const DEFAULT_POSITIONS_X = 100;
export const DEFAULT_POSITIONS_Y = 100;
export const DEFAULT_TEXT_WIDTH = 200;
export const DEFAULT_TEXT_HEIGHT = 70;
export const DEFAULT_IMAGE_WIDTH = 200;
export const DEFAULT_IMAGE_HEIGHT = 200;
export const DEFAULT_TEXT_FS = 16;
export const DEFAULT_TEXT_FF = 'Arial';
export const DEFAULT_TEXT_FW = 'normal';
export const DEFAULT_TEXT_DECORATION = 'none';
export const DEFAULT_TEXT_ALIGN = 'left';
export const DEFAULT_TEXT_COLOR = '#000000';

export const ProjectID = "692dbe320031c967bff0";
export const Endpoint = "https://nyc.cloud.appwrite.io/v1";
export const DatabaseID = "69387db6001ee21b8f1e";
export const TabelID = "presentations";
export const StoreID = "69387f7b00394722115a";

export const ROUTES = {
  HOME: '/home',
  EDITOR: '/editor',
  PLAYER: '/player',
  GALLERY: '/gallery',
  LOGIN: '/login',
  REGISTER: '/register',
  ROOT: '/'
} as const;