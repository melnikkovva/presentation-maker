import type { Slide } from "../../store/types/types_of_presentation";
import { TextObject } from "../../common/Text/TextObject";
import { ImageObject } from "../../common/Image/ImageObject";
import styles from './SlideRender.module.css'

interface SlideProps {
    type: Slide
    isPreview: boolean;
    onObjectClick?: (objectId: string, backgroundColor: string) => void;
    className?: string;
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

    function getBackgroundColor(): string {
        if (props.type.background.type === 'color') {
            return props.type.background.color;
        } else {
            return 'image'; 
        }
    }

    const style: React.CSSProperties = {
        ...getSlideBackgroundStyle(),
        position: 'relative',
        width: '100%',
        height: '100%'
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
                                onTextClick={(objectId) => props.onObjectClick?.(objectId, getBackgroundColor())}
                            />
                        );
                    } else {
                        return (
                            <ImageObject
                                key={object.id}
                                object={object}
                                isPreview={props.isPreview}
                                onImageClick={(objectId) => props.onObjectClick?.(objectId, getBackgroundColor())}
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