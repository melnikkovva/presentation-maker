import { useAppSelector } from "../../store/hooks";
import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from  "../../common/Image/ImageObject";
import { selectObjectsInCurrentSlide } from "../../store/selectors/presentationSelectors";
import type { Slide } from "../../store/types/types_of_presentation";
import styles from './SlideRender.module.css';

type SlideRenderProps = {
  slideId: string | null;
  isPreview?: boolean;
}

export function SlideRender({ slideId, isPreview = false }: SlideRenderProps) {
  const slide = useAppSelector(state => 
    state.slides.slides.find(s => s.id === slideId)
  );

  const objects = useAppSelector(selectObjectsInCurrentSlide);

  if (!slide) {
    return null;
  }

  function getSlideBackgroundStyle(slide: Slide): React.CSSProperties {
    if (slide.background.type === 'color') {
      return { backgroundColor: slide.background.color };
    } else {
      return { 
        backgroundImage: `url(${slide.background.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }; 
    }
  }

  const style: React.CSSProperties = {
    ...getSlideBackgroundStyle(slide),
    position: 'relative',
    width: '100%',
    height: '100%',
    pointerEvents: isPreview ? 'none' : 'auto' 
  };

  return (
    <div style={style}>
      {objects.length > 0 
        ? objects.map(object => {
            if (object.type === 'text') {
              return (
                <TextObject
                  key={object.id}
                  objectId={object.id}
                  isPreview={isPreview}
                />
              );
            } else if (object.type === 'image') {
              return (
                <ImageObject
                  key={object.id}
                  objectId={object.id}
                  isPreview={isPreview}
                />
              );
            }
            return null;
          })                             
        : (
            <div className={styles.emptySlide}>
              Пустой слайд
            </div>
          )}
    </div>
  );
}