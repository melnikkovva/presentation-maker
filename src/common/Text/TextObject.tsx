import React from 'react'
import { getPresentation, dispatch } from '../../store/editor';
import { resetObjectSelection, selectObject } from '../../store/functions/functions_of_presentation';
import type { TextObject } from '../../store/types/types_of_presentation'
import { DEFAULT_PADDING_TEXT_FIELD, PREVIEW_SCALE } from '../../store/data/const_for_presantation';

interface TextObjectProps {
    object: TextObject;
    isPreview: boolean;
    onTextClick?: ((objectId: string) => void);
}

export function TextObject(props: TextObjectProps) {
    const scale = props.isPreview ? PREVIEW_SCALE : 1;

    const isSelected = getPresentation().selection?.objectId === props.object.id;

    function handleClick(): void {
        const presentation = getPresentation();

        if (presentation.slides.currentSlideId && !props.isPreview) {
            if (isSelected) {
                dispatch(resetObjectSelection, presentation)
            }
            else {
                dispatch(selectObject, {
                slideId: presentation.slides.currentSlideId,
                objectId: props.object.id,
                typeElement: 'text'
            });
            }
        }
        props.onTextClick?.(props.object.id);
    }

    const textStyle: React.CSSProperties = {
        fontSize: `${props.object.fontSize * scale}px`,
        fontFamily: props.object.fontFamily,
        fontWeight: props.object.fontWeight,
        textDecoration: props.object.textDecoration,
        textAlign: props.object.textAlign,
        color: props.object.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: props.object.textAlign === 'left' ? 'flex-start' : 
                       props.object.textAlign === 'right' ? 'flex-end' : 'center',
        padding: `${DEFAULT_PADDING_TEXT_FIELD}px`,
        margin: 0,
        boxSizing: 'border-box',
        position: 'absolute',
        left: `${props.object.x * scale}px`,
        top: `${props.object.y * scale}px`,
        width: `${props.object.w * scale}px`,
        height: `${props.object.h * scale}px`,
        cursor: 'pointer',
        border: isSelected ? '2px solid #007bff' : 'none',
        borderRadius: '2px'
    };

    if (props.object.shadow) {
        textStyle.textShadow = `${props.object.shadow.x}px ${props.object.shadow.y}px ${props.object.shadow.blur}px ${props.object.shadow.color}`;
    }

    return (
        <div 
            style={textStyle}
            onClick={handleClick}
        >
            {props.object.text}
        </div>
    );
}