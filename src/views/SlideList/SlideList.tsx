import type { Slide } from '../../store/types/types_of_presentation';
import styles from './SlideList.module.css';
import { DraggableSlideRender } from '../SlideRender/DraggableSlideRender';

interface SlideListProps {
    slides: Slide[]; 
    currentSlideId: string | null;
    onSlideClick: (slideId: string, index: number) => void;
    onSlidesReorder?: (reorderedSlides: Slide[]) => void;
}

export function SlideList(props: SlideListProps) {
    function handleSlideClick(slideId: string, index: number): void {
        props.onSlideClick(slideId, index);
    };

    function handleSlideReorder(fromIndex: number, toIndex: number): void {
        if (!props.onSlidesReorder) return;
        
        const reorderedSlides = props.slides; 
        const [movedSlide] = reorderedSlides.splice(fromIndex, 1);
        reorderedSlides.splice(toIndex, 0, movedSlide);
        
        props.onSlidesReorder(reorderedSlides);
    }

    return (
        <div className={styles.slideListContainer}>
            <div className={styles.slideListHeader}>
                <div className={styles.slideListTitle}>
                    Слайды ({props.slides.length})
                </div> 
            </div>
            
            <div className={styles.slideList}>
                {props.slides.map((slide, index) => ( 
                    <DraggableSlideRender
                        key={slide.id}
                        slide={slide}
                        index={index}
                        isActive={slide.id === props.currentSlideId}
                        onSlideClick={handleSlideClick}
                        onSlideReorder={handleSlideReorder}
                    />
                ))}
            </div>
        </div>
    );
}