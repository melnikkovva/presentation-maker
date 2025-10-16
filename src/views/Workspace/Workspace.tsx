import type { Slide} from '../../store/types/types_of_presentation';
import styles from './Workspace.module.css';
import { SlideRender } from '../SlideRender/SlideRender';
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../../store/data/const_for_presantation';

interface WorkspaceProps {
    currentSlide: Slide | undefined;
    currentSlideIndex?: number; 
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
                        onObjectClick={handleObjectClick}
                    />
                </div>
            </div>
        </div>
    );
}