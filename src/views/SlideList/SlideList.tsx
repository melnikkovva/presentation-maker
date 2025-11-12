import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { reorderSlides } from '../../store/actions/ActionCreators';
import styles from './SlideList.module.css';
import { DraggableSlideRender } from '../SlideRender/DraggableSlideRender';

export function SlideList() {
    const slides = useAppSelector(state => state.presentation.slides.slides);
    const dispatch = useAppDispatch();

    function handleSlideReorder(fromIndex: number, toIndex: number): void {
        dispatch(reorderSlides(fromIndex, toIndex));
    }

    return (
        <div className={styles.slideListContainer}>
            <div className={styles.slideListHeader}>
                <div className={styles.slideListTitle}>
                    Слайды ({slides.length})
                </div> 
            </div>
            
            <div className={styles.slideList}>
                {slides.map((slide, index) => ( 
                    <DraggableSlideRender
                        key={slide.id}
                        slideId={slide.id}
                        index={index}
                        onReorder={handleSlideReorder}
                    />
                ))}
            </div>
        </div>
    );
}