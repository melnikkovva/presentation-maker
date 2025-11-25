import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { reorderSlides, setCurrentSlide } from '../../store/slices/slidesSlice';
import styles from './SlideList.module.css';
import { DraggableSlideRender } from '../SlideRender/DraggableSlideRender';
import { selectSlides } from '../../store/selectors/presentationSelectors';
import {selectSlide} from '../../store/slices/selectionSlice'

export function SlideList() {
    const slides = useAppSelector(selectSlides);
    const dispatch = useAppDispatch();

    function handleSlideReorder(fromIndex: number, toIndex: number): void {
        dispatch(reorderSlides({ fromIndex, toIndex }));
    }

    function handleCurrentslide(slideId: string): void {
        dispatch(selectSlide(slideId));
        dispatch(setCurrentSlide(slideId)); 
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
                        onClick={() => handleCurrentslide(slide.id)}
                    />
                ))}
            </div>
        </div>
    );
}