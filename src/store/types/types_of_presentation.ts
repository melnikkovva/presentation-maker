export type Presentation = {
  id: string;
  title: string;
  email: string;
  slides: Array<{
    id: string;
    background: Background;
    elements: StoredElement[]; 
  }>;
};

export type Slides = {
  slides: Array<Slide>;
  currentSlideId: string | null;
}

export type Slide = {
  id: string;
  objectIds: string[]; 
  background: Background;
}

export type Objects = {
  objects: Array<SlideObject>;
}

export type SlideObject = TextObject | ImageObject;

export type Background = Color | Picture;

export type Color = {
  type: 'color';
  color: string;
}

export type Picture = {
  type: 'image';
  src: string;
}

export type TextDecoration = 'underline' | 'line-through' | 'none';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextShadow = {
  x: number;
  y: number;
  blur: number;
  color: string;
}

export type TextObject = BaseSlideObject & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textDecoration: string;
  textAlign: TextAlign;
  color: string;
  shadow: TextShadow | null;
  slideId: string; 
}

export type ImageObject = BaseSlideObject & {
  type: 'image';
  src: string;
  slideId: string; 
}

export type StoredTextElement = Omit<TextObject, 'slideId'>;
export type StoredImageElement = Omit<ImageObject, 'slideId'>;
export type StoredElement = StoredTextElement | StoredImageElement;

type BaseSlideObject = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type AppState = {
  id: string;
  email: string;
  title: string;
  slides: Slides;
  selection: Selection;
  objects: Objects;
};

export type BaseSelectionItem = {
  slideId: string;
  objectId: string;
}

export type ObjectSelectionItem = BaseSelectionItem & {
  typeElement: 'text' | 'image';
}

export type SlideSelectionItem = BaseSelectionItem & {
  objectId: ''; 
  typeElement: 'none';
}

export type SelectionItem = ObjectSelectionItem | SlideSelectionItem;

export type Selection = SelectionItem[];