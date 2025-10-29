export type Presentation = {
    id: string;
    title: string;
    slides: Slides;
    selection: Selection | null;
}

export type Slide = {
    id: string;
    slideObjects: Array<SlideObject>;
    background: Background;
}

export type SlideObject = TextObject | ImageObject

export type Background = Color | Picture

export type Color = {
    type: 'color';
    color: string
}

export type Picture = {
    type: 'picture';
    src: string;
}

export type Slides = {
    slides: Slide[];
    currentSlideId: string | null;
}

export type Selection = {
    slideId: string;
    objectId: string;
    typeElement: 'text' | 'image' |'none';
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
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  shadow: TextShadow | null;
}

export type ImageObject = BaseSlideObject & {
    type: 'image';
    src: string;
}

type BaseSlideObject = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export type ModalType = 'imageUrl' | 'backgroundUrl' | 'color' | null;
