import React from 'react';
import { useDnd } from '../../hooks/useDragAndDrop';
import { SlideRender } from '../SlideRender/SlideRender';
import type { Slide } from "../../store/types/types_of_presentation";
import { SLIDE_HEIGHT, PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import styles from './DraggableSlideRender.module.css'

interface DraggableSlideRenderProps {
    slide: Slide;
    index: number;
    isActive: boolean;
    onSlideClick: (slideId: string, index: number) => void;
    onSlideReorder: (fromIndex: number, toIndex: number) => void;
    isPreview?: boolean;
}

export function DraggableSlideRender(props: DraggableSlideRenderProps) {
    const slideHeight = SLIDE_HEIGHT * PREVIEW_SCALE; 
    const startY = props.index * slideHeight;

    const dnd = useDnd({
        startX: 0,
        startY: startY,
        axis: 'y', 
        onDrag: (newX, newY) => {
            const newIndex = Math.max(0, Math.round(newY / slideHeight));            
            if (newIndex !== props.index) {
                props.onSlideReorder(props.index, newIndex);
            }
        },
        onFinish: (newX, newY) => {
            const finalIndex = Math.max(0, Math.round(newY / slideHeight));  
            props.onSlideReorder(props.index, finalIndex);
        }
    });

    const slideStyle: React.CSSProperties = {
        zIndex: dnd.isDragging ? 1000 : 'auto',
        position: 'relative',
    };

    return (
        <div
            style={slideStyle}
            className={
                props.isActive 
                    ? `${styles.slideItem} ${styles.activeSlide}`
                    : styles.slideItem
            }
        >
            <div 
                className={styles.slideContent}
                onClick={() => props.onSlideClick(props.slide.id, props.index)}
                onMouseDown={dnd.onMouseDown} 
            >
                <div className={styles.slideHeader}>
                    <div className={styles.slideNumber}>Слайд {props.index + 1}</div>
                </div>

                <div className={styles.slidePreview}>
                    <div className={styles.slidePreviewContent}>
                        <SlideRender
                            type={props.slide}
                            isPreview={true} 
                            className={styles.previewSlide}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}