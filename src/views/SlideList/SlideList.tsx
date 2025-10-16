import type { Slide } from '../../store/types/types_of_presentation';
import styles from './SlideList.module.css';
import { SlideRender } from '../SlideRender/SlideRender';

interface SlideListProps {
    slides: Slide[];
    currentSlideId: string | null;
    onSlideClick: (slideId: string, index: number) => void;
}

export function SlideList(props: SlideListProps) {
    function handleSlideClick(slideId: string, index: number): void {
        props.onSlideClick(slideId, index);
    };

    return (
        <div className={styles.slideListContainer}>
            <div className={styles.slideListHeader}>
                <div className={styles.slideListTitle}>Слайды ({props.slides.length})</div>
            </div>
            
            <div className={styles.slideList}>
                {props.slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={
                            slide.id === props.currentSlideId 
                                ? `${styles.slideItem} ${styles.activeSlide}`
                                : styles.slideItem
                        }
                        onClick={() => handleSlideClick(slide.id, index)} 
                    >
                        <div className={styles.slideHeader}>
                            <div className={styles.slideNumber}>Слайд {index + 1}</div>
                        </div>

                        <div className={styles.slidePreview}>
                            <div className={styles.slidePreviewContent}>
                                <SlideRender
                                    type={slide}
                                    isPreview={true}
                                    className={styles.previewSlide}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}