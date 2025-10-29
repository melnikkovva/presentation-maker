import type { Slide } from "../../store/types/types_of_presentation";
import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from "../../common/Image/ImageObject";
import styles from './SlideRender.module.css'

interface SlideProps {
    type: Slide
    isPreview: boolean;
    onObjectClick?: (objectId: string, backgroundColor: string) => void;
    onObjectMove?: (objectId: string, newX: number, newY: number) => void;
    onObjectResize?: (objectId: string, newWidth: number, newHeight: number, newX: number, newY: number) => void; 
    className?: string;
    selectedObjectId?: string | null;
    currentSlideId?: string | null;
}

export function SlideRender (props: SlideProps) {

    function getSlideBackgroundStyle(): React.CSSProperties {
        if (props.type.background.type === 'color') {
            return { backgroundColor: props.type.background.color };
        } else {
            return { 
                backgroundImage: `url(${props.type.background.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }; 
        }
    };

    const style: React.CSSProperties = {
        ...getSlideBackgroundStyle(),
        position: 'relative',
        width: '100%',
        height: '100%',
        pointerEvents: props.isPreview ? 'none' : 'auto' 
    };

    return (
        <div style={style}>
            {props.type.slideObjects.length > 0 
                ? props.type.slideObjects.map(object => {
                    if (object.type === 'text') {
                        return (
                            <TextObject
                                key={object.id}
                                object={object}
                                isPreview={props.isPreview}
                                onObjectMove={props.isPreview 
                                                ? undefined 
                                                : props.onObjectMove} 
                                onObjectResize={props.isPreview 
                                                ? undefined 
                                                : props.onObjectResize} 
                                currentSlideId={props.currentSlideId}
                                isSelected={(object.id) === props.selectedObjectId}
                            />
                        );
                    } else {
                        return (
                            <ImageObject
                                key={object.id}
                                object={object}
                                isPreview={props.isPreview}
                                onObjectMove={props.isPreview ? undefined : props.onObjectMove} 
                                onObjectResize={props.isPreview ? undefined : props.onObjectResize} 
                                currentSlideId={props.currentSlideId}
                                isSelected={(object.id) === props.selectedObjectId}
                            />
                        );
                    }
                })                             
                : (
                    <div className={styles.emptySlide}>
                        Пустой слайд
                    </div>
                )}
        </div>
    )
}