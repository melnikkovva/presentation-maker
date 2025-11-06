=import { dispatch } from '../../../store/editor';
import { selectObject, toggleObjectSelection } from '../../../store/functions/functions_of_presentation';
import type { TextObject as TextObjectType } from '../../../store/types/types_of_presentation';
import { SlideObject } from '../SlideObject';

interface TextObjectProps {
    object: TextObjectType;
    isPreview: boolean;
    isSelected: boolean;
    currentSlideId?: string | null;
    isCtrlPressed?: boolean;
}

export function TextObject(props: TextObjectProps) {
    const handleClick = () => {
        if (props.isPreview || !props.currentSlideId) return;

        if (props.isCtrlPressed) {
            dispatch(toggleObjectSelection, {
                slideId: props.currentSlideId,
                objectId: props.object.id,
                typeElement: 'text'
            });
        } else {
            dispatch(selectObject, {
                slideId: props.currentSlideId,
                objectId: props.object.id,
                typeElement: 'text'
            });
        }
    };

    return (
        <SlideObject
            object={props.object}
            isPreview={props.isPreview}
            isSelected={props.isSelected}
            onObjectClick={handleClick}
        >
            <div style={{
                fontSize: `${props.object.fontSize}px`,
                fontFamily: props.object.fontFamily,
                fontWeight: props.object.fontWeight,
                color: props.object.color,
                textAlign: props.object.textAlign,
                width: '100%',
                height: '100%',
                padding: '8px',
                boxSizing: 'border-box'
            }}>
                {props.object.text}
            </div>
        </SlideObject>
    );
}