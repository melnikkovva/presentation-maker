import { type ImageObject as ImageObjectType } from '../../../store/types/types_of_presentation';
import { resetObjectSelection, selectObject } from '../../../store/functions/functions_of_presentation';
import { dispatch } from '../../../store/editor';
import { SlideObject } from '../SlideObject';

interface ImageObjectProps {
    object: ImageObjectType;
    isPreview: boolean;
    isSelected: boolean;
    currentSlideId?: string | null;
    onObjectMove?: (objectId: string, newX: number, newY: number) => void;
    onObjectResize?: (objectId: string, newWidth: number, newHeight: number, newX: number, newY: number) => void;
}

export function ImageObject(props: ImageObjectProps) {
    const handleClick = () => {
        if (props.isPreview || !props.currentSlideId) return;

        if (props.isSelected) {
            dispatch(resetObjectSelection);
        } else {
            dispatch(selectObject, {
                slideId: props.currentSlideId,
                objectId: props.object.id,
                typeElement: 'image'
            });
        }
    };

    return (
        <SlideObject
            object={props.object}
            isPreview={props.isPreview}
            isSelected={props.isSelected}
            onObjectClick={handleClick}
            onObjectMove={props.onObjectMove}
            onObjectResize={props.onObjectResize}
        >
            <img
                src={props.object.src}
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                }}
            />
        </SlideObject>
    );
}