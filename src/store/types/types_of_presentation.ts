export type Presentation = {
  id: string;
  title: string;
}

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
  type: 'picture';
  src: string;
}

export type Selection = {
  slideId: string;
  objectId: string;
  typeElement: 'text' | 'image' | 'none';
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

type BaseSlideObject = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export type ModalType = 'imageUrl' | 'backgroundUrl' | 'color' | null;