import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectSlides } from '../../store/selectors/presentationSelectors';
import { resetPresentation } from '../../store/slices/presentationSlice';
import { loadPresentation } from '../../store/thunk/presentationThunks';
import { SlideRender } from '../SlideRender/SlideRender';
import { SLIDE_WIDTH_PLAYER, SLIDE_HEIGHT_PLAYER } from '../../store/data/const_for_presantation';
import { ROUTES } from '../../store/data/const_for_presantation';
import styles from './Player.module.css';

export function Player() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presentationId = params.get('id');
  const dispatch = useAppDispatch();

  const slides = useAppSelector(selectSlides);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!presentationId) {
      dispatch(resetPresentation());
      return;
    }
    dispatch(loadPresentation(presentationId)).catch(console.error);
  }, [presentationId]);

  const slide = slides?.[slideIndex];
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === (slides?.length ?? 1) - 1;

  if (!slides || slides.length === 0) {
    return <div className={styles.error}>ПРЕЗЕНТАЦИЯ НЕ НАЙДЕНА</div>;
  }

  const handlePrev = () => !isFirst && setSlideIndex(i => i - 1);
  const handleNext = () => !isLast && setSlideIndex(i => i + 1);
  const handleBack = () => navigate(`${ROUTES.EDITOR}?id=${presentationId}`);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast]);

  return (
    <div className={styles.container}>
      <div
        className={styles.slideWrapper}
        style={{
          '--slide-width': `${SLIDE_WIDTH_PLAYER}px`,
          '--slide-height': `${SLIDE_HEIGHT_PLAYER}px`,
        } as React.CSSProperties}
        onClick={handleNext} 
      >
        {slide && (
          <SlideRender
            slideId={slide.id}
            isPlayer={true}
          />
        )}

        <div className={styles.overlayControls}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={isFirst}
            className={`${styles.navButton} ${styles.navButtonLeft} ${isFirst ? styles.disabled : ''}`}
            aria-label="Предыдущий слайд"
          >
            ←
          </button>

          <div className={styles.slideCounter}>
            {slideIndex + 1} / {slides.length}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            disabled={isLast}
            className={`${styles.navButton} ${styles.navButtonRight} ${isLast ? styles.disabled : ''}`}
            aria-label="Следующий слайд"
          >
            →
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBack();
            }}
            className={styles.backButton}
            aria-label="Вернуться в редактор"
          >
            НАЗАД
          </button>
        </div>
      </div>
    </div>
  );
}