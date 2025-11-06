import type { Slide } from '../../store/types/types_of_presentation';
import styles from './Workspace.module.css';
import { SlideRender } from '../SlideRender/SlideRender';
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../../store/data/const_for_presantation';
import { changeObjectSize, changeObjectPosition } from '../../store/functions/functions_of_presentation'; // ← ДОБАВИТЬ resizeObject
import { dispatch } from '../../store/editor';

interface WorkspaceProps {
    currentSlide: Slide | undefined;
    currentSlideIndex?: number;

    currentSlideId: string | null;
    selectedObjectId?: string | null;
}

export function Workspace(props: WorkspaceProps) {
    if (!props.currentSlide) {
        return (
            <div className={styles.workspace}>
                <div className={styles.noSlide}>Создайте первый слайд</div>
            </div>
        );
    }

    function handleObjectClick(objectId: string, backgroundColor: string): void {
        console.log('Выбран элемент:', objectId, ' цвет фона:', backgroundColor);
    }

    function handleObjectMove(objectId: string, newX: number, newY: number): void {
        if (props.currentSlideId) {
            dispatch(changeObjectPosition, {
                slideId: props.currentSlideId,
                objectId: objectId,
                x: newX,
                y: newY
            });
        }
    }

    function handleObjectResize(objectId: string, newWidth: number, newHeight: number, newX: number, newY: number): void {
        if (props.currentSlideId) {
            dispatch(changeObjectSize, {
                slideId: props.currentSlideId,
                objectId: objectId,
                width: newWidth,
                height: newHeight,
                x: newX,
                y: newY
            });
        }
    }

    return (
        <div className={styles.workspace}>
            <div className={styles.workspaceContent}>
                <div 
                    className={styles.slideContainer}
                    style={{
                        width: `${SLIDE_WIDTH}px`,
                        height: `${SLIDE_HEIGHT}px`
                    }}
                >
                    <SlideRender
                        type={props.currentSlide}
                        isPreview={false}
                        selectedObjectId={props.selectedObjectId}
                        currentSlideId={props.currentSlideId}
                        onObjectClick={handleObjectClick}
                        onObjectMove={handleObjectMove}
                        onObjectResize={handleObjectResize} 
                    />
                </div>
            </div>

        </div>
    );
}