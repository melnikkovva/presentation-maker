import { useAppSelector } from "../../store/hooks";
import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from  "../../common/Image/ImageObject";
import { selectSlideById, selectObjectsBySlideId } from "../../store/selectors/presentationSelectors";
import styles from './SlideRender.module.css';

type SlideRenderProps = {
  slideId: string | null;
  isPreview?: boolean;
}

export function SlideRender({ slideId, isPreview = false }: SlideRenderProps) {
  const slide = useAppSelector(selectSlideById(slideId || ''));
  const objects = useAppSelector(selectObjectsBySlideId(slideId || ''));

  const objects = useAppSelector(selectObjectsInCurrentSlide);

  if (!slide) {
    return null;
  }

  function getSlideBackgroundStyle(slideBackground: any): React.CSSProperties {
    if (slideBackground.type === 'color') {
      return { backgroundColor: slideBackground.color };
    } else {
      return { 
        backgroundImage: `url(${slideBackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }; 
    }
  }

  const style: React.CSSProperties = {
    ...getSlideBackgroundStyle(slide.background),
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