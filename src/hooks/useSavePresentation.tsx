import { useCallback } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectPresentationTitle, selectSlides, selectAllObjects, selectPresentationId } from '../store/selectors/presentationSelectors';
import { saveToDB } from '../store/functions_for_DB';
import type { Presentation } from '../store/types/types_of_presentation';

type Params = {
  email: string | null;
};

export function useSavePresentation({ email }: Params) {
  const title = useAppSelector(selectPresentationTitle);
  const slides = useAppSelector(selectSlides);
  const objects = useAppSelector(selectAllObjects);
  const currentId = useAppSelector(selectPresentationId);

  const buildPresentation = useCallback((): Presentation => {
    if (!email) throw new Error('Email is missing');

    return {
      id: currentId || crypto.randomUUID(),
      title: title || 'Без названия',
      email,
      slides: slides.map(slide => ({
        id: slide.id,
        background: slide.background,
        elements: objects
          .filter(obj => obj.slideId === slide.id)
          .map(obj =>
            obj.type === 'text'
              ? {
                  id: obj.id,
                  type: 'text',
                  x: obj.x,
                  y: obj.y,
                  w: obj.w,
                  h: obj.h,
                  text: obj.text || '',
                  fontSize: obj.fontSize,
                  fontFamily: obj.fontFamily,
                  fontWeight: obj.fontWeight,
                  textDecoration: obj.textDecoration,
                  textAlign: obj.textAlign,
                  color: obj.color,
                  shadow: obj.shadow,
                }
              : {
                  id: obj.id,
                  type: 'image',
                  x: obj.x,
                  y: obj.y,
                  w: obj.w,
                  h: obj.h,
                  src: obj.src || '',
                }
          ),
      })),
    };
  }, [currentId, title, slides, objects]);

  const save = useCallback(async () => {
    if (!email || !currentId) return;

    const presentation = buildPresentation();
    await saveToDB(presentation, presentation.id);
  }, [email, currentId, buildPresentation]);

  return {
    save,
    presentationId: currentId,
  };
}
