import React, { useState, useEffect } from 'react';
import { type ImageObject as ImageObjectType } from '../../store/types/types_of_presentation';
import { resetObjectSelection, selectObject } from '../../store/functions/functions_of_presentation';
import { PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { dispatch } from '../../store/editor';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandlesSimple } from '../../hooks/ResizeHandle';
import styles from './ImageObject.module.css';

interface ImageObjectProps {
    object: ImageObjectType;
    isPreview: boolean;
    isSelected: boolean;
    currentSlideId?: string | null;
    onImageClick?: (objectId: string) => void;
    onObjectMove?: (objectId: string, newX: number, newY: number) => void;
    onObjectResize?: (objectId: string, newWidth: number, newHeight: number, newX: number, newY: number) => void;
}

export function ImageObject(props: ImageObjectProps) {
    const scale = props.isPreview ? PREVIEW_SCALE : 1;
    const isInteractive = !props.isPreview;

    const [position, setPosition] = useState({
        x: props.object.x * scale,
        y: props.object.y * scale
    });

    useEffect(() => {
        setPosition({
            x: props.object.x * scale,
            y: props.object.y * scale
        });
    }, [props.object.x, props.object.y, scale]);

    const drag = useDnd({
        startX: position.x,
        startY: position.y,
        onDrag: (newX, newY) => {
            setPosition({ x: newX, y: newY });
            if (props.onObjectMove) {
                const actualX = newX / scale;
                const actualY = newY / scale;
                props.onObjectMove(props.object.id, actualX, actualY);
            }
        },
        onFinish: (newX, newY) => {
            if (props.onObjectMove) {
                const actualX = newX / scale;
                const actualY = newY / scale;
                props.onObjectMove(props.object.id, actualX, actualY);
            }
        }
    });

    const resize = useResize({
        width: props.object.w * scale,
        height: props.object.h * scale,
        x: position.x,
        y: position.y,
        enabled: isInteractive && props.isSelected,
        onResize: (newWidth, newHeight, newX, newY) => {
            setPosition({ x: newX, y: newY });
            if (props.onObjectResize) {
                const actualWidth = newWidth / scale;
                const actualHeight = newHeight / scale;
                const actualX = newX / scale;
                const actualY = newY / scale;
                props.onObjectResize(props.object.id, actualWidth, actualHeight, actualX, actualY);
            }
        },
        onResizeEnd: (newWidth, newHeight, newX, newY) => {
            if (props.onObjectResize) {
                const actualWidth = newWidth / scale;
                const actualHeight = newHeight / scale;
                const actualX = newX / scale;
                const actualY = newY / scale;
                props.onObjectResize(props.object.id, actualWidth, actualHeight, actualX, actualY);
            }
        },
        minWidth: 20,
        minHeight: 20
    });

    function handleClick(event: React.MouseEvent): void {
        if (props.isPreview) return;
        event.stopPropagation();

        if (props.currentSlideId) {
            if (props.isSelected) {
                dispatch(resetObjectSelection);
            } else {
                dispatch(selectObject, {
                    slideId: props.currentSlideId,
                    objectId: props.object.id,
                    typeElement: 'image'
                });
            }
        }
        props.onImageClick?.(props.object.id);
    }

    const containerClass = [
        styles.container,
        props.isSelected ? styles.containerSelected : ''
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
                src={props.object.src}
                className={imageClass}
                onClick={handleClick}
                onMouseDown={drag.onMouseDown}
            />

            {props.isSelected && isInteractive && (
            <ResizeHandlesSimple onMouseDown={resize.onResizeHandleMouseDown} />)}
        </div>
    );
}