import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectObject, changeObjectPosition, changeObjectSize } from '../../store/actions/ActionCreators';
import { DEFAULT_PADDING_TEXT_FIELD, PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandles } from '../../hooks/ResizeHandle';
import type { TextObject as TextObjectType } from '../../store/types/types_of_presentation';
import styles from './TextObject.module.css';

interface TextObjectProps {
    objectId: string;
    isPreview: boolean;
}

export function TextObject({ objectId, isPreview }: TextObjectProps) {
    const object = useAppSelector(state => 
        state.presentation.slides.slides.flatMap(slide => slide.slideObjects)
            .find(obj => obj.id === objectId && obj.type === 'text') as TextObjectType | undefined
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
        height: object?.h ? object.h * scale : 50,
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
        minWidth: 50,
        minHeight: 30
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

    const getTextAlignClass = () => {
        switch (object.textAlign) {
            case 'left': return styles.textContentLeft;
            case 'right': return styles.textContentRight;
            default: return styles.textContentCenter;
        }
    };

    const containerClasses = [
        styles.container,
        isSelected ? styles.containerSelected : ''
    ].join(' ');

    const textClasses = [
        styles.textContent,
        getTextAlignClass(),
        drag.isDragging ? styles.cursorGrabbing : styles.cursorPointer
    ].join(' ');

    const containerStyle: React.CSSProperties = {
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${resize.width}px`,
        height: `${resize.height}px`,
    };

    const textStyle: React.CSSProperties = {
        fontSize: `${object.fontSize * scale}px`,
        fontFamily: object.fontFamily,
        fontWeight: object.fontWeight,
        textDecoration: object.textDecoration,
        color: object.color,
        padding: `${DEFAULT_PADDING_TEXT_FIELD}px`,
    };

    if (object.shadow) {
        textStyle.textShadow = `${object.shadow.x}px 
                                ${object.shadow.y}px 
                                ${object.shadow.blur}px 
                                ${object.shadow.color}`;
    }

    return (
        <div className={containerClasses} style={containerStyle}>
            <div
                className={textClasses}
                style={textStyle}
                onClick={handleClick}
                onMouseDown={drag.onMouseDown}
            >
                {object.text}
            </div>

            {isSelected && isInteractive && (
                <ResizeHandles onMouseDown={resize.onResizeHandleMouseDown} />
            )}
        </div>
    );
}