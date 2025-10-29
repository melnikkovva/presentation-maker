import React, { useState, useEffect } from 'react';
import { dispatch } from '../../store/editor';
import { resetObjectSelection, selectObject } from '../../store/functions/functions_of_presentation';
import type { TextObject as TextObjectType } from '../../store/types/types_of_presentation';
import { DEFAULT_PADDING_TEXT_FIELD, PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { useDnd } from '../../hooks/useDragAndDrop';
import { useResize } from '../../hooks/useResize';
import { ResizeHandlesSimple } from '../../hooks/ResizeHandle';
import styles from './TextObject.module.css';

interface TextObjectProps {
    object: TextObjectType;
    currentSlideId?: string | null;
    isPreview: boolean;
    isSelected: boolean;
    onTextClick?: (objectId: string) => void;
    onObjectMove?: (objectId: string, newX: number, newY: number) => void;
    onObjectResize?: (objectId: string, newWidth: number, newHeight: number, newX: number, newY: number) => void;
}

export function TextObject(props: TextObjectProps) {
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
        minWidth: 50,
        minHeight: 30
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
            typeElement: 'text'
            });
        }
        }
        props.onTextClick?.(props.object.id);
    }

    const getTextAlignClass = () => {
        switch (props.object.textAlign) {
        case 'left': return styles.textContentLeft;
        case 'right': return styles.textContentRight;
        default: return styles.textContentCenter;
        }
    };

    const containerClasses = [
        styles.container,
        props.isSelected ? styles.containerSelected : ''
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
        fontSize: `${props.object.fontSize * scale}px`,
        fontFamily: props.object.fontFamily,
        fontWeight: props.object.fontWeight,
        textDecoration: props.object.textDecoration,
        color: props.object.color,
        padding: `${DEFAULT_PADDING_TEXT_FIELD}px`,
    };

    if (props.object.shadow) {
        textStyle.textShadow = `${props.object.shadow.x}px 
                                ${props.object.shadow.y}px 
                                ${props.object.shadow.blur}px 
                                ${props.object.shadow.color}`;
    }

    return (
        <div className={containerClasses} style={containerStyle}>
        <div
            className={textClasses}
            style={textStyle}
            onClick={handleClick}
            onMouseDown={drag.onMouseDown}
        >
            {props.object.text}
        </div>

        {props.isSelected && isInteractive && (
            <ResizeHandlesSimple onMouseDown={resize.onResizeHandleMouseDown} />
        )}
        </div>
    );
}