import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectSlide } from '../../store/slices/selectionSlice'; 
import { SlideRender } from '../SlideRender/SlideRender';
import { useDnd } from '../../hooks/useDragAndDrop';
import styles from './DraggableSlideRender.module.css';
import { PREVIEW_SCALE, SLIDE_HEIGHT } from '../../store/data/const_for_presantation';
import { selectCurrentSlideId, selectSlides } from '../../store/selectors/presentationSelectors';

type DraggableSlideRenderProps = {
    slideId: string;
    index: number;
    onReorder: (fromIndex: number, toIndex: number) => void;
    onClick?: () => void;
}

export function DraggableSlideRender({ slideId, index, onReorder, onClick }: DraggableSlideRenderProps) {
    const currentSlideId = useAppSelector(selectCurrentSlideId);
    const slides = useAppSelector(selectSlides);
    const dispatch = useAppDispatch();

    const isActive = slideId === currentSlideId;
    const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

    const drag = useDnd({
        startX: 0,
        startY: 0,
        axis: 'y', 
        onDrag: (newX, newY) => {
            if (dragStartIndex !== null) {
                const deltaY = newY;
                const slideHeight = SLIDE_HEIGHT * PREVIEW_SCALE; 
                const newIndex = dragStartIndex + Math.round(deltaY / slideHeight);
                
                const clampedIndex = Math.max(0, Math.min(newIndex, slides.length - 1));
                
                if (clampedIndex !== dragStartIndex) {
                   
                }
            }
        },
        onFinish: (newX, newY) => {
            if (dragStartIndex !== null) {
                const deltaY = newY;
                const slideHeight = SLIDE_HEIGHT * PREVIEW_SCALE; 
                const newIndex = dragStartIndex + Math.round(deltaY / slideHeight);
                
                const clampedIndex = Math.max(0, Math.min(newIndex, slides.length - 1));
                
                if (clampedIndex !== dragStartIndex) {
                    onReorder(dragStartIndex, clampedIndex);
                }
            }
            setDragStartIndex(null);
        }
    });

    function handleSlideClick(): void {
        if (!drag.isDragging) {
            onClick?.(); 
            dispatch(selectSlide(slideId));         
        }
    }

    function handleMouseDown(event: React.MouseEvent): void {
        setDragStartIndex(index);
        drag.onMouseDown(event);
    }

    return (
        <div 
            className={`${styles.slideItem} ${isActive ? styles.active : ''} ${drag.isDragging ? styles.dragging : ''}`}
            onClick={handleSlideClick}
            onMouseDown={handleMouseDown}
        >
            <div className={styles.slideNumber}>{index + 1}</div>
            <div className={styles.slidePreview}>
                <SlideRender 
                    slideId={slideId}
                    isPreview={true}
                />
            </div>
        </div>
    );

}