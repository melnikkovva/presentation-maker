import { type ImageObject} from '../../store/types/types_of_presentation';
import { resetObjectSelection, selectObject } from '../../store/functions/functions_of_presentation';
import { PREVIEW_SCALE } from '../../store/data/const_for_presantation';
import { dispatch, getPresentation } from '../../store/editor';

interface ImageObjectProps {
    object: ImageObject;
    isPreview: boolean;
    onImageClick?: ((objectId: string) => void);
}

export function ImageObject(props: ImageObjectProps) {
    const scale = props.isPreview ? PREVIEW_SCALE : 1;
    
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
                typeElement: 'image'
            });
            }
        }
        props.onImageClick?.(props.object.id);
    }

    const isSelected = getPresentation().selection?.objectId === props.object.id;

    return (
        <img                
            src={props.object.src}
            style={{
                position: 'absolute',
                left: `${props.object.x * scale}px`,
                top: `${props.object.y * scale}px`,
                width: `${props.object.w * scale}px`,
                height: `${props.object.h * scale}px`,
                cursor: 'pointer',
                border: isSelected ? '2px solid #468fdeff' : 'none',
                boxSizing: 'border-box'
            }}
            onClick={handleClick}
        />
    );
}