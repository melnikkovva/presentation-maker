import { useEffect } from 'react';
import { useState } from 'react';
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

  const slide = slides[slideIndex];
  const isFirst = slideIndex === 0;
  const isLast = slideIndex === slides.length - 1;

  if (!slides || slides.length === 0) {
    return <div className={styles.error}>ПРЕЗЕНТАЦИЯ НЕ НАЙДЕНА</div>;
  }

  return (
    <div className={styles.container}>
      <main className={styles.slideArea}>
        <div
          className={styles.slideWrapper}
          style={{
            '--slide-width': `${SLIDE_WIDTH_PLAYER}px`,
            '--slide-height': `${SLIDE_HEIGHT_PLAYER}px`,
          } as React.CSSProperties}
        >
          {slide && <SlideRender slideId={slide.id} isPlayer={true} />}
        </div>
      </main>

      <div className={styles.controls}>
        <button
          disabled={isFirst}
          onClick={() => setSlideIndex(i => i - 1)}
          className={`${styles.navButtonLeft} ${isFirst ? styles.disabled : ''}`}
          aria-label="Предыдущий слайд"
        >
          ←
        </button>

        <div className={styles.slideCounter}>
          {slideIndex + 1} / {slides.length}
        </div>

        <button
          disabled={isLast}
          onClick={() => setSlideIndex(i => i + 1)}
          className={`${styles.navButtonRight} ${isLast ? styles.disabled : ''}`}
        >
          →
        </button>

        <button
          className={styles.backButton}
          onClick={() => navigate(`${ROUTES.EDITOR}?id=${presentationId}`)}
        >
          НАЗАД
        </button>
      </div>
    </div>
  );
}