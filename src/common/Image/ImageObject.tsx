import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectObject, changeObjectPosition, changeObjectSize } from '../../store/actions/ActionCreators';
import { PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import type { ImageObject as ImageObjectType } from '../../store/types/types_of_presentation';
import styles from './ImageObject.module.css';

interface ImageObjectProps {
    objectId: string;
    isPreview: boolean;
}

export function ImageObject({ objectId, isPreview }: ImageObjectProps) {
    const object = useAppSelector(state => 
        state.presentation.slides.slides.flatMap(slide => slide.slideObjects)
            .find(obj => obj.id === objectId && obj.type === 'image') as ImageObjectType | undefined
    );
    const selectedObjectId = useAppSelector(state => state.presentation.selection?.objectId);
    const currentSlideId = useAppSelector(state => state.presentation.slides.currentSlideId);
    const dispatch = useAppDispatch();

    const scale = isPreview ? PREVIEW_SCALE : 1;
    const isInteractive = !isPreview;
    const isSelected = objectId === selectedObjectId;

    const [position, setPosition] = useState({
        x: object?.x ? object.x * scale : 0,
        y: object?.y ? object.y * scale : 0
    });

    useEffect(() => {
        if (object) {
            setPosition({
                x: object.x * scale,
                y: object.y * scale
            });
        }
    }, [object?.x, object?.y, scale]);

    const drag = useDnd({
        startX: position.x,
        startY: position.y,
        onDrag: (newX, newY) => {
            setPosition({ x: newX, y: newY });
            if (object && currentSlideId) {
                const actualX = newX / scale;
                const actualY = newY / scale;
                dispatch(changeObjectPosition(currentSlideId, object.id, actualX, actualY));
            }
        },
        onFinish: (newX, newY) => {
            if (object && currentSlideId) {
                const actualX = newX / scale;
                const actualY = newY / scale;
                dispatch(changeObjectPosition(currentSlideId, object.id, actualX, actualY));
            }
        }
    });

    const resize = useResize({
        width: object?.w ? object.w * scale : 100,
        height: object?.h ? object.h * scale : 100,
        x: position.x,
        y: position.y,
        enabled: isInteractive && isSelected,
        onResize: (newWidth, newHeight, newX, newY) => {
            setPosition({ x: newX, y: newY });
            if (object && currentSlideId) {
                const actualWidth = newWidth / scale;
                const actualHeight = newHeight / scale;
                const actualX = newX / scale;
                const actualY = newY / scale;
                dispatch(changeObjectSize(currentSlideId, object.id, actualWidth, actualHeight, actualX, actualY));
            }
        },
        onResizeEnd: (newWidth, newHeight, newX, newY) => {
            if (object && currentSlideId) {
                const actualWidth = newWidth / scale;
                const actualHeight = newHeight / scale;
                const actualX = newX / scale;
                const actualY = newY / scale;
                dispatch(changeObjectSize(currentSlideId, object.id, actualWidth, actualHeight, actualX, actualY));
            }
        },
        minWidth: 20,
        minHeight: 20
    });

    function handleClick(event: React.MouseEvent): void {
        if (isPreview || !object) return;
        event.stopPropagation();

        if (isSelected) {
            dispatch(selectObject(null));
        } else {
            dispatch(selectObject(object.id));
        }
    }

    if (!object) {
        return null;
    }

    const containerClass = [
        styles.container,
        isSelected ? styles.containerSelected : ''
    ].join(' ');

    const imageClass = [
        styles.image,
        drag.isDragging ? styles.cursorGrabbing : styles.cursorPointer
    ].join(' ');

    const containerStyle: React.CSSProperties = {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${resize.width}px`,
        height: `${resize.height}px`,
    };

    return (
        <div className={containerClass} style={containerStyle}>
            <img
                src={object.src}
                className={imageClass}
                onClick={handleClick}
                onMouseDown={drag.onMouseDown}
            />

            {isSelected && isInteractive && (
                <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
            )}
        </div>
    );
}